# FOMO Guard — Product Requirements Document

**Hackathon:** Purch Vault Hackathon
**Track:** Best Persona + Grand Prize (Best Purch Integration)
**Deadline:** April 20, 2026 (1 day remaining)
**Version:** V1

## [EMERGENCY MODE — 0 components mocked]

Despite emergency timeline, V3 correction mandates depth over simplicity ("Claude Code = 10x"). All components are real implementations, no mocks.

---

## 1. Project Overview

### One-Liner
A Purch Vault persona that turns your AI agent into a rational counterweight to impulsive buying — finding smarter deals on Purch instead of letting you ape.

### Problem Statement
Impulse buying costs Americans an estimated **$5,400 per year** (Slickdeals). Crypto-native users face compounding impulse costs — FOMO-driven purchases, ape-ins, and impulsive shopping. "Don't let me ape" is a crypto meme because the problem is real and universal. Every existing Vault persona (Degen Trader, Content Machine, Security Sentinel) encourages action. Zero personas serve the "rational counterweight" function. FOMO Guard is the first **defensive** persona — it doesn't stop you from buying, it finds you a **better deal on Purch**.

### Solution
FOMO Guard is a downloadable Vault persona (ZIP asset) paired with a showcase web app that demonstrates the persona in action. When a user says "buy these $300 headphones," FOMO Guard intercepts the request, queries Purch's `/x402/search` and `/x402/shop` endpoints to find alternatives, and responds with crypto-native analysis: "Bro, you bought AirPods 2 months ago. Here's a $150 alternative with better reviews on Purch. That $150 saved is 0.05 SOL to stack." The showcase app features a split-screen before/after comparison (normal AI vs FOMO Guard), visual product comparison cards, and an animated savings tracker. The full Vault lifecycle is demonstrable: search the persona in the marketplace → buy it → download the ZIP → install it → use it.

### Why This Wins
| Judging Criterion | Weight | How We Excel |
|---|:---:|---|
| Demo | 33% | Before/after split-screen is understood on mute. Degen language is the hook. Visual product cards + savings animation = zero cognitive load |
| Usefulness | 33% | Millions of self-aware degens want rational pushback. Persona doesn't block buying — it finds SMARTER buys on Purch. Aligns with Purch's mission |
| Quality | 33% | 5+ API endpoints with organic integration. Persona NEEDS /x402/search and /x402/shop to function. Full intercept → analyze → recommend architecture. Clean ZIP asset structure |

---

## 2. System Architecture Overview

