# Phase 6 — Security Audit (Structural)

**Date:** 2026-04-19
**Scope:** Secrets, env handling, CORS, debug routes, env var coverage

---

## 1. Secrets Scan

### Result: PASS — No hardcoded secrets found

Scanned for:
- Private keys (`0x[a-fA-F0-9]{64}`) — **none found**
- Stripe keys (`sk-live`, `pk_live`) — **none found**
- AWS keys (`AKIA[0-9A-Z]{16}`) — **none found**
- GitHub PATs (`ghp_`) — **none found**
- Hardcoded passwords/tokens — **none found**
- Private key PEM blocks — **none found**

`.env.local` contains only placeholder values (`your_base64_encoded_...`, `ck_staging_your_key_here`), not real secrets.

---

## 2. `.env.local` in `.gitignore`

### Result: PASS

`.gitignore` line 34: `.env*` (glob covers all env files)
`.gitignore` line 44: `.env.local` (explicit entry as well)

Double coverage. No `.env` files are tracked — confirmed via glob search (only `.env.local` exists, and it matches the gitignore patterns).

---

## 3. No `.env` Files Tracked by Git

### Result: PASS (not a git repo)

This directory is not a git repository yet. No `.env` files can be tracked. When git is initialized, the `.gitignore` rules above will prevent accidental commits.

**[NOTE]** Ensure `git init` + first commit does not include `.env.local`. Verify with `git status` before first commit.

---

## 4. Exposed Debug/Admin Routes

### Result: PASS — No API routes exist

- Zero `route.ts` files found in the app directory
- No `pages/api/` directory
- No `middleware.ts`
- All data flows through server actions (`"use server"` in `app/actions/`)
- No admin routes, no debug endpoints, no health checks

This is a clean surface — server actions are the only server-side entry points.

---

## 5. CORS Issues

### Result: PASS — Not applicable

- No API route handlers means no CORS headers to configure
- Server actions use POST to the same origin (Next.js handles this internally)
- `next.config.ts` only configures `images.remotePatterns` for Amazon CDN — no `headers()` or CORS config
- No `Access-Control-Allow-Origin` headers set anywhere

---

## 6. Environment Variables: Code vs `.env.local`

### Referenced in code:

| Variable | File | Side | Present in `.env.local` |
|----------|------|------|------------------------|
| `X402_WALLET_SECRET` | `lib/x402.ts:12` | Server | Yes (placeholder) |
| `NEXT_PUBLIC_CROSSMINT_API_KEY` | `app/providers.tsx:8`, `components/wallet-button.tsx:53` | Client | Yes (placeholder) |
| `NEXT_PUBLIC_DEMO_WALLET_ADDRESS` | `components/vault-lifecycle.tsx:88` | Client | Yes (placeholder) |

### Result: PASS — All referenced env vars have entries in `.env.local`

No orphaned references. No server-only vars leaked with `NEXT_PUBLIC_` prefix.

---

## Security Findings

### [SECURITY-MEDIUM] SM-01: Server action `buyVaultAsset` passes client-side env var as wallet address
- **Location:** `components/vault-lifecycle.tsx:88`
- **Description:** `process.env.NEXT_PUBLIC_DEMO_WALLET_ADDRESS ?? ""` is read client-side and sent to the `buyVaultAsset` server action. An attacker could call the server action directly with any wallet address, since server actions are public POST endpoints.
- **Impact:** In a real payment flow, this would let anyone buy vault assets charged to an arbitrary wallet. For this demo (placeholder values), impact is negligible.
- **Remediation:** In production, derive the wallet address server-side from the authenticated session, not from client input.

### [SECURITY-MEDIUM] SM-02: No input validation on server actions
- **Location:** `app/actions/analyze-intent.ts:33`, `app/actions/vault.ts:7-28`
- **Description:** All three server actions (`analyzeIntent`, `searchVaultAssets`, `buyVaultAsset`, `downloadVaultAsset`) accept raw string parameters with no schema validation (no Zod, no type checking at runtime). Server actions are publicly callable POST endpoints.
- **Impact:** Malformed input could cause unexpected errors or be passed directly to the Purch API. The `message` param in `analyzeIntent` is used in string operations (regex split at line 58-63) which are safe, but the `slug`, `email`, `walletAddress`, `purchaseId`, and `downloadToken` params flow directly to API calls with no sanitization.
- **Remediation:** Add Zod schemas at the top of each server action to validate input shape, length, and format before processing.

### [SECURITY-MEDIUM] SM-03: `X402_WALLET_SECRET` cached in module scope
- **Location:** `lib/x402.ts:7-27`
- **Description:** The payment-wrapped fetch is cached in a module-level variable (`cachedFetch`). This is standard for performance, but means the decoded secret key material persists in memory for the lifetime of the server process. If the process is compromised (e.g., prototype pollution leading to arbitrary read), the key material is accessible.
- **Impact:** Low for a hackathon demo. In production with real funds, consider rotating keys and limiting in-memory persistence.
- **Remediation:** For production, use a hardware security module or key management service rather than in-memory caching.

### [NOTE] N-01: No rate limiting on server actions
- **Location:** `app/actions/analyze-intent.ts:33` (live API mode costs $0.11/call)
- **Description:** The `analyzeIntent` server action in live mode calls two paid Purch API endpoints per invocation. There is no rate limiting. An attacker could repeatedly call this action to drain the x402 wallet balance.
- **Remediation:** Add rate limiting (e.g., `next-rate-limit` or IP-based throttling) before production deployment.

### [NOTE] N-02: Error messages expose internal details
- **Location:** `lib/purch-api.ts:23,37,51,66,78`
- **Description:** Error messages include HTTP status codes (`Search failed: ${res.status}`). These propagate to the client through server actions. Not critical, but reveals backend behavior.
- **Remediation:** Return generic error messages to the client; log detailed errors server-side only.

---

## Summary

**Overall posture: GOOD for a hackathon demo.** No secrets are exposed, env files are properly gitignored, no API routes or debug endpoints exist, and the attack surface is limited to four server actions. The main structural risks are the lack of input validation on server actions and the absence of rate limiting on paid API calls. These are acceptable for a demo but should be addressed before any production use.
