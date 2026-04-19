# PURCH VAULT HACKATHON — Research Brief
**Compiled:** 2026-04-18
**Intel Depth:** ID 3 (Quick Recon)
**Sources:** Web Research (docs.purch.xyz, x402.org, GitHub, vault.purch.xyz)

---

## Overview

| Field | Value |
|-------|-------|
| Name | Purch Vault Hackathon |
| Organizer | Purch (+ Crossmint co-judging) |
| Platform | Custom (Typeform registration + X/Twitter video demo) |
| Deadline | April 20, 2026 (no timezone specified) |
| Tracks | Best Skill, Best Knowledge Pack, Best Persona, Grand Prize (Best Purch Integration) |
| Chain | Solana (also Base for agent payments) |
| Native token | $PURCH (utility, staking in development) |
| Wallet infra | Crossmint smart wallets (email signup, no wallet needed) |
| Payment protocol | x402 (HTTP 402 Payment Required + USDC) |

### Submission Requirements
- Video demo posted on X (Twitter) tagging **@trypurch** [A1]
- Must demonstrate the product in action [A1]
- Register via Typeform on purch.xyz/hackathon [A1]
- No team size limits, no eligibility restrictions documented [A2]

---

## Prizes

| Category | 1st | 2nd | 3rd |
|----------|-----|-----|-----|
| **Grand Prize — Best Purch Integration** | $1,500 USDC + $PURCH tokens | — | — |
| **Best Skill** | $700 | $300 | $100 |
| **Best Knowledge Pack** | $700 | $300 | $100 |
| **Best Persona** | $700 | $300 | $100 |

**Total:** $5,000 USDC + undisclosed $PURCH token bonus [A1]

---

## Judging Criteria

| Criterion | What It Means | How to Score High |
|-----------|--------------|-------------------|
| **Demo** | Video on X tagging @trypurch showing the product working | Polished video, real usage, compelling narrative. This is PUBLIC — X engagement may matter. [A1] |
| **Usefulness** | Solves a real problem with practical application | Build something people would actually pay for / use. Not "tech for tech's sake." [A1] |
| **Quality** | Clean code, documentation, ease of setup | README, clear install instructions, well-structured codebase. [A1] |

**BOTTOM LINE:** No weighted percentages given — all 3 criteria appear equal. Demo is first-listed, suggesting visual impact matters most.
**EVIDENCE:** Official hackathon page [A1]
**CONFIDENCE:** High — direct from hackathon page
**SO WHAT:** Invest heavily in demo video quality. Build something with a clear "wow" moment in under 60 seconds.

---

## Tech Deep Dive

### x402 Protocol
- Open payment protocol by Coinbase (co-founded with Cloudflare, Sep 2025) [A1]
- Revives HTTP 402 Payment Required status code for programmatic payments [A1]
- Flow: Request → 402 challenge with price → client signs USDC payment → retries → response [A1]
- No API keys, no subscriptions — wallet = identity, payment = auth [A1]
- Massive ecosystem: 100+ services, 30+ facilitators, AWS/Cloudflare/Stripe integrated [A1]
- Solana implementation: sub-cent tx costs, instant settlement [B2]

### Purch API (Base URL: `https://api.purch.xyz`)

**Product Endpoints:**

| Endpoint | Method | Cost | Purpose |
|----------|--------|------|---------|
| `/x402/search` | GET | $0.01 | Structured product search (q, priceMin, priceMax, brand, page) |
| `/x402/shop` | POST | $0.10 | AI natural language product search (message, context) |
| `/x402/buy` | POST | Product price | One-command checkout (asin/productUrl, email, shippingAddress) |

**Vault Endpoints:**

| Endpoint | Method | Cost | Purpose |
|----------|--------|------|---------|
| `/x402/vault/search` | GET | $0.01 | Search assets (q, category, productType, minPrice, maxPrice) |
| `/x402/vault/buy` | POST | Item price | Purchase asset (slug, walletAddress, email) |
| `/x402/vault/download/:id` | GET | $0.01 | Download ZIP (downloadToken required) |

**Interactive API docs:** `api.purch.xyz/docs` [A1]