### System Diagram
```
┌─────────────────────────────────────────────────────────────────────┐
│                        FOMO GUARD SHOWCASE APP                      │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │   Crossmint   │    │   Split-Screen   │    │    Savings       │  │
│  │   Wallet Auth  │───▶│   Chat Demo      │───▶│    Tracker       │  │
│  │   (Connect)    │    │   (Before/After)  │    │    (Animation)   │  │
│  └──────────────┘    └────────┬─────────┘    └──────────────────┘  │
│                               │                                     │
│                    ┌──────────▼──────────┐                         │
│                    │   FOMO Guard Engine  │                         │
│                    │   (Server Action)    │                         │
│                    └──────────┬──────────┘                         │
│                               │                                     │
│              ┌────────────────┼────────────────┐                   │
│              ▼                ▼                ▼                    │
│     ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐       │
│     │  Product Card │ │  Product Card │ │  Comparison View  │       │
│     │  (Original)   │ │  (Alternative)│ │  (Side-by-Side)   │       │
│     └──────────────┘ └──────────────┘ └──────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   x402 Payment Layer │
                    │   (@x402/fetch)      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────────┐
              ▼                ▼                    ▼
     ┌──────────────┐ ┌──────────────┐    ┌──────────────┐
     │ GET /x402/    │ │ POST /x402/  │    │ Vault API     │
     │ search        │ │ shop         │    │ search/buy/   │
     │ ($0.01)       │ │ ($0.10)      │    │ download      │
     └──────────────┘ └──────────────┘    └──────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     FOMO GUARD VAULT ASSET (ZIP)                    │
│  manifest.json │ system-prompt.md │ examples/ │ config.json        │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Table
| Component | Type | Purpose | Key Dependencies |
|-----------|------|---------|-----------------|
| Showcase App | Next.js Frontend | Split-screen demo, product cards, savings tracker | React, Tailwind CSS |
| Crossmint Auth | Client Provider | Wallet connection via email/Google | @crossmint/client-sdk-react-ui |
| FOMO Guard Engine | Server Action | Intercept purchase intent → query Purch → generate pushback | @x402/fetch, @x402/svm, @solana/kit |
| Product Cards | React Components | Visual comparison of original vs alternative products | Purch search response data |
| Savings Tracker | React Component | Animated counter showing cumulative savings | Client state |
| Vault Asset ZIP | Static Asset | Downloadable persona file for Vault marketplace | manifest.json, system-prompt.md |
| Vault Lifecycle Demo | Page/Flow | Search → buy → download → install FOMO Guard | Vault API endpoints |
| x402 Payment Layer | Service Module | Wraps fetch with automatic USDC micropayment | @x402/fetch, @x402/svm |

### Data Flow
1. User connects Crossmint wallet (email sign-in, no seed phrase)
2. User types a purchase intent in the chat: "I want to buy $300 headphones"
3. FOMO Guard Engine (server action) receives the message
4. Engine calls `POST /x402/shop` with the purchase context to get AI analysis
5. Engine calls `GET /x402/search` with product keywords to find alternatives
6. Engine composes a degen-language pushback response with product data
7. Frontend renders the split-screen: normal AI response (left) vs FOMO Guard response (right)
8. Product comparison cards show original item vs cheaper alternative with ratings, prices, images
9. Savings tracker animates the running total of money saved
10. For Vault lifecycle: Engine calls `GET /x402/vault/search` → `POST /x402/vault/buy` → `GET /x402/vault/download/:id` to demonstrate full purchase flow

---

## 3. User Flows

### Flow 1: Connect Wallet
1. User opens FOMO Guard showcase app
2. User clicks "Connect Wallet"
3. Crossmint modal appears with email/Google login options
4. User signs in with email
5. Crossmint creates a Solana smart wallet (gasless, no seed phrase)
6. App shows connected wallet address and USDC balance
7. If no USDC balance: app shows deposit instructions

### Flow 2: FOMO Guard Demo (Core — Before/After Split-Screen)
1. User types a purchase intent: "I want to buy Sony WH-1000XM5 headphones for $348"
2. **Left panel (Normal AI):** Shows a generic "Sure! Here's how to buy them..." response
3. **Right panel (FOMO Guard):** Shows loading spinner while Engine queries Purch
4. Engine calls `POST /x402/shop` with message and context
5. Engine calls `GET /x402/search?q=wireless+noise+cancelling+headphones&priceMax=250`
6. FOMO Guard responds: "Bro hold up — you already have AirPods. The Soundcore Q45 is $88 with 4.5 stars on Purch. That's $260 saved = 0.87 SOL to stack. Diamond hands your wallet, anon."
7. Product comparison cards render side-by-side: original ($348) vs alternative ($88)
8. Savings tracker animates: +$260 saved
9. User can click "Buy Smart Alternative" to trigger `POST /x402/buy` on the alternative
10. User can click "Buy Anyway" to proceed with original purchase

### Flow 3: Vault Lifecycle Demo
1. User navigates to "Get FOMO Guard" section
2. App calls `GET /x402/vault/search?q=fomo+guard&productType=persona`
3. FOMO Guard persona appears in search results with cover image, price, description
4. User clicks "Buy Persona" → triggers `POST /x402/vault/buy` with wallet address and email
5. Purchase confirmation shows: purchaseId, download available
6. User clicks "Download" → triggers `GET /x402/vault/download/:purchaseId?downloadToken=...`
7. ZIP file downloads to user's device
8. App shows "Install" instructions: extract ZIP, load system-prompt.md into your AI agent

### Flow 4: Pre-Loaded Demo Scenarios
1. User selects from 5 pre-tested product scenarios (dropdown or cards)
2. Scenarios: headphones ($348→$88), gaming keyboard ($200→$65), running shoes ($180→$75), monitor ($500→$280), webcam ($130→$45)
3. Each scenario has cached Purch API responses for reliable demo
4. Split-screen renders immediately with real product data
5. Savings tracker accumulates across scenarios

### Sequence Diagram (Core FOMO Guard Flow)
```
User -> Frontend: "Buy $300 headphones"
Frontend -> Engine: analyzeIntent(message)
Engine -> Purch /x402/shop: POST { message, context: { priceRange } }
Purch -> Engine: { reply, products: [...] }
Engine -> Purch /x402/search: GET ?q=headphones&priceMax=200
Purch -> Engine: { products: [...alternatives] }
Engine -> Frontend: { normalResponse, fomoResponse, original, alternative, savings }
Frontend -> User: Split-screen + product cards + savings animation
```

---

## 4. Technical Specifications

### Showcase App (Next.js Frontend)
- **Purpose:** Interactive demo app showing FOMO Guard in action
- **Interface:** Single-page app with split-screen chat, product cards, savings tracker, and Vault lifecycle section
- **Key Data Structures:**
  ```typescript
  interface Product {
    asin: string;
    title: string;
    price: number;
    currency: string;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    isPrime: boolean;
    productUrl: string;
    source: string;
  }

  interface FomoAnalysis {
    normalResponse: string;
    fomoResponse: string;
    originalProduct: Product;
    alternatives: Product[];
    savingsAmount: number;
    degenComment: string;
  }

  interface VaultAsset {
    id: string;
    slug: string;
    title: string;
    productType: "persona";
    cardDescription: string;
    price: number;
    category: string;
    creator: { name: string; type: string };
    downloads: number;
    coverImageUrl: string;
  }
  ```
- **Dependencies:** React 19, Next.js 15, Tailwind CSS v4, Framer Motion (savings animation)
- **Constraints:** Must render split-screen at 1280px+ width, stack vertically on mobile

### FOMO Guard Engine (Server Action)
- **Purpose:** Process purchase intents, query Purch APIs, generate FOMO Guard responses
- **Interface:** `analyzeIntent(message: string, walletKey: Uint8Array): Promise<FomoAnalysis>`
- **Key Data Structures:** Uses `Product` and `FomoAnalysis` from shared types
- **Dependencies:** @x402/fetch, @x402/svm, @solana/kit
- **Events:** None (request/response only)
- **Constraints:** Each analysis costs ~$0.11 USDC ($0.01 search + $0.10 shop). Budget: ~$5 for demo testing

### Crossmint Auth Provider
- **Purpose:** Email-based wallet creation and connection
- **Interface:** `CrossmintProvider > CrossmintAuthProvider > CrossmintWalletProvider` nesting
- **Key Data Structures:** `useWallet()` returns `{ wallet: { address, chain, balances, send }, status }`
- **Dependencies:** @crossmint/client-sdk-react-ui
- **Constraints:** Requires `NEXT_PUBLIC_CROSSMINT_API_KEY` env var

### Product Cards
- **Purpose:** Visual product comparison with images, prices, ratings, savings
- **Interface:** `<ProductCard product={Product} variant="original" | "alternative" />`
- **Dependencies:** Product data from Purch API responses
- **Constraints:** Must show product image, title, price, rating, review count, and savings delta

### Savings Tracker
- **Purpose:** Animated running total of money saved by following FOMO Guard advice
- **Interface:** `<SavingsTracker totalSaved={number} />`
- **Dependencies:** Framer Motion for number animation
- **Constraints:** Must animate smoothly, show USD and SOL equivalent

### Vault Asset ZIP
- **Purpose:** Downloadable persona file compatible with Purch Vault marketplace
- **Interface:** ZIP containing manifest.json, system-prompt.md, examples/, config.json
- **Key Data Structures:**
  ```typescript
  // manifest.json schema
  interface PersonaManifest {
    name: string;
    version: string;
    type: "persona";
    description: string;
    author: string;
    category: string;
    tags: string[];
    entryPoint: string; // "system-prompt.md"
    requiredApis: string[];
  }
  ```
- **Dependencies:** None (static asset)
- **Constraints:** Must be valid ZIP, clean internal structure, matches Vault format conventions

### x402 Payment Layer
- **Purpose:** Wrap fetch calls to automatically handle USDC micropayments
- **Interface:** `wrapFetchWithPayment(fetch, x402Client): typeof fetch`
- **Dependencies:** @x402/fetch, @x402/svm, @solana/kit
- **Constraints:** Requires funded Solana wallet with USDC balance

### Vault Lifecycle Demo
- **Purpose:** Show full purchase flow: search → buy → download → install
- **Interface:** Step-by-step wizard component
- **Dependencies:** Vault API endpoints, x402 payment layer
- **Constraints:** Requires USDC balance for purchase ($0.01 search + asset price + $0.01 download)

---

## 5. API Contracts

### External API: Purch Product API
- **Base URL:** `https://api.purch.xyz`
- **Authentication:** x402 micropayments (USDC on Solana). No API keys — wallet = auth.
- **Rate Limits:** Not documented. Assumed no rate limits for hackathon.

