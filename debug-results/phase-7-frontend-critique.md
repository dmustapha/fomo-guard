# Phase 7: Frontend Critique

## Verdict: APPROVE with warnings

**Intent:** Single-page Next.js 15 demo app that compares a "normal AI shopping assistant" vs "FOMO Guard" persona side-by-side, showing how the persona intercepts impulsive purchases and finds cheaper alternatives via the Purch x402 API. Includes a Vault lifecycle section (search/buy/download a persona ZIP). Pre-cached demo scenarios for reliability, live API fallback for custom input.

---

## Findings

### MUST-FIX

**[MUST-FIX-1] split-screen.tsx:41 — Crash when `analysis.alternatives` is empty array**

`analysis.alternatives[0]` is passed directly to `<ProductCard product={...}>`. If the live API path returns an empty `alternatives` array (which is possible when `alternative.price >= original.price` and `searchResult.products` is empty), this renders `ProductCard` with `undefined` as the `product` prop. The guard on line 34 only checks `savingsAmount > 0`, but `savingsAmount` is 0 in that path so the card section is skipped. **However**, if the API returns an alternative that costs the same as the original (`alternative.price === original.price`), `savingsAmount` would be 0, alternatives would be `[alternative, ...]` (non-empty), and the condition on line 34 would correctly skip rendering. This is actually safe by current logic, but fragile.

**Real crash path:** In `analyze-intent.ts:99`, when the live API succeeds and `alternative.price < original.price`, `savingsAmount` is positive and `alternatives` is `[alternative, ...searchResult.products.slice(1, 3)]`. If `alternative` exists but `searchResult.products` is a 1-element array, `alternatives[0]` is still the `alternative` — safe. **Downgrading to SHOULD-FIX** after trace. The guard holds.

**[MUST-FIX-1] page.tsx:30 — Cumulative savings accumulate incorrectly on re-runs of same scenario**

When a user clicks the same scenario button twice (easy to do during a demo), `setTotalSaved((prev) => prev + result.savingsAmount)` adds the savings again. After 3 clicks of "Headphones", the tracker shows $780 saved instead of $260. During a live demo, this looks like a bug — the number keeps growing with every click.

**Suggested fix:**
```tsx
// Track which scenarios have been counted
const [countedScenarios, setCountedScenarios] = useState<Set<string>>(new Set());

// In runAnalysis:
if (scenarioId && !countedScenarios.has(scenarioId)) {
  setTotalSaved((prev) => prev + result.savingsAmount);
  setCountedScenarios((prev) => new Set(prev).add(scenarioId));
} else if (!scenarioId) {
  setTotalSaved((prev) => prev + result.savingsAmount);
}
```

**[MUST-FIX-2] page.tsx:22-33 — No error UI when `analyzeIntent` throws on custom input**

The `runAnalysis` callback has a `try/finally` but no `catch`. If `analyzeIntent` throws (network error, x402 wallet empty, API down), the promise rejection propagates unhandled. `isLoading` resets to false (good), but the user sees the loading dots disappear with no feedback — just a blank chat panel. For demo scenarios this is mitigated by the server-side fallback in `analyze-intent.ts:104-118`, but for custom input where the fallback might also fail (e.g., `DEMO_SCENARIOS[0]` is used but the error was in the return serialization), the user gets nothing.

**Suggested fix:**
```tsx
const [error, setError] = useState<string | null>(null);

const runAnalysis = useCallback(async (message: string, scenarioId?: string) => {
  setIsLoading(true);
  setError(null);
  setUserMessage(message);
  setActiveScenarioId(scenarioId ?? null);
  try {
    const result = await analyzeIntent(message, scenarioId);
    setAnalysis(result);
    setTotalSaved((prev) => prev + result.savingsAmount);
  } catch (err) {
    setError("Analysis failed. Try a demo scenario instead.");
  } finally {
    setIsLoading(false);
  }
}, []);
```
Then render `{error && <p className="text-red-400 text-sm text-center">{error}</p>}` below the form.

**[MUST-FIX-3] vault-lifecycle.tsx:88 — `process.env.NEXT_PUBLIC_DEMO_WALLET_ADDRESS` accessed at runtime in client component but likely not set**

`handleBuy` passes `process.env.NEXT_PUBLIC_DEMO_WALLET_ADDRESS ?? ""` as the wallet address. If this env var is not set, the buy request sends an empty string as the wallet address, which will almost certainly fail the API call. During a demo walkthrough of the Vault lifecycle, this would break the flow at the "Buy" step with a cryptic error.