### Required Packages
```
@x402/fetch        — wraps fetch with automatic x402 payment handling
@x402/svm          — Solana chain config (SOLANA_MAINNET_CAIP2)
@x402/svm/exact/client — ExactSvmScheme signer
@solana/kit        — Solana key pair signing
```

### Quick Start Code
```js
import { createKeyPairSignerFromBytes } from "@solana/kit";
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { SOLANA_MAINNET_CAIP2 } from "@x402/svm";
import { ExactSvmScheme } from "@x402/svm/exact/client";

const signer = await createKeyPairSignerFromBytes(walletSecretKey);
const client = new x402Client();
client.register(SOLANA_MAINNET_CAIP2, new ExactSvmScheme(signer));
const fetchWithPay = wrapFetchWithPayment(fetch, client);

// All API calls now auto-pay via x402
const res = await fetchWithPay("https://api.purch.xyz/x402/search?q=headphones");
```

### Crossmint Smart Wallets
- Non-custodial smart accounts, setup in <5 minutes [A1]
- Email/social sign-in — no crypto wallet needed [A1]
- React SDK abstracts RPCs, bundlers, gas sponsorship [A1]
- SDK: `@crossmint/client-sdk-react-ui` [A1]
- Docs: `docs.crossmint.com/sdk-reference/smart-wallets/overview` [A1]
- Judges @fedesarquis and @henloitsjoyce are Crossmint DevRel [B2]

### Time to Hello World

| Tech | Estimated Time | Friction |
|------|:---:|---|
| x402 fetch wrapper | ~15 min | Low — npm install + 5 lines of code |
| Purch Search/Shop API | ~20 min | Low — just x402 + fetch |
| Purch Buy API | ~30 min | Medium — needs real USDC + shipping address |
| Vault Search API | ~15 min | Low — same as product search |
| Vault Buy + Download | ~30 min | Medium — needs USDC balance |
| Crossmint Wallet SDK | ~30 min | Medium — API key setup required |

---

## Ecosystem Products

| Product | Purpose | Integration Depth | Docs URL | Notes |
|---------|---------|:---:|----------|-------|
| Purch Chat | Conversational AI shopping | Deep | docs.purch.xyz/docs/features/chat | Core feature |
| Purch Quick Buy | Instant purchase from URL | Medium | docs.purch.xyz/docs/features/quick-buy | Amazon + Shopify |
| Gift Hunter | Social profile → gift suggestions | Medium | docs.purch.xyz/docs/features/gift-hunter | X, Instagram, TikTok |
| Purch Vault | Agent asset marketplace | Deep | docs.purch.xyz/docs/vault/overview | Skills, Knowledge, Personas |
| x402 Protocol | HTTP micropayments | Deep | x402.org, docs.cdp.coinbase.com/x402 | Coinbase + Cloudflare backed |
| Crossmint | Smart wallet infra | Medium | docs.crossmint.com | Email-based wallets |

---

## Existing Vault Marketplace Inventory

**BOTTOM LINE:** The Vault marketplace currently has ~10 assets, ALL created by Purch (1st party). All priced at $1. No community-created assets visible.
**EVIDENCE:** vault.purch.xyz marketplace snapshot [A1]
**CONFIDENCE:** High — direct observation
**SO WHAT:** The marketplace is empty of community content. ANY quality submission will stand out. The existing assets show what Purch considers a good example — study their format.

### Current Assets (all $1, all by Purch)

| Asset | Type | Category | Description |
|-------|------|----------|-------------|
| Lightning Quick Buy | Skill | Automation | "buy <CA> <amount>" instant Jupiter swap execution |
| Auto Thread Writer | Skill | Marketing | "thread <topic>" → complete CT thread with format flags |
| Instant Rug Check | Skill | Automation | "check <CA>" → structured risk score + red flags |
| Memecoin Playbook | Knowledge | Automation | Market cap strategies, entry/exit signals, pump detection |
| Rug Check Master | Knowledge | Automation | 0-100 risk scoring framework + API references |
| Content Creator Bible | Knowledge | Marketing | CT content playbook — thread formulas, hooks, posting schedules |
| Content Machine | Persona | Marketing | Web3 content creator with witty CT-native voice |
| Degen Trader | Persona | Automation | Aggressive memecoin trader persona, degen slang |
| Security Sentinel | Persona | Automation | Paranoid security-first guardian persona |
| Faith | Knowledge | Productivity | Faith development guide (by "an" — possibly community) |