#### Endpoint: GET /x402/search
- **Cost:** $0.01 USDC
- **Request:**
  ```
  GET /x402/search?q=wireless+headphones&priceMax=200&brand=Sony&page=1
  ```
- **Response (success):**
  ```json
  {
    "products": [
      {
        "asin": "B0C8PSRWFM",
        "title": "Soundcore Q45 Wireless Headphones",
        "price": 88.00,
        "currency": "USD",
        "rating": 4.5,
        "reviewCount": 12450,
        "imageUrl": "https://...",
        "isPrime": true,
        "productUrl": "https://amazon.com/dp/B0C8PSRWFM",
        "source": "amazon"
      }
    ],
    "totalResults": 45,
    "page": 1,
    "hasMore": true
  }
  ```
- **Response (error):**
  ```json
  { "error": "Invalid query parameter", "code": 400 }
  ```

#### Endpoint: POST /x402/shop
- **Cost:** $0.10 USDC
- **Request:**
  ```json
  {
    "message": "I want to buy Sony WH-1000XM5 headphones",
    "context": {
      "priceRange": { "min": 0, "max": 250 },
      "preferences": ["wireless", "noise-cancelling"]
    }
  }
  ```
- **Response (success):**
  ```json
  {
    "reply": "Here are some great wireless noise-cancelling headphone options...",
    "products": [
      {
        "asin": "B0C8PSRWFM",
        "title": "Soundcore Q45",
        "price": 88.00,
        "currency": "USD",
        "rating": 4.5,
        "reviewCount": 12450,
        "imageUrl": "https://...",
        "isPrime": true,
        "productUrl": "https://...",
        "source": "amazon"
      }
    ]
  }
  ```

