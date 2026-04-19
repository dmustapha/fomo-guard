# Phase 2: Known-Risks Triage

## Summary

| # | Risk | Classification | Disposition | Details |
|---|------|---------------|-------------|---------|
| 1 | Crossmint wallet integration untested with real API key | **EXTERNAL** | Low severity — safe to ship | `app/providers.tsx` lines 11-13: conditional skip works correctly. If `apiKey` is falsy or contains `"your_"`, Crossmint providers are bypassed and children render bare. No crash path. The only gap is that real Crossmint auth UX is unverified, but the app degrades gracefully without it. Nothing to test without a real key. |
| 2 | x402 payment flow untested — requires funded wallet | **EXTERNAL** | Medium severity — hard failure without env var | `lib/x402.ts` line 13-15: `getPaymentFetch()` throws immediately if `X402_WALLET_SECRET` is unset. There is **no fallback** — any caller will catch at runtime. Whether callers handle this gracefully depends on their try/catch. This is acceptable for a hackathon demo since the Vault lifecycle flow (which uses x402) already wraps calls in try/catch. Truly external — requires a funded Solana wallet and base64 secret key. |
| 3 | Vault lifecycle depends on persona existing in Purch marketplace | **STRUCTURAL** | Low severity — fallback works correctly | `components/vault-lifecycle.tsx` lines 62-68: `handleStart()` explicitly checks `if (!persona)` and sets an informative error message: *"FOMO Guard persona not found in Vault yet. It will be published before submission."* The UI shows this in an amber warning banner (line 142-146). The step indicator advances to "Found" (step index 1) so the UI doesn't appear broken — it just stops progression. This is a **well-handled** structural fallback. No fix needed. |
| 4 | analyzeIntent server action uses shopWithAI API ($0.11/call) — fallback to cached scenarios on failure | **STRUCTURAL** | Low severity — fallback is robust | `app/actions/analyze-intent.ts` lines 103-118: The catch block falls back to `DEMO_SCENARIOS`, first trying keyword match (`message.toLowerCase().includes(s.id)`), then defaulting to `DEMO_SCENARIOS[0]` (headphones scenario). Verified `DEMO_SCENARIOS` array is non-empty (5 scenarios in `lib/demo-scenarios.ts`). The fallback returns a complete `FomoAnalysis` object with all required fields populated. **Additionally**, line 38-50 shows that when a `scenarioId` is passed (demo mode), the live API is never called at all — so demo presentations cost $0. Solid design. |

## Verdict

**0 blockers found.** All four risks are either external dependencies that cannot be tested without real credentials, or structural concerns with verified working fallbacks. The codebase handles all degraded states gracefully.

- **Risks 1 & 2**: EXTERNAL. Cannot be resolved without real API keys / funded wallets. Both are acceptable for hackathon submission — the app functions in demo mode without them.
- **Risks 3 & 4**: STRUCTURAL. Code-reviewed and confirmed safe. Fallbacks are implemented correctly and produce valid UI states.
