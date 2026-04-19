# FOMO Guard Implementation Plan

**Project:** FOMO Guard Persona
**Hackathon:** Purch Vault Hackathon
**Deadline:** April 20, 2026 (1 day remaining)
**Stack:** TypeScript, Next.js 15, React 19, Tailwind CSS v4, Framer Motion, @x402/fetch, @x402/svm, @solana/kit, @crossmint/client-sdk-react-ui
**Architecture Doc:** ARCHITECTURE.md (THE source of truth for all code)

---

## How to Use This Plan

1. Read in order. Do not skip phases. Do not reorder tasks.
2. Every phase has a GATE checklist. Verify every item before proceeding.
3. When you see 🔀 (decision point), test BOTH paths and follow the one that matches.
4. Copy code from ARCHITECTURE.md — do not improvise.
5. Commit after every task using the specified commit messages.
6. Save deployed addresses / credentials to .env immediately.
7. If something fails and isn't covered by a decision tree: STOP. Report the error. Do not guess.
8. **VERIFY-MILESTONE tasks are mandatory** — they appear at phase boundaries and cannot be skipped. Failure stops the plan.
9. **seed-demo.ts** must be implemented before any demo-related phase. Run it before every E2E test.

---

## Phase Overview

| Phase | Purpose | Est. Time | Depends On |
|:---:|---------|-----------|-----------|
| 0 | Project scaffolding + config files | 20 min | — |
| 1 | x402 payment layer + Purch API client | 30 min | Phase 0 |
| 2 | FOMO Guard engine + demo scenarios | 40 min | Phase 1 |
| 3 | UI components (product card, chat panel, split screen, savings tracker, scenario picker) | 60 min | Phase 2 |
| 4 | Vault lifecycle + vault asset ZIP | 40 min | Phase 3 |
| 5 | Crossmint auth integration + wallet button | 20 min | Phase 3 |
| 6 | Main page assembly + layout + seed-demo + deploy | 40 min | Phases 4, 5 |

**Total estimated:** ~4.2 hours (fits within 1 build day)

---

## Phase 0: Project Scaffolding

**Purpose:** Create the Next.js project, install all dependencies, set up config files.
**Estimated time:** 20 min

### Task 0.1: Create Next.js Project

**Files:**
- Create: entire project directory (from ARCHITECTURE.md Section 1 file structure)

**Steps:**

1. Create Next.js project with TypeScript, Tailwind CSS, App Router, no src directory:
   ```bash
   cd /Users/MAC/hackathon-toolkit/active/purch/fomo-guard
   npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm
   ```
   Expected:
   ```
   Success! Created fomo-guard at /Users/MAC/hackathon-toolkit/active/purch/fomo-guard
   ```

2. If directory already has files, say yes to overwrite or create in a clean subdirectory. The forge docs (PRD.md, ARCHITECTURE.md, PLAN.md) should be preserved.

#### 🔀 Decision Point: create-next-app in non-empty directory

Run: `ls /Users/MAC/hackathon-toolkit/active/purch/fomo-guard/`

✅ **If only forge docs exist (PRD.md, ARCHITECTURE.md, PLAN.md, .forge-state.json, concerns.md):** Run create-next-app with `--yes` flag. It will scaffold around existing files.

🔀 **If create-next-app refuses to run in non-empty directory:**
1. Create a temp directory: `mkdir /tmp/fomo-guard-scaffold && cd /tmp/fomo-guard-scaffold`
2. Run create-next-app there: `npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm`
3. Copy scaffold files (excluding any .md files) to the project directory: `cp -r /tmp/fomo-guard-scaffold/{app,public,*.json,*.ts,*.mjs,.eslintrc*,.gitignore} /Users/MAC/hackathon-toolkit/active/purch/fomo-guard/`
4. Clean up: `rm -rf /tmp/fomo-guard-scaffold`

⛔ **If create-next-app fails entirely:**
1. Manually create package.json from ARCHITECTURE.md Section 21
2. Run `pnpm install`
3. Create remaining config files manually

**Commit:**
```bash
git add -A
git commit -m "init: scaffold Next.js 15 project with TypeScript and Tailwind CSS v4"
```

---

### Task 0.2: Install Dependencies

**Files:**
- Modify: `package.json` (from ARCHITECTURE.md Section 21)

**Steps:**

1. Install x402 and Solana packages:
   ```bash
   pnpm add @x402/fetch @x402/svm @solana/kit
   ```
   Expected: packages added to package.json dependencies

2. Install Crossmint SDK:
   ```bash
   pnpm add @crossmint/client-sdk-react-ui
   ```

3. Install Framer Motion and bs58:
   ```bash
   pnpm add framer-motion bs58
   ```

4. Verify all deps installed:
   ```bash
   pnpm ls --depth 0
   ```
   Expected: all 6 packages listed (@x402/fetch, @x402/svm, @solana/kit, @crossmint/client-sdk-react-ui, framer-motion, bs58)

#### 🔀 Decision Point: @x402/svm installation

Run: `pnpm add @x402/svm`
Expected: clean install

🔀 **If you get peer dependency conflicts:**
1. Try: `pnpm add @x402/svm --legacy-peer-deps`
2. If that fails: `pnpm add @x402/svm@latest --force`
3. Verify import works: create temp file with `import { SOLANA_MAINNET_CAIP2 } from "@x402/svm"` and check TypeScript resolves it