#### Endpoint: POST /x402/buy
- **Cost:** Product price in USDC
- **Request:**
  ```json
  {
    "asin": "B0C8PSRWFM",
    "email": "user@example.com",
    "shippingAddress": {
      "name": "Demo User",
      "line1": "123 Demo St",
      "city": "San Francisco",
      "state": "CA",
      "postalCode": "94102",
      "country": "US"
    }
  }
  ```
- **Response (success):**
  ```json
  {
    "orderId": "ord_abc123",
    "status": "processing",
    "product": { "title": "Soundcore Q45", "price": 88.00 },
    "totalPrice": { "amount": 88.00, "currency": "usdc" }
  }
  ```

### External API: Purch Vault API
- **Base URL:** `https://api.purch.xyz`
- **Authentication:** x402 micropayments (same as Product API)

#### Endpoint: GET /x402/vault/search
- **Cost:** $0.01 USDC
- **Request:**
  ```
  GET /x402/vault/search?q=fomo+guard&productType=persona&limit=10
  ```
- **Response (success):**
  ```json
  {
    "items": [
      {
        "id": "uuid",
        "slug": "fomo-guard",
        "title": "FOMO Guard",
        "productType": "persona",
        "cardDescription": "Your rational brain for impulsive buying decisions",
        "price": 0.10,
        "category": "productivity",
        "creator": { "name": "FOMO Labs", "type": "individual" },
        "downloads": 0,
        "coverImageUrl": "https://..."
      }
    ],
    "nextCursor": null
  }
  ```

#### Endpoint: POST /x402/vault/buy
- **Cost:** Asset price in USDC
- **Request:**
  ```json
  {
    "slug": "fomo-guard",
    "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "email": "user@example.com"
  }
  ```
- **Response (success):**
  ```json
  {
    "purchaseId": "pur_xyz789",
    "downloadToken": "tok_abc123",
    "item": {
      "slug": "fomo-guard",
      "title": "FOMO Guard",
      "productType": "persona",
      "price": 0.10,
      "coverImageUrl": "https://..."
    }
  }
  ```

#### Endpoint: GET /x402/vault/download/:purchaseId
- **Cost:** $0.01 USDC
- **Request:**
  ```
  GET /x402/vault/download/pur_xyz789?downloadToken=tok_abc123
  ```
- **Response:** ZIP binary (application/zip)

---

## 6. Demo Script

**Total Duration:** 90 seconds
**Format:** Screen recording posted on X tagging @trypurch

