# Project Pulse — FOMO Guard
> Rolling context. Every skill reads on entry, appends on exit.
> Last updated: 2026-04-19T11:45:00Z by hackathon-debug

## Active Facts
<!-- Override table. Later skills correct earlier facts here. Max 20 rows. -->
| Fact ID | Skill | What Changed | Old → New |
|---------|-------|-------------|-----------|
| AF-1 | [SKILL] debug | res.json() unsafe on error responses | assumed safe → added safeJson() wrapper |

## Decisions Log
<!-- Architectural + priority decisions. Never pruned. Max 15 entries. -->
| # | Skill | Decision | Why | Affects |
|---|-------|----------|-----|---------|
| 1 | debug | Add seenScenarios deduplication to savings tracker | Repeated clicks inflated savings during demo | wire, demo |
| 2 | debug | Guard vault buy with wallet address validation | Empty string crashes Purch API | wire |

## Skill Sections
<!-- Each skill appends one section on exit. Newest at bottom. -->

---
### build — 2026-04-19T10:30:00Z [RETROACTIVE — generated from state files]
**Status:** COMPLETE
**Session(s):** 1

#### Done
- Full Next.js 15 app scaffolded with x402 + Crossmint + Framer Motion
- 5 demo scenarios with FOMO analysis, split-screen comparison, savings tracker
- Vault lifecycle wizard (search → buy → download)

#### Deviations
- [SKILL] DEV-001: `useAuth` → `useCrossmintAuth` — SDK naming differs
- [SKILL] DEV-002: Crossmint provider skipped with placeholder key — base58 validation crash
- [SKILL] DEV-003: pnpm → npm — pnpm hung indefinitely

#### Verified Facts
- [VF-B1] Crossmint SDK validates API key as base58 on init — Source: runtime crash
- [VF-B2] All env vars are placeholders — no real keys configured

#### Assumptions
- [A-B1] FOMO Guard persona exists in Purch Vault marketplace — WILL-BREAK
- [A-B2] x402 payment flow works with funded wallet — WILL-BREAK

#### Blockers for Downstream
- All env vars placeholder — wire must configure real credentials

#### For Next Skill
- Test with real Crossmint API key to validate wallet flow
- Test x402 payment with funded Solana wallet
- Verify "fomo guard" persona exists via vault search API

---
### hackathon-debug — 2026-04-19T11:45:00Z
**Status:** COMPLETE
**Session(s):** 1

#### Done
- 8-phase quality gate: baseline confirmed, 4 known risks triaged, security audit clean
- 4 MUST-FIX bugs found and fixed (safeJson, savings dedup, error UI, vault guard)
- Confidence score: 82 — ready for wire

#### Additions (not in PRD/Architecture)
- [SKILL] [NEW] `safeJson()` helper in purch-api.ts — prevents crash on HTML error pages
- [SKILL] [NEW] Error banner UI in page.tsx — shows user-friendly errors on API failure
- [SKILL] [NEW] `seenScenarios` Set in page.tsx — prevents savings inflation on repeated clicks

#### Deviations
- [SKILL] Phases 3/4 skipped — no contract layers, no test framework installed

#### Verified Facts
- [VF-D1] `npm run build` produces clean static output — Source: actual build run
- [VF-D2] Dev server returns 200 after all fixes — Source: curl health check
- [VF-D3] No secrets in codebase, .env.local in .gitignore — Source: grep scan

#### Assumptions
- [A-D1] Purch API returns JSON on error (not HTML) in production — NICE-TO-HAVE (safeJson handles either)

#### Blockers for Downstream
- None — all MUST-FIX resolved

#### Key Decisions
- [D-1] Skip test framework installation: deadline pressure, static analysis sufficient for demo quality
- [D-2] safeJson wrapper: defensive parse handles any response format from Purch API

#### For Next Skill
- Wire: focus on getting real X402_WALLET_SECRET, NEXT_PUBLIC_CROSSMINT_API_KEY, NEXT_PUBLIC_DEMO_WALLET_ADDRESS
- Wire: test vault search for "fomo guard" persona — if not found, A-B1 breaks and persona must be published first
- Wire: test x402 payment flow end-to-end (requires USDC balance on Solana)