**Patterns observed:**
- Crypto/trading focus dominates (rug checks, memecoins, trading)
- Marketing = CT (Crypto Twitter) content creation
- Skills use command-trigger format ("buy X", "check X", "thread X")
- Knowledge packs are reference frameworks with rules and patterns
- Personas define voice, personality, and behavioral constraints
- Assets delivered as ZIP files

---

## Competitor Landscape

### Competitor Registry

| Project | Track | Threat | Tech | Source | Confidence |
|---------|-------|:---:|---|---|:---:|
| *No competitors found* | — | — | — | — | — |

**BOTTOM LINE:** Zero visible competitors. Submissions are not public on any platform. No GitHub repos reference this hackathon. No X/Twitter activity found from builders.
**EVIDENCE:** GitHub search [B2], web search [B2], vault.purch.xyz [A1]
**CONFIDENCE:** Medium — absence of evidence ≠ evidence of absence. Submissions may exist but be invisible until deadline.
**SO WHAT:** Competition is likely very low given $5K prize pool and niche scope. Even a moderate-quality submission has strong winning odds. Focus on quality and deep integration over speed.

### Competition Density Map

| Track | Est. Teams | Activity | Density |
|-------|:---:|---|:---:|
| Best Skill | 0-3 | Low | LOW |
| Best Knowledge Pack | 0-3 | Low | LOW |
| Best Persona | 0-3 | Low | LOW |
| Grand Prize | 0-3 | Low | LOW |

---

## Past Editions Analysis

**No past editions.** This appears to be the first Purch Vault Hackathon [B2]. The Vault itself shipped March 2026 per the roadmap [A1].

---

## Broader Market Context

**BOTTOM LINE:** x402 is experiencing explosive growth as the HTTP-native payment standard for AI agents. Purch sits at the intersection of x402 + agentic commerce — a hot narrative.
**EVIDENCE:** x402.org ecosystem page shows 100+ services [A1], Coinbase/Cloudflare/Stripe/AWS all integrated [A1], Galaxy Research bullish analysis [C3]
**CONFIDENCE:** High
**SO WHAT:** Building something that showcases x402's power in a consumer-facing way aligns with the broader market narrative. Judges (especially Crossmint team) will value projects that make agentic commerce feel real.

### Key Trends
- **x402 adoption accelerating** — AWS, Cloudflare, Stripe, Alchemy all onboard [A1]
- **Agent-to-agent commerce** — Agoragentic, AgentCash, Questflow building agent marketplaces [A1]
- **Agentic finance** — @henloitsjoyce (Crossmint judge) actively tweets about this topic [C3]
- **$PURCH token** — Market cap dropped 92% from peak ($19.5M → $1.5M) [C3] — token incentive for Grand Prize may be modest in dollar terms

---

## Judge Profiles

| Judge | Org | Role | Likely Priorities |
|-------|-----|------|-------------------|
| **@pixelarthur** | Purch | Co-founder | Deep Purch product integration, novel use cases for the Vault, x402 adoption [D3] |
| **@ththomas_** | Purch | Co-founder | Product quality, real-world usefulness, clean code [D3] |
| **@fedesarquis** | Crossmint | DevRel | Crossmint wallet SDK usage, onboarding UX, developer experience [B2] |
| **@henloitsjoyce** | Crossmint | DevRel | Agentic finance, Crossmint wallet integration, consumer-facing products [C3] |

**BOTTOM LINE:** 50% of judges are Crossmint — wallet/payment UX matters to half the jury. The other 50% are Purch founders who want to see their platform used deeply.
**EVIDENCE:** Official hackathon page [A1], @henloitsjoyce X posts about agentic finance [C3], Crossmint DevRel job listings [B2]
**CONFIDENCE:** Medium — role-based inference, no direct statements about judging priorities
**SO WHAT:** Build something that uses BOTH Purch API + Crossmint wallets. Projects that only use one will satisfy half the judges. Projects using both satisfy all four.

### Sponsor Alignment Narratives

**Purch alignment:** "We built the first real-world agentic commerce platform. Your submission proves our marketplace model works by creating assets people actually want to buy and use."

**Crossmint alignment:** "We make crypto invisible. Your submission shows that AI agents can transact for users without them ever touching a wallet seed phrase."