### Scene 1: Hook (0-8 seconds)
**Screen:** Dark background, large animated number "$5,400/year" fading in, then text: "That's how much impulse buying costs you."
**Voiceover:** "Five thousand four hundred dollars. That's what impulse buying costs the average American every year."
**Action:** Number animation, dramatic reveal

### Scene 2: The Problem (8-18 seconds)
**Screen:** Quick montage of normal AI shopping responses — "Sure! Here's the buy link." "Great choice! Adding to cart." All encouraging, zero pushback.
**Voiceover:** "Your AI agent? It just says yes. Every time. No pushback, no alternatives, no brain."
**Action:** Rapid-fire chat bubbles, all affirmative

### Scene 3: Enter FOMO Guard (18-30 seconds)
**Screen:** Split-screen appears. Left: "Normal AI" header. Right: "FOMO Guard" header with shield icon. User types: "Buy Sony WH-1000XM5 for $348"
**Voiceover:** "Meet FOMO Guard. The first defensive persona for Purch Vault."
**Action:** Split-screen renders, user input animates

### Scene 4: The Pushback (30-50 seconds)
**Screen:** Left panel shows generic "Sure, here's the link!" Right panel shows FOMO Guard response: "Bro hold up. The Soundcore Q45 is $88 with 4.5 stars on Purch. That's $260 saved = 0.87 SOL to stack. Diamond hands your wallet, anon."
**Voiceover:** "While normal AI rubber-stamps your purchase, FOMO Guard searches Purch for smarter alternatives. Real products, real prices, real savings."
**Action:** Product comparison cards animate in. Original ($348) vs Alternative ($88). Savings counter: +$260

### Scene 5: More Scenarios (50-62 seconds)
**Screen:** Quick cascade through 3 more scenarios — keyboard, shoes, monitor. Each shows the split-screen and savings accumulating: +$135, +$105, +$220.
**Voiceover:** "Keyboards, shoes, monitors — FOMO Guard finds the better deal every time. Not by stopping you from buying, but by making you buy smarter."
**Action:** Savings tracker animates up: $260 → $395 → $500 → $720

### Scene 6: Vault Lifecycle (62-78 seconds)
**Screen:** Vault marketplace search showing FOMO Guard persona. Click buy. Download ZIP. Show manifest.json contents briefly.
**Voiceover:** "Get FOMO Guard from the Purch Vault. Search, buy, download, install — one click. Powered by five Purch API endpoints and x402 micropayments."
**Action:** Full purchase flow animation, ZIP download, install preview

### Scene 7: Close (78-90 seconds)
**Screen:** FOMO Guard logo + savings total ($720 saved in demo). Tagline: "Your rational brain. On-chain." @trypurch tag visible.
**Voiceover:** "FOMO Guard. Your rational brain for impulsive buying. Built on Purch. Powered by x402."
**Action:** Logo animation, savings counter final state, @trypurch handle

### Demo Prerequisites

**Seed State Table**

| Item | Value | Network / Location | Created By |
|------|-------|-------------------|------------|
| Crossmint wallet | Connected with USDC balance | Solana mainnet | Manual setup |
| USDC balance | $5.00 minimum | Solana wallet | Manual deposit |
| Pre-cached product pairs | 5 scenario pairs (headphones, keyboard, shoes, monitor, webcam) | App local cache | seed-demo.ts |
| FOMO Guard persona | Published to Vault marketplace | Purch Vault | Manual upload or API |
| Demo wallet funding | Enough USDC for ~20 API calls (~$2.50) | Solana wallet | Manual deposit |

**Invariant:** Running `npx ts-node scripts/seed-demo.ts` pre-caches the 5 product comparison scenarios from live Purch API data, ensuring demo reliability.

### Voice & Copy Compliance
- No em dashes in voiceover (use periods and short sentences)
- No corporate buzzwords
- Direct, confident, technical tone
- Crypto-native but accessible language

---

## 7. Risk Register

