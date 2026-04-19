# Phase 5 — Edge Case Audit (Frontend + API/Server Actions)

**Date:** 2026-04-19
**Scope:** Code review only — no browser tests

---

## Frontend Edge Cases

### 1. Wallet Not Connected — Graceful Handling?

**Result: PASS**

- **Location:** `components/wallet-button.tsx:49-68`
- `WalletButton` checks `NEXT_PUBLIC_CROSSMINT_API_KEY` in a `useEffect`. If missing or placeholder (`your_`), renders a disabled button with text "Wallet (configure API key)".
- `app/providers.tsx:11` — If no valid API key, Crossmint providers are skipped entirely, rendering children directly. App works without wallet.
- No component in the app gates functionality on wallet connection. The analyze flow and vault lifecycle work independently.

### 2. Slow API (>5s) — Loading State Shown?

**Result: PASS**

- **Location:** `app/page.tsx:23-33`
- `isLoading` state is set to `true` before `analyzeIntent` is called and cleared in `finally` block.
- `components/split-screen.tsx:23,29` — passes `isLoading` to both `ChatPanel` components.
- `components/chat-panel.tsx:28-39` — When `isLoading` is true, renders animated typing dots (three pulsing circles via framer-motion).
- `components/vault-lifecycle.tsx:56,83,108` — Each vault step sets state to a "loading" variant (`searching`, `buying`, `downloading`) and the step indicator reflects progress.

**[SHOULD-FIX] SF-01: No timeout on API calls**
- **Location:** `lib/purch-api.ts:22,32,50,61,75`
- All `fetch` calls have no `AbortController` timeout. If the Purch API hangs, the loading spinner shows indefinitely.
- **Remediation:** Add `AbortSignal.timeout(10000)` to each fetch call.

### 3. API Failure — Error State Shown?

**Result: PARTIAL PASS**

- **Location:** `app/page.tsx:27-33` — `runAnalysis` has a try block but **no catch**. Only a `finally` that clears `isLoading`. If `analyzeIntent` throws, `analysis` stays at its previous value (or null).
- **However:** `analyzeIntent` itself never throws — it catches all errors internally (line 103-118) and returns a fallback scenario. So in practice, the user always gets a result.
- Vault lifecycle: `vault-lifecycle.tsx:72-78,97-103,124-130` — All three steps have proper try/catch with error state rendered in an amber alert box (line 142-146).

**[SHOULD-FIX] SF-02: `runAnalysis` missing catch block**
- **Location:** `app/page.tsx:22-34`
- If `analyzeIntent` ever does throw (e.g., network failure before the server action executes), the error is unhandled. The loading spinner clears but no error message appears.
- **Remediation:** Add a catch block that sets an error state and displays it to the user.

### 4. Empty Data — Empty State Shown?

**Result: PASS**

- **Location:** `app/page.tsx:101-107` — Split screen only renders when `userMessage` or `isLoading` is truthy. Before first interaction, nothing is shown.
- `app/page.tsx:110` — Savings tracker only renders when `totalSaved > 0`.
- `app/page.tsx:113-116` — Degen comment only renders when `analysis?.degenComment` is truthy.
- `components/split-screen.tsx:34` — Product cards only render when `savingsAmount > 0`.
- `components/vault-lifecycle.tsx:62-68` — If vault search returns no persona, shows a descriptive message ("not found in Vault yet").

### 5. Double-Click Submit — Fires Twice?

**Result: PARTIAL PASS**

**Scenario picker (demo buttons):**
- **Location:** `app/page.tsx:36-38` — `handleScenarioSelect` calls `runAnalysis` with no guard against double-click. If a user clicks a scenario button twice rapidly, two concurrent `analyzeIntent` calls fire.

**Custom input form:**
- **Location:** `app/page.tsx:91-93` — Submit button has `disabled={isLoading || !customInput.trim()}`. Once `isLoading` is true, the button disables. This prevents double-submit on the form.

**Vault lifecycle:**
- **Location:** `components/vault-lifecycle.tsx:149-155` — Buttons only render for specific steps (`idle`, `found`, `purchased`). Once a step transitions, the previous button unmounts. This prevents double-click.

**[SHOULD-FIX] SF-03: Scenario picker buttons not disabled during loading**
- **Location:** `app/page.tsx:76-80` (ScenarioPicker component)
- Scenario buttons have no `disabled` prop tied to `isLoading`. Rapid clicking fires duplicate API calls (costing $0.11 each in live mode).
- **Remediation:** Pass `isLoading` to `ScenarioPicker` and disable buttons when true.

### 6. `process.env` Client-Side Access — Correct `NEXT_PUBLIC_` Prefix?

**Result: PASS**

| Variable | Prefix | Accessed in | Correct? |
|----------|--------|-------------|----------|
| `X402_WALLET_SECRET` | None | `lib/x402.ts` (server only, `"use server"` chain) | Yes — server-only, no prefix needed |
| `NEXT_PUBLIC_CROSSMINT_API_KEY` | `NEXT_PUBLIC_` | `app/providers.tsx`, `components/wallet-button.tsx` (both `"use client"`) | Yes |
| `NEXT_PUBLIC_DEMO_WALLET_ADDRESS` | `NEXT_PUBLIC_` | `components/vault-lifecycle.tsx` (`"use client"`) | Yes |