🔀 **If `@x402/svm/exact/client` subpath doesn't resolve:**
1. Check if the export is `@x402/svm/exact` instead (no `/client` suffix)
2. Check npm: `npm view @x402/svm exports`
3. Adjust the import path in lib/x402.ts accordingly

⛔ **If @x402 packages are not on npm:**
1. Install from GitHub: `pnpm add x402-foundation/x402#main`
2. Adjust import paths based on the monorepo structure

**Commit:**
```bash
git add package.json pnpm-lock.yaml
git commit -m "deps: install x402, Solana, Crossmint, Framer Motion, bs58"
```

---

### Task 0.3: Configure Project Files

**Files:**
- Modify: `next.config.ts` (from ARCHITECTURE.md Section 21)
- Modify: `postcss.config.mjs` (from ARCHITECTURE.md Section 21)
- Modify: `tsconfig.json` (from ARCHITECTURE.md Section 21)
- Create: `.env.local` (from ARCHITECTURE.md Section 21)
- Modify: `app/globals.css` (from ARCHITECTURE.md Section 21)

**Steps:**

1. Copy `next.config.ts` from ARCHITECTURE.md Section 21 exactly:
   ```typescript
   // next.config.ts
   import type { NextConfig } from "next";
   const nextConfig: NextConfig = {
     images: { remotePatterns: [{ protocol: "https", hostname: "m.media-amazon.com" }, { protocol: "https", hostname: "**.purch.xyz" }] },
     experimental: { serverActions: { bodySizeLimit: "2mb" } },
   };
   export default nextConfig;
   ```

2. Copy `postcss.config.mjs` from ARCHITECTURE.md Section 21 exactly:
   ```javascript
   // postcss.config.mjs
   const config = { plugins: { "@tailwindcss/postcss": {} } };
   export default config;
   ```

3. Verify `tsconfig.json` has the `@/*` path alias pointing to `./*`. If not, add it.

4. Create `.env.local` with placeholder values:
   ```
   X402_WALLET_SECRET=your_base64_encoded_solana_keypair_here
   NEXT_PUBLIC_CROSSMINT_API_KEY=your_crossmint_api_key_here
   NEXT_PUBLIC_DEMO_WALLET_ADDRESS=your_demo_wallet_address_here
   NEXT_PUBLIC_SOL_PRICE=150
   ```

5. Replace `app/globals.css` with ARCHITECTURE.md Section 21 content:
   ```css
   @import "tailwindcss";
   @theme {
     --color-fomo-green: #00ff88;
     --color-fomo-red: #ff4444;
     --color-fomo-dark: #0a0a0a;
     --color-fomo-card: #1a1a2e;
     --color-fomo-border: #2a2a4a;
   }
   body { @apply bg-fomo-dark text-white antialiased; }
   ```

6. Create project directories:
   ```bash
   mkdir -p components lib types app/actions vault-asset/examples scripts public
   ```

7. Verify the build compiles:
   ```bash
   pnpm build
   ```

#### 🔀 Decision Point: Tailwind CSS v4 @import syntax

Run: `pnpm build`

✅ **If build succeeds:** Continue to Task 0.4.

🔀 **If you get `Cannot find module '@tailwindcss/postcss'`:**
1. Install the postcss plugin: `pnpm add -D @tailwindcss/postcss`
2. Re-run build

🔀 **If you get errors about `@import "tailwindcss"` syntax:**
1. Check Tailwind version: `pnpm ls tailwindcss`
2. If v3: use `@tailwind base; @tailwind components; @tailwind utilities;` instead
3. Replace `@theme` block with a `tailwind.config.ts` file extending colors

⛔ **If Tailwind v4 is incompatible with Next.js 15:**
1. Downgrade: `pnpm add tailwindcss@3`
2. Create `tailwind.config.ts` with the custom colors from ARCHITECTURE.md Section 21
3. Use standard v3 globals.css directives

**Commit:**
```bash
git add next.config.ts postcss.config.mjs tsconfig.json app/globals.css .env.local
git commit -m "config: set up Next.js, Tailwind v4, env vars, project directories"
```

---

### Task 0.4: Create Shared Types

**Files:**
- Create: `types/index.ts` (from ARCHITECTURE.md Section 3)

**Steps:**

1. Copy `types/index.ts` from ARCHITECTURE.md Section 3 exactly. This file defines: Product, SearchResponse, ShopResponse, BuyResponse, VaultAsset, VaultSearchResponse, VaultBuyResponse, FomoAnalysis, DemoScenario, VaultStep, VaultLifecycleState, ProductCardProps, SavingsTrackerProps, ChatPanelProps, ScenarioPickerProps.

2. Verify TypeScript compiles:
   ```bash
   npx tsc --noEmit types/index.ts
   ```
   Expected: no errors

**Commit:**
```bash
git add types/index.ts
git commit -m "feat(types): add all shared TypeScript interfaces from Architecture §3"
```

---

### Task 0.5: Create Shield SVG

**Files:**
- Create: `public/fomo-shield.svg` (from ARCHITECTURE.md Section 27)

**Steps:**