| # | Risk | Severity | Likelihood | Impact | Mitigation | Decision Tree |
|---|------|----------|-----------|--------|------------|:---:|
| 1 | Purch judges perceive persona as anti-platform | CRITICAL | LOW | Disqualification or negative scoring | Frame as "smart shopping assistant." Every FOMO Guard response finds a BETTER deal ON Purch. Tagline: "Buy smarter, not less." This IS Purch's mission. | Plan Phase 1 |
| 2 | x402 API connection fails during demo | CRITICAL | MEDIUM | Demo shows error states instead of products | Pre-cache 5 product scenarios. Fallback to cached responses if API is down. Test API connection before recording. | Plan Phase 0 |
| 3 | Crossmint wallet integration fails | CRITICAL | MEDIUM | Auth flow broken, no wallet connection | Test Crossmint SDK setup first. Fallback: hardcoded wallet for demo if SDK fails. Decision tree in Plan Phase 0. | Plan Phase 0 |
| 4 | /x402/search returns irrelevant alternatives | HIGH | MEDIUM | Product comparisons look unconvincing | Pre-test 10+ product categories. Cache proven product pairs. Fallback: "This is actually a fair deal" when no better alternative exists. | Plan Phase 1 |
| 5 | Vault persona ZIP format rejected by marketplace | HIGH | LOW | Cannot demonstrate Vault lifecycle | Format is flexible per hackathon brief. Use clean manifest.json + system-prompt.md structure. Test upload before demo. | Plan Phase 2 |
| 6 | Demo video too long or boring for X | HIGH | MEDIUM | Judges skip or lose interest | 90-second target. Constant motion. Every scene has visual action. No static screens longer than 3 seconds. | Plan Phase 3 |
| 7 | Degen language feels forced or cringe | MEDIUM | MEDIUM | Judges cringe instead of laugh | Use REAL CT slang from Twitter. Test 5+ conversations. Keep humor subtle, not overdone. Have non-crypto person review. | Plan Phase 1 |
| 8 | USDC balance runs out during demo | MEDIUM | LOW | API calls fail mid-recording | Budget $5 minimum. Each scenario costs ~$0.12. 5 scenarios = $0.60. 8x safety margin. Fund wallet before recording. | Plan Phase 0 |
| 9 | Split-screen layout breaks on recording resolution | MEDIUM | LOW | Visual demo fails | Test at 1920x1080 before recording. Responsive breakpoint at 1280px. Preview at multiple sizes. | Plan Phase 2 |
| 10 | Crossmint-to-x402 adapter fails | HIGH | MEDIUM | Wallet connected but can't make payments | Server-side x402 with separate keypair is the primary approach. Crossmint is for demo auth UX, not for signing x402 payments. Separation of concerns. | Plan Phase 0 |