No server-only secrets are exposed to the client bundle.

---

## API / Server Action Edge Cases

### 7. What happens if `X402_WALLET_SECRET` is missing/malformed?

**Result: PASS (with caveat)**

- **Location:** `lib/x402.ts:13-15`
- If missing: throws `Error("X402_WALLET_SECRET env var is required")`. This propagates up through `getPaymentFetch()` -> `searchProducts()`/`shopWithAI()` -> `analyzeIntent()` catch block -> returns fallback demo scenario.
- If malformed (not valid base64 or wrong byte length): `Buffer.from(secretKeyBase64, "base64")` silently produces garbage bytes. `createKeyPairSignerFromBytes` will likely throw when the bytes don't form a valid keypair.
- Both cases are caught by `analyzeIntent`'s try/catch (line 103) and fall back to demo data. The vault actions would throw to the client.

**[SHOULD-FIX] SF-04: Vault actions don't handle `X402_WALLET_SECRET` errors gracefully**
- **Location:** `app/actions/vault.ts:7-29`
- Unlike `analyzeIntent`, vault server actions have no try/catch. If the env var is missing, the raw error message ("X402_WALLET_SECRET env var is required") propagates to the client.
- **Remediation:** Wrap each vault action in try/catch and return structured error responses.

### 8. What happens if Purch API returns non-JSON?

**Result: MUST-FIX**

**[MUST-FIX] MF-01: No JSON parse error handling in `purch-api.ts`**
- **Location:** `lib/purch-api.ts:24,38,52,67`
- All API functions call `res.json()` directly without try/catch. If the Purch API returns HTML (e.g., 502 gateway error page, rate limit page), `res.json()` throws `SyntaxError: Unexpected token < in JSON`.
- The `!res.ok` check (lines 23,37,51,66,78) catches HTTP error codes, but some proxies/CDNs return 200 with HTML error pages.
- **Impact:** Unhandled JSON parse error propagates as a cryptic error. For `analyzeIntent`, the outer catch handles it (falls back to demo). For vault actions, the raw `SyntaxError` reaches the client.
- **Remediation:**
```typescript
const text = await res.text();
try {
  return JSON.parse(text);
} catch {
  throw new Error(`API returned non-JSON response: ${text.slice(0, 100)}`);
}
```

### 9. What happens if `shopWithAI` returns empty products array?

**Result: PASS**

- **Location:** `app/actions/analyze-intent.ts:67-78`
- Line 67: `shopResult.products[0] ?? { ... }` — If `products` is empty, a fallback product object is constructed from the user's message with `price: 0`.
- Line 82: The alternative comparison `alternative.price >= original.price` will be `false` only if alternative is cheaper. With `original.price: 0`, no alternative will be cheaper, so the "fair deal" response is returned.
- This handles the empty case correctly and produces a sensible UX response.

### 10. Input Validation on `analyzeIntent` — Injection Risk?

**Result: PASS (low risk)**

- **Location:** `app/actions/analyze-intent.ts:33-119`
- The `message` parameter is used in:
  1. String matching against demo scenario IDs (line 107): `message.toLowerCase().includes(s.id)` — safe
  2. Regex replacement to extract keywords (line 58-63): `message.replace(/[^a-zA-Z\s]/g, "")` — this **strips all non-alpha characters**, effectively sanitizing the input before it's used as a search query
  3. Passed to `shopWithAI` as JSON body (line 54): serialized via `JSON.stringify`, so no injection into the HTTP request
- The `scenarioId` parameter is used as a lookup key against a hardcoded array (line 39): `getScenarioById(scenarioId)` — safe, returns undefined for unknown IDs
- No SQL, no shell execution, no HTML rendering of raw input. The regex sanitization on line 59 is a strong defense.

**[NOTE] N-01: No length limit on `message` parameter**
- **Location:** `app/actions/analyze-intent.ts:33`
- A very long message (e.g., 1MB string) would be sent to the Purch API. The API would likely reject it, but it wastes bandwidth and x402 payment attempts.
- **Remediation:** Add `message.slice(0, 500)` or Zod `z.string().max(500)`.

---

## Summary Table

| ID | Severity | Description | Location |
|----|----------|-------------|----------|
| MF-01 | MUST-FIX | No JSON parse error handling — non-JSON API responses crash | `lib/purch-api.ts:24,38,52,67` |
| SF-01 | SHOULD-FIX | No fetch timeout — hanging API = infinite spinner | `lib/purch-api.ts:22,32,50,61,75` |
| SF-02 | SHOULD-FIX | `runAnalysis` missing catch block — unhandled error possible | `app/page.tsx:22-34` |
| SF-03 | SHOULD-FIX | Scenario buttons not disabled during loading — double-click fires duplicates | `app/page.tsx:76-80` |
| SF-04 | SHOULD-FIX | Vault actions propagate raw error to client when env var missing | `app/actions/vault.ts:7-29` |
| N-01 | NOTE | No length limit on `message` input to `analyzeIntent` | `app/actions/analyze-intent.ts:33` |