**Suggested fix:** Either hardcode a demo wallet address for the hackathon, or check the value before calling and show a user-friendly error.

### SHOULD-FIX

**[SHOULD-FIX-1] analyze-intent.ts:5 — `DEMO_SCENARIOS` imported but `getScenarioById` already exists**

Line 5 imports both `getScenarioById` and `DEMO_SCENARIOS`. The `DEMO_SCENARIOS` import is used twice: once on line 106-108 for the catch fallback (fine), and once implicitly through the module. Not a bug, just noting that the `NORMAL_RESPONSES` dict on lines 8-14 is partially dead — `generateNormalResponse` on line 16-18 ignores the dict's content entirely and returns a generic string. The dict is used on line 42 (`NORMAL_RESPONSES[scenarioId]`), but only for scenario mode. The function and the dict do overlapping things.

**[SHOULD-FIX-2] wallet-button.tsx:52-55 — `useEffect` to check env var is unnecessary**

`process.env.NEXT_PUBLIC_*` values are inlined at build time by Next.js. The `useEffect` that checks the env var and sets state causes an unnecessary hydration mismatch: on the server, `hasCrossmint` is `false` (initial state), and on the first client render it's also `false`, then the effect fires and may set it to `true`. This causes a flash where the button shows "Wallet (configure API key)" then switches. Since the env var is a build-time constant, just compute it outside the component:

```tsx
const HAS_CROSSMINT = (() => {
  const key = process.env.NEXT_PUBLIC_CROSSMINT_API_KEY;
  return !!key && !key.includes("your_");
})();

export function WalletButton() {
  if (!HAS_CROSSMINT) {
    return <button disabled ...>Wallet (configure API key)</button>;
  }
  return <WalletButtonInner />;
}
```

**[SHOULD-FIX-3] x402.ts:7-10 — Singleton `cachedFetch` is not safe across concurrent requests during cold start**

If two requests hit the server simultaneously before `cachedFetch` is populated, both will enter the init path. `createKeyPairSignerFromBytes` and `wrapFetchWithPayment` will run twice. This is not a crash — just wasted work — but in a pathological case the second result overwrites the first while the first is mid-request. Use a promise-based singleton:

```tsx
let fetchPromise: Promise<typeof fetch> | null = null;

export function getPaymentFetch(): Promise<typeof fetch> {
  if (!fetchPromise) {
    fetchPromise = initPaymentFetch();
  }
  return fetchPromise;
}
```

**[SHOULD-FIX-4] vault-lifecycle.tsx:55-131 — Three async handlers with identical error patterns, no loading indicator for searching/buying/downloading states**

The `searching`, `buying`, and `downloading` states are set but nothing in the UI shows a spinner or disabled state for those intermediate steps. The buttons disappear (because the step condition no longer matches), so the user sees the step indicator advance and the button area go blank. Consider adding a small loading indicator for any in-progress step.

### NOTE

**[NOTE-1] product-card.tsx:25-29 — `<img>` tag instead of `next/image`**

Using raw `<img>` for external Amazon image URLs. For a hackathon demo this is fine — `next/image` would require `remotePatterns` config for `m.media-amazon.com`. No action needed.

**[NOTE-2] analyze-intent.ts:25 — SOL price hardcoded to $300**

`const solEquiv = (savings / 300).toFixed(2)` and `savings-tracker.tsx:19` defaults `solPrice` to 300. Fine for demo, just noting it.

**[NOTE-3] purch-api.ts:24 — `res.json()` return type is not validated**

All API calls trust the response shape matches the TypeScript interfaces. For a hackathon this is standard practice. In production you'd want runtime validation (Zod).

---

## What's Good

1. **Robust fallback chain in `analyze-intent.ts`.** The three-tier approach (cached scenario -> live API -> fallback to closest cached scenario) means the demo never shows a blank screen even if the Purch API is down. This is exactly the right design for a live demo.

2. **Clean type system.** `types/index.ts` is well-organized with clear sections, all component props are typed, and the `VaultLifecycleState` state machine is explicit. The codebase is easy to follow.

3. **Smart provider bypass in `providers.tsx`.** Skipping Crossmint providers when no API key is configured means the app works immediately for development without any setup. Good DX decision.

---

## Summary Counts

| Severity | Count |
|----------|-------|
| MUST-FIX | 3 |
| SHOULD-FIX | 4 |
| NOTE | 3 |