1. Create a simple shield SVG icon for FOMO Guard branding. Use a shield shape with the FOMO Guard green (#00ff88):
   ```svg
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
     <path d="M32 4L8 16v16c0 14.4 10.24 27.84 24 32 13.76-4.16 24-17.6 24-32V16L32 4z" fill="#00ff88" opacity="0.2" stroke="#00ff88" stroke-width="2"/>
     <path d="M28 34l-6-6 2.83-2.83L28 28.34l11.17-11.17L42 20 28 34z" fill="#00ff88"/>
   </svg>
   ```

**Commit:**
```bash
git add public/fomo-shield.svg
git commit -m "asset: add FOMO Guard shield SVG icon"
```

---

### Phase 0 Gate

Before proceeding to Phase 1, verify:
- [ ] `pnpm build` completes without errors
- [ ] `types/index.ts` compiles with no TypeScript errors
- [ ] `.env.local` exists with all 4 env vars (even if placeholder values)
- [ ] `node_modules/@x402/fetch` exists: `ls node_modules/@x402/fetch/package.json`
- [ ] `node_modules/@crossmint/client-sdk-react-ui` exists
- [ ] `node_modules/framer-motion` exists
- [ ] All directories created: `ls app/actions components lib types vault-asset/examples scripts public`
- [ ] All commits made for Phase 0

**If any check fails: DO NOT proceed. Fix the failing check first.**

---

## Phase 1: x402 Payment Layer + Purch API Client

**Purpose:** Build the server-side payment infrastructure and typed API client.
**Estimated time:** 30 min

### Task 1.1: Create x402 Payment Layer

**Files:**
- Create: `lib/x402.ts` (from ARCHITECTURE.md Section 4)

**Steps:**

1. Copy `lib/x402.ts` from ARCHITECTURE.md Section 4 exactly. This creates the `getPaymentFetch()` function that:
   - Reads `X402_WALLET_SECRET` from env (base64-encoded 64-byte Solana keypair)
   - Creates a `KeyPairSigner` via `createKeyPairSignerFromBytes`
   - Registers the Solana mainnet scheme with `x402Client`
   - Returns a wrapped fetch that auto-handles 402 responses
   - Caches the result for reuse

2. Verify TypeScript compiles:
   ```bash
   npx tsc --noEmit lib/x402.ts
   ```

#### 🔀 Decision Point: x402 Import Paths

Run: `npx tsc --noEmit lib/x402.ts`

✅ **If no errors:** Continue to Task 1.2.

🔀 **If `Cannot find module '@x402/svm/exact/client'`:**
1. Check available exports: `node -e "console.log(Object.keys(require('@x402/svm')))"`
2. Try alternative import: `import { ExactSvmScheme } from "@x402/svm/exact"`
3. Try: `import { ExactSvmScheme } from "@x402/svm"`
4. Check npm page for correct import path

🔀 **If `Cannot find module '@x402/fetch'`:**
1. Verify installation: `ls node_modules/@x402/fetch`
2. Check if it's a monorepo package: `npm view @x402/fetch`
3. Try `@x402/client` as alternative package name

🔀 **If `createKeyPairSignerFromBytes` doesn't exist in `@solana/kit`:**
1. Check: `node -e "const s = require('@solana/kit'); console.log(Object.keys(s).filter(k => k.includes('KeyPair')))"`
2. Try `@solana/web3.js` as alternative: `import { Keypair } from "@solana/web3.js"`
3. Adjust the signer creation accordingly

⛔ **If x402 packages have fundamentally different API:**
1. Read the actual source: `cat node_modules/@x402/fetch/dist/index.d.ts`
2. Adapt lib/x402.ts to match the real API while keeping the same export signature (`getPaymentFetch()`)
3. Document the deviation in comments

**Commit:**
```bash
git add lib/x402.ts
git commit -m "feat(x402): implement payment layer with cached Solana signer from Architecture §4"
```

---

### Task 1.2: Create Purch API Client

**Files:**
- Create: `lib/purch-api.ts` (from ARCHITECTURE.md Section 5)

**Steps:**

1. Copy `lib/purch-api.ts` from ARCHITECTURE.md Section 5 exactly. This creates typed wrapper functions:
   - `searchProducts(query, options?)` → calls `GET /x402/search`
   - `shopProducts(message, context?)` → calls `POST /x402/shop`
   - `buyProduct(asin, email, address)` → calls `POST /x402/buy`
   - `searchVault(params?)` → calls `GET /x402/vault/search`
   - `buyVaultAsset(slug, walletAddress, email)` → calls `POST /x402/vault/buy`
   - `downloadVaultAsset(purchaseId, downloadToken)` → calls `GET /x402/vault/download/:id`

2. Verify TypeScript compiles:
   ```bash
   npx tsc --noEmit lib/purch-api.ts
   ```
   Expected: no errors

**Commit:**
```bash
git add lib/purch-api.ts
git commit -m "feat(api): implement typed Purch API client with all 6 endpoints from Architecture §5"
```

---

### Phase 1 Gate

Before proceeding to Phase 2, verify:
- [ ] `npx tsc --noEmit lib/x402.ts` — no errors
- [ ] `npx tsc --noEmit lib/purch-api.ts` — no errors
- [ ] `lib/x402.ts` exports `getPaymentFetch()`
- [ ] `lib/purch-api.ts` exports 6 functions (searchProducts, shopProducts, buyProduct, searchVault, buyVaultAsset, downloadVaultAsset)
- [ ] All commits made for Phase 1

**If any check fails: DO NOT proceed. Fix the failing check first.**

---

## Phase 2: FOMO Guard Engine + Demo Scenarios

**Purpose:** Build the core analysis engine and pre-cached demo data.
**Estimated time:** 40 min

### Task 2.1: Create Demo Scenarios

**Files:**
- Create: `lib/demo-scenarios.ts` (from ARCHITECTURE.md Section 6)

**Steps:**

1. Copy `lib/demo-scenarios.ts` from ARCHITECTURE.md Section 6 exactly. This exports:
   - `DEMO_SCENARIOS: DemoScenario[]` — 5 pre-cached product comparison pairs:
     1. Headphones: Sony WH-1000XM5 ($348) → Soundcore Q45 ($88), saves $260
     2. Gaming Keyboard: Razer Huntsman V3 ($200) → Redragon K552 ($35), saves $165
     3. Running Shoes: Nike Vaporfly 3 ($260) → ASICS Gel-Nimbus ($130), saves $130
     4. Monitor: LG UltraGear 27" ($500) → AOC CQ27G2S ($230), saves $270
     5. Webcam: Elgato Facecam Pro ($300) → Anker PowerConf C200 ($40), saves $260
   - Each scenario has: id, label, userMessage, originalProduct, alternativeProduct, fomoResponse, degenComment

2. Verify TypeScript compiles:
   ```bash
   npx tsc --noEmit lib/demo-scenarios.ts
   ```

**Commit:**
```bash
git add lib/demo-scenarios.ts
git commit -m "feat(demo): add 5 pre-cached product comparison scenarios from Architecture §6"
```

---

### Task 2.2: Create FOMO Guard Engine

**Files:**
- Create: `app/actions/analyze-intent.ts` (from ARCHITECTURE.md Section 7)

**Steps:**

1. Copy `app/actions/analyze-intent.ts` from ARCHITECTURE.md Section 7 exactly. This implements:
   - `"use server"` directive at top
   - `analyzeIntent(message: string): Promise<FomoAnalysis>` — the core function
   - **Dual-mode operation:**
     - First checks if message matches a cached `DemoScenario` (instant, reliable)
     - If no cache match: calls live Purch API (`shopProducts` + `searchProducts`)
     - On API failure: falls back to best-matching cached scenario
   - Generates both `normalResponse` (generic "Sure! Here's how to buy...") and `fomoResponse` (degen-language pushback with alternatives)
   - Calculates `savingsAmount` from price delta

2. Verify TypeScript compiles:
   ```bash
   npx tsc --noEmit app/actions/analyze-intent.ts
   ```

#### 🔀 Decision Point: Server Action Compilation

Run: `npx tsc --noEmit app/actions/analyze-intent.ts`

✅ **If no errors:** Continue to Task 2.3.

🔀 **If `"use server" is not allowed`:**
1. This is a Next.js-specific directive. TypeScript alone won't recognize it.
2. Try building the full project instead: `pnpm build`
3. If build succeeds, the server action is valid

🔀 **If import resolution fails for `@/lib/purch-api`:**
1. Check tsconfig.json paths: ensure `"@/*": ["./*"]` is in `compilerOptions.paths`
2. If using `baseUrl`: ensure it's set to `"."`

**Commit:**
```bash
git add app/actions/analyze-intent.ts
git commit -m "feat(engine): implement dual-mode FOMO Guard engine with cache + live API from Architecture §7"
```

---

### Task 2.3: Create Vault Server Actions

**Files:**
- Create: `app/actions/vault.ts` (from ARCHITECTURE.md Section 8)

**Steps:**

1. Copy `app/actions/vault.ts` from ARCHITECTURE.md Section 8 exactly. This implements:
   - `"use server"` directive at top
   - `vaultSearch(query?)` → wraps `searchVault()` from purch-api
   - `vaultBuy(slug)` → wraps `buyVaultAsset()` with demo wallet address and email from env
   - `vaultDownload(purchaseId, downloadToken)` → wraps `downloadVaultAsset()`, returns base64 ZIP data

2. Verify compilation:
   ```bash
   pnpm build
   ```

**Commit:**
```bash
git add app/actions/vault.ts
git commit -m "feat(vault): implement vault search/buy/download server actions from Architecture §8"
```

---

### Phase 2 Gate

Before proceeding to Phase 3, verify:
- [ ] `pnpm build` completes without errors
- [ ] `lib/demo-scenarios.ts` exports `DEMO_SCENARIOS` with 5 entries
- [ ] `app/actions/analyze-intent.ts` exports `analyzeIntent` function
- [ ] `app/actions/vault.ts` exports `vaultSearch`, `vaultBuy`, `vaultDownload`
- [ ] All commits made for Phase 2

**If any check fails: DO NOT proceed. Fix the failing check first.**

---

## Phase 3: UI Components

**Purpose:** Build all React components for the showcase app.
**Estimated time:** 60 min

### Task 3.1: Create Chat Panel

**Files:**
- Create: `components/chat-panel.tsx` (from ARCHITECTURE.md Section 13)

**Steps:**

1. Copy `components/chat-panel.tsx` from ARCHITECTURE.md Section 13 exactly. This implements:
   - `"use client"` directive
   - Props: `ChatPanelProps` (variant, userMessage, response, isLoading)
   - Renders: variant header (Normal AI / FOMO Guard with shield icon), user message bubble, response bubble with typing animation when loading
   - Styling: dark cards with fomo-card/fomo-border colors, green accent for FOMO variant

2. Verify no TypeScript errors (will check at phase gate with full build).

**Commit:**
```bash
git add components/chat-panel.tsx
git commit -m "feat(ui): implement ChatPanel component from Architecture §13"
```

---

### Task 3.2: Create Product Card

**Files:**
- Create: `components/product-card.tsx` (from ARCHITECTURE.md Section 11)

**Steps:**

1. Copy `components/product-card.tsx` from ARCHITECTURE.md Section 11 exactly. This implements:
   - `"use client"` directive
   - Props: `ProductCardProps` (product, variant, savingsDelta?)
   - Renders: product image (Next.js Image), title, price, star rating, review count, Prime badge, savings delta badge
   - Styling: green border for "alternative" variant, red border for "original" variant

**Commit:**
```bash
git add components/product-card.tsx
git commit -m "feat(ui): implement ProductCard component from Architecture §11"
```

---

### Task 3.3: Create Savings Tracker

**Files:**
- Create: `components/savings-tracker.tsx` (from ARCHITECTURE.md Section 12)

**Steps:**

1. Copy `components/savings-tracker.tsx` from ARCHITECTURE.md Section 12 exactly. This implements:
   - `"use client"` directive
   - Props: `SavingsTrackerProps` (totalSaved, solPrice?)
   - Uses `useSpring` from Framer Motion for animated number counter
   - Displays: USD saved amount (animated), SOL equivalent, "saved with FOMO Guard" label
   - Styling: large green number, subtle SOL conversion below

**Commit:**
```bash
git add components/savings-tracker.tsx
git commit -m "feat(ui): implement SavingsTracker with Framer Motion spring animation from Architecture §12"
```

---

### Task 3.4: Create Split Screen

**Files:**
- Create: `components/split-screen.tsx` (from ARCHITECTURE.md Section 14)

**Steps:**

1. Copy `components/split-screen.tsx` from ARCHITECTURE.md Section 14 exactly. This implements:
   - `"use client"` directive
   - CSS Grid: 2 columns at 1280px+, single column on mobile
   - Renders two ChatPanel instances side-by-side: "normal" on left, "fomo" on right
   - Below the panels: two ProductCards (original vs alternative) when analysis is available
   - Below the cards: SavingsTracker

**Commit:**
```bash
git add components/split-screen.tsx
git commit -m "feat(ui): implement SplitScreen with responsive grid layout from Architecture §14"
```

---

### Task 3.5: Create Scenario Picker

**Files:**
- Create: `components/scenario-picker.tsx` (from ARCHITECTURE.md Section 15)

**Steps:**

1. Copy `components/scenario-picker.tsx` from ARCHITECTURE.md Section 15 exactly. This implements:
   - `"use client"` directive
   - Props: `ScenarioPickerProps` (scenarios, onSelect, activeId)
   - Renders: horizontal row of scenario buttons with labels and price preview
   - Active scenario highlighted with green border
   - Styling: pill buttons with hover states

**Commit:**
```bash
git add components/scenario-picker.tsx
git commit -m "feat(ui): implement ScenarioPicker horizontal selector from Architecture §15"
```

---

### Task 3.6: Implement Seed Demo Script

**Purpose:** Creates the exact demo state needed for recording. Run before every E2E test and every demo take.

**Files:**
- Create: `scripts/seed-demo.ts` (from ARCHITECTURE.md Section 20)

**Steps:**

1. Copy `scripts/seed-demo.ts` from ARCHITECTURE.md Section 20. This script:
   - Calls live Purch API to fetch real product data for all 5 scenarios
   - Writes updated product data to `lib/demo-scenarios.ts` (or validates existing cached data)
   - Verifies each scenario's product pair exists and has valid images
   - Reports: "All N scenarios seeded successfully"

2. Run:
   ```bash
   npx ts-node scripts/seed-demo.ts
   ```
   If ts-node is not installed:
   ```bash
   npx tsx scripts/seed-demo.ts
   ```

3. Verify each item in the seed state table exists with expected values.

**Gate:** `npx tsx scripts/seed-demo.ts` runs to completion with no errors. Idempotent — safe to run multiple times.

**Commit:**
```bash
git add scripts/seed-demo.ts
git commit -m "seed(demo): implement seed-demo.ts from PRD §6 Demo Prerequisites"
```

---

### Phase 3 Gate

Before proceeding to Phase 4, verify:
- [ ] `pnpm build` completes without errors
- [ ] All 5 component files exist in `components/`: chat-panel.tsx, product-card.tsx, savings-tracker.tsx, split-screen.tsx, scenario-picker.tsx
- [ ] `scripts/seed-demo.ts` exists and runs without errors
- [ ] All commits made for Phase 3

**If any check fails: DO NOT proceed. Fix the failing check first.**

---

### Task 3.7: VERIFY-MILESTONE Checkpoint — Core Infrastructure

**Purpose:** Mid-build quality gate. Build cannot advance past this point until criteria pass.

**Steps:**
1. Run `hackathon-verify` in milestone mode against current project state
2. Read the generated VERIFY-REPORT.md
3. Check WINNER-READINESS score

**Gate (MANDATORY — cannot be skipped):**
- [ ] WINNER-READINESS >= 50
- [ ] Kill Zone 1 (demo flow) is not triggered
- [ ] Kill Zone 3 (integration) shows <= 1 blocked integration

**If gate fails:** STOP. Do not proceed to the next phase. Log failure to BUILD-REPORT.md. Return BLOCKED to conductor.

---

## Phase 4: Vault Lifecycle + Vault Asset ZIP

**Purpose:** Build the Vault lifecycle demo component and create the downloadable persona ZIP.
**Estimated time:** 40 min

### Task 4.1: Create Vault Lifecycle Demo

**Files:**
- Create: `components/vault-lifecycle.tsx` (from ARCHITECTURE.md Section 16)

**Steps:**

1. Copy `components/vault-lifecycle.tsx` from ARCHITECTURE.md Section 16 exactly. This implements:
   - `"use client"` directive
   - 5-step wizard: Search → Found → Buy → Download → Complete
   - `StepIndicator` sub-component showing progress dots
   - Each step calls the corresponding server action from `app/actions/vault.ts`
   - Step transitions with loading states and error handling
   - "Install" instructions shown at the final step
   - Uses `VaultLifecycleState` type for state management

2. Verify compilation:
   ```bash
   pnpm build
   ```

**Commit:**
```bash
git add components/vault-lifecycle.tsx
git commit -m "feat(vault): implement VaultLifecycle 5-step wizard from Architecture §16"
```

---

### Task 4.2: Create Vault Asset ZIP Contents

**Files:**
- Create: `vault-asset/manifest.json` (from ARCHITECTURE.md Section 19)
- Create: `vault-asset/system-prompt.md` (from ARCHITECTURE.md Section 19)
- Create: `vault-asset/config.json` (from ARCHITECTURE.md Section 19)
- Create: `vault-asset/examples/headphones.md` (from ARCHITECTURE.md Section 19)
- Create: `vault-asset/examples/keyboard.md` (from ARCHITECTURE.md Section 19)
- Create: `vault-asset/examples/shoes.md` (from ARCHITECTURE.md Section 19)

**Steps:**

1. Copy all 6 files from ARCHITECTURE.md Section 19 exactly.

2. `manifest.json` contains:
   - name: "FOMO Guard"
   - version: "1.0.0"
   - type: "persona"
   - description, author, category, tags
   - entryPoint: "system-prompt.md"
   - requiredApis: ["/x402/search", "/x402/shop"]

3. `system-prompt.md` contains the full FOMO Guard persona system prompt with:
   - Role definition (defensive shopping persona)
   - Behavior rules (always find alternatives, use degen language, calculate savings)
   - Response format template
   - CT vocabulary reference

4. `config.json` contains persona configuration:
   - personality traits, response style, price sensitivity threshold

5. Three example files showing real conversation examples with the persona.

6. Verify all files are valid:
   ```bash
   cat vault-asset/manifest.json | python3 -m json.tool
   cat vault-asset/config.json | python3 -m json.tool
   ls vault-asset/examples/
   ```
   Expected: valid JSON output, 3 example files listed

**Commit:**
```bash
git add vault-asset/
git commit -m "feat(vault-asset): create FOMO Guard persona ZIP contents from Architecture §19"
```

---

### Phase 4 Gate

Before proceeding to Phase 5, verify:
- [ ] `pnpm build` completes without errors
- [ ] `components/vault-lifecycle.tsx` exists and exports VaultLifecycle component
- [ ] `vault-asset/manifest.json` is valid JSON with type "persona"
- [ ] `vault-asset/system-prompt.md` exists and is non-empty
- [ ] `vault-asset/examples/` contains 3 .md files
- [ ] All commits made for Phase 4

**If any check fails: DO NOT proceed. Fix the failing check first.**

---

## Phase 5: Crossmint Auth Integration

**Purpose:** Add wallet connection UX via Crossmint SDK.
**Estimated time:** 20 min

### Task 5.1: Create Crossmint Auth Provider

**Files:**
- Create: `app/providers.tsx` (from ARCHITECTURE.md Section 9)

**Steps:**

1. Copy `app/providers.tsx` from ARCHITECTURE.md Section 9 exactly. This implements:
   - `"use client"` directive
   - `CrossmintProvider` wrapping `CrossmintAuthProvider`
   - Uses `NEXT_PUBLIC_CROSSMINT_API_KEY` env var
   - Exports `Providers` component that wraps children

#### 🔀 Decision Point: Crossmint SDK API

Run: `pnpm build` after creating providers.tsx

✅ **If build succeeds:** Continue to Task 5.2.

🔀 **If `CrossmintAuthProvider` is not exported from `@crossmint/client-sdk-react-ui`:**
1. Check available exports: `node -e "console.log(Object.keys(require('@crossmint/client-sdk-react-ui')))"`
2. Check if it's `CrossmintProvider` only (no separate auth provider)
3. Adapt: use whatever provider components are available, maintaining the same wrapper pattern

🔀 **If Crossmint SDK requires different configuration:**
1. Read the SDK types: `cat node_modules/@crossmint/client-sdk-react-ui/dist/index.d.ts | head -100`
2. Adapt configuration to match the actual API
3. Keep the same `Providers` export interface

⛔ **If Crossmint SDK is completely incompatible:**
1. Create a minimal `Providers` component that just wraps children (no-op)
2. Add a comment: `// TODO: Crossmint integration — SDK API differs from assumed interface`
3. The app will still work for demo — Crossmint is auth UX only, not required for x402 payments
4. This is acceptable: Risk #3 and #10 mitigation says Crossmint is optional for core demo

**Commit:**
```bash
git add app/providers.tsx
git commit -m "feat(auth): implement Crossmint auth provider from Architecture §9"
```

---

### Task 5.2: Create Wallet Button

**Files:**
- Create: `components/wallet-button.tsx` (from ARCHITECTURE.md Section 10)

**Steps:**

1. Copy `components/wallet-button.tsx` from ARCHITECTURE.md Section 10 exactly. This implements:
   - `"use client"` directive
   - Uses `useAuth` hook from Crossmint SDK [ASSUMED — may need adjustment]
   - Renders: connect button when disconnected, wallet address + disconnect when connected
   - Truncates wallet address for display

#### 🔀 Decision Point: Crossmint useAuth() Hook

Run: `pnpm build` after creating wallet-button.tsx

✅ **If build succeeds:** Continue to Phase 5 gate.

🔀 **If `useAuth` doesn't exist in Crossmint SDK:**
1. Search for auth hooks: `grep -r "export.*use" node_modules/@crossmint/client-sdk-react-ui/dist/ | head -20`
2. Try alternatives: `useWallet`, `useCrossmint`, `useCrossmintAuth`
3. Adapt the component to use whatever hook is available

🔀 **If the hook returns different properties than assumed:**
1. Check the hook's return type from the .d.ts file
2. Adapt property access (e.g., `user.wallet?.address` might be `wallet.address` or `account.address`)
3. Keep the same visual output

⛔ **If no auth hooks are available:**
1. Create a mock wallet button that shows a "Connect Wallet" button with a static demo address when clicked
2. This preserves the demo UX without requiring live Crossmint integration
3. Acceptable per Risk #3 mitigation

**Commit:**
```bash
git add components/wallet-button.tsx
git commit -m "feat(auth): implement WalletButton with Crossmint useAuth from Architecture §10"
```

---

### Phase 5 Gate

Before proceeding to Phase 6, verify:
- [ ] `pnpm build` completes without errors
- [ ] `app/providers.tsx` exports `Providers` component
- [ ] `components/wallet-button.tsx` exports default WalletButton component
- [ ] All commits made for Phase 5

**If any check fails: DO NOT proceed. Fix the failing check first.**

---

## Phase 6: Main Page Assembly + Layout + Deploy

**Purpose:** Wire everything together, create the final page, deploy to Vercel.
**Estimated time:** 40 min

### Task 6.1: Create Layout

**Files:**
- Modify: `app/layout.tsx` (from ARCHITECTURE.md Section 18)

**Steps:**

1. Replace `app/layout.tsx` with ARCHITECTURE.md Section 18 content. This implements:
   - Root layout with `Providers` wrapper
   - Metadata: title "FOMO Guard", description
   - Font: Inter from next/font/google
   - Body wrapped in `<Providers>` component

2. Verify compilation:
   ```bash
   pnpm build
   ```

**Commit:**
```bash
git add app/layout.tsx
git commit -m "feat(layout): implement root layout with Crossmint providers from Architecture §18"
```

---

### Task 6.2: Create Main Page

**Files:**
- Modify: `app/page.tsx` (from ARCHITECTURE.md Section 17)

**Steps:**

1. Replace `app/page.tsx` with ARCHITECTURE.md Section 17 content. This implements:
   - `"use client"` directive
   - State management: activeScenario, analysis, totalSaved, isLoading
   - `handleScenarioSelect`: calls analyzeIntent, updates analysis and totalSaved
   - Page layout sections (top to bottom):
     1. Header with FOMO Guard logo/title + WalletButton
     2. ScenarioPicker with all 5 demo scenarios
     3. SplitScreen showing current analysis
     4. VaultLifecycle section ("Get FOMO Guard from the Vault")
   - Imports all components and actions

2. Verify the full app builds:
   ```bash
   pnpm build
   ```
   Expected: build succeeds with no errors

3. Test locally:
   ```bash
   pnpm dev
   ```
   Open http://localhost:3000 — verify the page renders without errors

#### 🔀 Decision Point: Build Errors from Component Integration

Run: `pnpm build`

✅ **If build succeeds:** Continue to Task 6.3.

🔀 **If you get prop type mismatches:**
1. Check the error message for which component has the wrong props
2. Cross-reference the component's props interface in `types/index.ts` with what `page.tsx` passes
3. Fix the mismatch — either in the page or in the component (page.tsx is the source of truth for wiring, component accepts what it needs)

🔀 **If you get import resolution errors:**
1. Verify all component files exist: `ls components/`
2. Verify all action files exist: `ls app/actions/`
3. Check for typos in import paths

**Commit:**
```bash
git add app/page.tsx
git commit -m "feat(page): assemble main page with all components from Architecture §17"
```

---

### Task 6.3: Test Full Application

**Steps:**

1. Start dev server:
   ```bash
   cd /Users/MAC/hackathon-toolkit/active/purch/fomo-guard && pnpm dev
   ```

2. Open http://localhost:3000 in browser

3. Verify visually:
   - [ ] Page renders with dark theme
   - [ ] FOMO Guard header with shield icon visible
   - [ ] 5 scenario buttons are visible and clickable
   - [ ] Clicking a scenario shows split-screen with chat panels
   - [ ] Product cards render with images (may need real images to display)
   - [ ] Savings tracker shows animated number
   - [ ] Vault lifecycle section is visible at bottom

4. Check console for errors:
   ```bash
   # In browser DevTools console — should be clean (no red errors)
   ```

5. If using placeholder env vars, the x402 API calls will fail — this is expected. The cached scenarios should still work.

---

### Task 6.4: Deploy to Vercel

**Steps:**

1. Initialize git repo if not already:
   ```bash
   cd /Users/MAC/hackathon-toolkit/active/purch/fomo-guard
   git init
   ```

2. Create `.gitignore` additions (ensure node_modules, .next, .env.local are ignored — should already be from create-next-app).

3. Deploy to Vercel:
   ```bash
   npx vercel --yes
   ```
   Expected: deployment URL printed

4. Set environment variables on Vercel:
   ```bash
   npx vercel env add X402_WALLET_SECRET production
   npx vercel env add NEXT_PUBLIC_CROSSMINT_API_KEY production
   npx vercel env add NEXT_PUBLIC_DEMO_WALLET_ADDRESS production
   npx vercel env add NEXT_PUBLIC_SOL_PRICE production
   ```

5. Redeploy with env vars:
   ```bash
   npx vercel --prod
   ```

6. Verify deployed URL loads and renders correctly.

#### 🔀 Decision Point: Vercel Deployment

Run: `npx vercel --yes`

✅ **If deployment succeeds:** Save URL, continue to Phase 6 gate.

🔀 **If build fails on Vercel but works locally:**
1. Check Vercel build logs: `npx vercel logs`
2. Common issue: missing env vars (build-time vs runtime)
3. Add `NEXT_PUBLIC_*` vars as build-time env vars in Vercel dashboard

⛔ **If Vercel CLI is not available:**
1. Deploy via GitHub: push to GitHub, connect repo to Vercel dashboard
2. Or use `npx vercel` to install it on the fly

**Commit:**
```bash
git add -A
git commit -m "deploy: initial Vercel deployment"
```

---

### Phase 6 Gate

Before marking build complete, verify:
- [ ] `pnpm build` completes without errors
- [ ] All 30 files from Architecture file tree exist
- [ ] http://localhost:3000 renders the complete app
- [ ] Cached demo scenarios work (click scenario → split screen appears)
- [ ] Savings tracker animates on scenario selection
- [ ] Vault lifecycle section renders
- [ ] All commits made for Phase 6

**If any check fails: Fix the failing check first.**

---

### Task 6.5: VERIFY-MILESTONE Checkpoint — Pre-Deploy

**Purpose:** Final quality gate before moving to demo/submission phases.

**Steps:**
1. Run `hackathon-verify` in milestone mode against current project state
2. Read the generated VERIFY-REPORT.md
3. Check WINNER-READINESS score

**Gate (MANDATORY — cannot be skipped):**
- [ ] WINNER-READINESS >= 70
- [ ] Kill Zone 1 (demo flow) is not triggered
- [ ] Kill Zone 3 (integration) shows 0 blocked integrations
- [ ] All 8 components render without errors

**If gate fails:** STOP. Do not proceed to demo/submission. Log failure to BUILD-REPORT.md. Fix all issues.

---

## Appendix: Quick Reference

### All Addresses
| Item | Address | Network |
|------|---------|---------|
| USDC Mint | EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v | Solana Mainnet |
| Purch API | https://api.purch.xyz | — |
| Purch API Docs | https://api.purch.xyz/docs | — |
| Crossmint Console | https://www.crossmint.com/console | — |

### All Commands
| Phase | Task | Command | Purpose |
|:---:|:---:|---------|---------|
| 0 | 0.1 | `npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm` | Scaffold project |
| 0 | 0.2 | `pnpm add @x402/fetch @x402/svm @solana/kit @crossmint/client-sdk-react-ui framer-motion bs58` | Install all deps |
| 0 | 0.3 | `pnpm build` | Verify config |
| 0 | 0.4 | `npx tsc --noEmit types/index.ts` | Verify types |
| 1 | 1.1 | `npx tsc --noEmit lib/x402.ts` | Verify x402 layer |
| 1 | 1.2 | `npx tsc --noEmit lib/purch-api.ts` | Verify API client |
| 2 | 2.2 | `pnpm build` | Verify engine |
| 3 | 3.6 | `npx tsx scripts/seed-demo.ts` | Seed demo data |
| 6 | 6.3 | `pnpm dev` | Local test |
| 6 | 6.4 | `npx vercel --prod` | Deploy |

### Troubleshooting
| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `Cannot find module '@x402/svm/exact/client'` | Subpath export changed | Try `@x402/svm/exact` or `@x402/svm` |
| `Cannot find module '@x402/fetch'` | Package not installed or renamed | `pnpm add @x402/fetch` or check npm for current name |
| `createKeyPairSignerFromBytes is not a function` | @solana/kit API changed | Use `@solana/web3.js` Keypair.fromSecretKey instead |
| `CrossmintAuthProvider is not exported` | SDK API differs from assumed | Check actual exports, use available provider |
| `useAuth is not a function` | Hook name differs from assumed | Check SDK for correct hook name (useWallet, useCrossmint) |
| `@import "tailwindcss" not recognized` | Tailwind v3 instead of v4 | Use `@tailwind base/components/utilities` syntax |
| `POOL_INACTIVE` or 402 without payment | No USDC in wallet | Fund wallet with USDC on Solana mainnet |
| `X402_WALLET_SECRET env var is required` | Missing .env.local | Create .env.local with base64-encoded keypair |
| Build fails on Vercel | Missing env vars | Add all env vars in Vercel dashboard |
| Images not loading | Remote patterns not configured | Check next.config.ts remotePatterns |