**Combined narrative:** "Agent commerce should be as simple as asking. Your project makes that real — agents discover, purchase, and use digital assets through natural interaction, paid seamlessly via x402."

---

## Strategic Recommendations

### Primary Strategy: Grand Prize Hunt ($1,500)

Build a project that deeply integrates across the FULL Purch stack:
1. Uses Vault API (search → buy → download) to discover and acquire agent assets
2. Uses Product API (search → shop → buy) to demonstrate commerce
3. Wraps in Crossmint wallet for seamless auth
4. Demonstrates x402 micropayments as the payment rail
5. Delivers a compelling X video demo

**Risk:** Higher scope. **Reward:** 2x the prize of any single track.

### Fallback Strategy: Single Track ($700-$1,100)

If scope is too large, target ONE track and do it excellently:
- **Best Skill** — Most tangible, easiest to demo. Command-trigger format works.
- **Best Knowledge Pack** — Most creative freedom. Domain expertise packaged well.
- **Best Persona** — Lowest effort to create, but needs to be distinctive and useful.

**Recommended single track:** Best Skill — it's the most demo-friendly and the most aligned with what the marketplace already showcases.

### Non-Obvious Opportunities

1. **Development category is empty** — All existing Vault assets are Marketing/Automation. A Development-focused skill (code review, debugging, architecture) would fill a visible gap.
2. **Career category is empty** — Resume optimization, interview prep skills have zero competition in the Vault.
3. **iOS category is empty** — Swift development skills are listed as a category but have zero assets.
4. **Productivity category has 1 asset** — "Faith" is the only non-crypto asset. A productivity skill would differentiate sharply.

---

## Social Intel

Social Intelligence: Not gathered (user skipped social review). See Competitor Landscape section for web-sourced data.

---

## Key Links & Resources

| Resource | URL |
|----------|-----|
| Hackathon Page | https://purch.xyz/hackathon |
| Purch App | https://purch.xyz |
| Purch Docs | https://docs.purch.xyz |
| Vault Marketplace | https://vault.purch.xyz |
| API Interactive Docs | https://api.purch.xyz/docs |
| x402 Protocol | https://x402.org |
| x402 Ecosystem | https://x402.org/ecosystem |
| x402 Coinbase Docs | https://docs.cdp.coinbase.com/x402 |
| Solana x402 Guide | https://solana.com/developers/guides/getstarted/intro-to-x402 |
| Crossmint Wallet SDK | https://docs.crossmint.com/sdk-reference/smart-wallets/overview |
| Crossmint GitHub | https://github.com/Crossmint/crossmint-sdk |
| Purch GitHub (x-purch) | https://github.com/purch-xyz/x-purch |
| Purch GitHub (x-gifts) | https://github.com/purch-xyz/x-gifts |
| @trypurch (X) | https://x.com/trypurch |
| @henloitsjoyce (X) | https://x.com/henloitsjoyce |

---

## Kill List

Ideas matching ANY of these categories are dead on arrival:

### 1. Saturated
- **Generic rug checkers** — Purch already has 2 in the Vault (Instant Rug Check + Rug Check Master)
- **Basic trading bots** — Degen Trader persona already exists, Lightning Quick Buy skill already exists
- **CT thread writers** — Auto Thread Writer + Content Creator Bible + Content Machine already cover this

### 2. Broken Dependencies
- **Anything requiring $PURCH token integration** — staking not shipped yet (in-progress per roadmap)
- **X Integration features** — @trypurch ordering via X is in-progress, building on top of unreleased infra is risky
- **Global shipping** — only US shipping supported currently [A1]

### 3. Already Built
- **Shopping assistant clones** — Purch Chat IS a shopping assistant. Don't rebuild the core product.
- **Gift recommendation tools** — Gift Hunter already does social profile → gift suggestions
- **Quick buy wrappers** — Quick Buy feature already supports Amazon + Shopify URLs

### 4. Zero Alignment
- **DeFi protocols** — This is a commerce hackathon, not a DeFi hackathon
- **NFT projects** — Vault sells agent assets (ZIP files), not NFTs
- **Standalone AI chatbots** — Must integrate with Purch ecosystem to score
- **Hardware projects** — x402 is software-only micropayments