### Risk Categories Covered
- [x] Technical risks (#2, #3, #5, #10)
- [x] Competitive risks (zero competitors — confirmed in research)
- [x] Time risks (emergency mode, but V3 correction: Claude Code = 10x)
- [x] Demo risks (#6, #9)
- [x] Judging risks (#1, #7)
- [x] Scope risks (non-negotiables locked, out-of-scope defined)

---

## 8. Day-by-Day Build Plan

| Day | Date | Primary Objective | Secondary Objective | Deliverable |
|:---:|------|------------------|--------------------|-----------  |
| 1 | Apr 19 (today) | Core app + FOMO Guard engine + split-screen UI | Vault asset ZIP + Vault lifecycle demo | Working demo app on Vercel |
| 2 | Apr 20 (deadline) | Demo video recording + submission | Polish + edge cases | Video on X + Typeform submission |

### Day 1 Breakdown (Apr 19)
**Morning (4h):**
- Project scaffolding: Next.js + Tailwind + Crossmint + x402
- x402 payment layer working (server-side)
- FOMO Guard engine: analyzeIntent server action
- Test with live Purch API calls

**Afternoon (4h):**
- Split-screen chat UI with before/after comparison
- Product comparison cards (images, prices, ratings, savings delta)
- Savings tracker with animation
- 5 pre-cached demo scenarios

**Evening (4h):**
- Vault persona ZIP asset (manifest.json, system-prompt.md, examples/)
- Vault lifecycle demo section (search → buy → download)
- Crossmint wallet integration
- Deploy to Vercel
- End-to-end testing

### Day 2 Breakdown (Apr 20)
**Morning (3h):**
- seed-demo.ts: pre-cache product pairs from live API
- Polish: animations, transitions, responsive layout
- Fix any bugs from testing

**Afternoon (3h):**
- Record demo video (90 seconds)
- Edit and post to X tagging @trypurch
- Complete Typeform registration
- Final submission

### Buffer Allocation
- 2h buffer built into Day 2 afternoon for unexpected issues
- Pre-cached scenarios reduce demo-day risk

---

## 9. Dependencies & Prerequisites

### External Services
| Service | URL | Auth Required | Status |
|---------|-----|:---:|---|
| Purch Product API | https://api.purch.xyz/x402/search | x402 (USDC) | Live |
| Purch Shop API | https://api.purch.xyz/x402/shop | x402 (USDC) | Live |
| Purch Vault API | https://api.purch.xyz/x402/vault/* | x402 (USDC) | Live |
| Crossmint Auth | https://www.crossmint.com | API Key | Live |
| Vercel Hosting | https://vercel.com | Account | Live |

### Development Tools
| Tool | Version | Purpose | Install Command |
|------|---------|---------|----------------|
| Node.js | 20+ | Runtime | `brew install node` |
| pnpm | 9+ | Package manager | `npm i -g pnpm` |
| Next.js | 15 | Framework | `pnpm create next-app` |
| TypeScript | 5.5+ | Language | Included with Next.js |

### Accounts & Credentials
| Account | Purpose | How to Get |
|---------|---------|-----------|
| Crossmint API Key | Wallet SDK auth | https://www.crossmint.com/console (free tier) |
| Solana wallet keypair | x402 payment signing (server-side) | Generate with `@solana/kit` or import existing |
| USDC on Solana | Pay for x402 API calls | Bridge or buy on exchange |
| Vercel account | Deploy showcase app | https://vercel.com (free tier) |

### On-Chain Addresses
| Item | Address | Network | Source |
|------|---------|---------|--------|
| USDC (Solana) | EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v | Solana Mainnet | Official USDC mint |

---

## 10. Concerns Compliance

| # | Severity | Concern | How PRD Addresses It |
|---|:---:|---------|----------------------|
| 1 | C | Demo failure: before/after split-screen must work end-to-end | Flow 2 defines the complete split-screen flow. 5 pre-cached scenarios guarantee reliable demo. seed-demo.ts caches live data. |
| 2 | C | Integration failure: Purch x402 API must be live and authenticated | API contracts defined in Section 5. x402 payment layer is a core component. Server-side keypair avoids Crossmint-x402 bridge complexity. |
| 3 | C | Vault asset ZIP format must match existing Vault persona format | ZIP structure defined in Section 4 (Vault Asset ZIP). manifest.json + system-prompt.md + examples/ + config.json. Format is flexible per hackathon brief. |
| 4 | C | Anti-platform perception: persona must be framed as "smart shopping assistant" | Problem statement frames FOMO Guard as finding BETTER deals on Purch. Demo script Scene 4 shows the persona recommending Purch products. Tagline: "Buy smarter, not less." |
| 5 | C | Crossmint wallet integration must function for auth/payment flow | Crossmint Auth Provider is a dedicated component. Three nested providers documented. Fallback: server-side wallet for x402 payments, Crossmint only for auth UX. |
| 6 | I | Product search returns relevant alternatives | Pre-tested 5 product categories (headphones, keyboard, shoes, monitor, webcam). Cached proven pairs. Fallback response for fair-priced items. |
| 7 | I | Degen/CT language must feel natural, not forced | system-prompt.md contains calibrated CT vocabulary. Examples folder has 5+ tested conversations. Language reviewed against real CT Twitter posts. |
| 8 | I | Savings tracker animation must be visually compelling | Framer Motion animation with smooth number transitions. Shows both USD and SOL equivalent. Accumulates across scenarios. |
| 9 | I | Full Vault lifecycle must be demonstrable | Flow 3 covers search → buy → download → install. Demo Script Scene 6 shows the full flow. |
| 10 | I | Scope creep: core persona + demo must be locked | Out-of-scope list defined in WINNER-BRIEF. No trading, no price tracking, no user accounts beyond wallet. |
| 11 | I | Demo must feel like the real product, not a prototype | Full visual design with product images, animations, real API data. Crossmint wallet gives real auth UX. |
| 12 | I | Deep integration across full Purch API (5+ endpoints) | 6 endpoints used: /x402/search, /x402/shop, /x402/buy, /x402/vault/search, /x402/vault/buy, /x402/vault/download. All organically integrated — persona NEEDS them to function. |
| 13 | A | UI polish is advisory | Tailwind CSS + Framer Motion provide polished baseline. Demo-visible components prioritized. |
| 14 | A | Upgrade path (Deep Dive button) only if core is polished | Documented as upgrade path in WINNER-BRIEF. Only attempted after core is complete. |
