# WAR ROOM V1 — PURCH VAULT HACKATHON DELIBERATION BRIEF
**Date:** 2026-04-18
**Objective:** Pick THE ONE idea (or combo) for Purch Vault Hackathon that is BOTH the most winnable AND solves a significant real problem.

---

## NON-NEGOTIABLE RULES (from the builder)

### CRITICAL CONCERNS (Must satisfy — idea eliminated if violated)
1. **[C] Time NOT a constraint.** Claude Code = 10x dev speed. Do NOT penalize ideas for complexity.
2. **[C] Uniqueness is non-negotiable.** Zero competitors in target space strongly preferred.
3. **[C] "Does this help real humans?" test.** Every idea must pass it.
4. **[C] Cumulative corrections (nothing dropped).** Every correction carries forward.
5. **[C] Must solve a SIGNIFICANT, real problem.** Builder must BELIEVE in it.
6. **[C] Must serve actual target users who exist TODAY.**

### IMPORTANT CONCERNS (Should satisfy — score penalty if violated)
7. **[I] Everything is devnet/testnet.** Mocks are fine for demos.
8. **[I] Read ALL research data.** Use evidence, not opinion.
9. **[I] Take your time, be extensive.** 200-400 words per proposal, evidence-backed.
10. **[I] Focused product, BROAD problem.** Niche scope, broad audience.
11. **[I] Winning AND real impact are not mutually exclusive.**
12. **[I] Demo must feel like the real product.**
13. **[I] AI/Agents should be considered.** The entire hackathon is about AI agent assets.
14. **[I] Deep integration across full Purch API wins over single-endpoint usage.**

### ADVISORY CONCERNS (Nice to satisfy — noted but not enforced)
15. **[A] Fresh ideas allowed.** Not limited to predefined set.
16. **[A] Reframing is on the table.** Same tech, different problems.

### PER-HACKATHON CONCERNS
17. **[I] Existing GitHub repos must be genuinely evaluated — both as standalone submissions AND as combinations/upgrades. Consider merging repos, extracting components, enhancing with Purch integration, and every viable permutation before new ideation.**
18. **[I] Empty Vault categories (Development, Career, iOS, Productivity) represent blue ocean — prioritize these over saturated crypto/trading.**

---

## HACKATHON FACTS
- **Hackathon:** Purch Vault Hackathon
- **Deadline:** April 20, 2026 (2 days remaining)
- **Prize Pool:** $5,000 USDC + $PURCH tokens
- **Tracks:** Best Skill ($700/$300/$100), Best Knowledge Pack ($700/$300/$100), Best Persona ($700/$300/$100), Grand Prize — Best Purch Integration ($1,500 + $PURCH)
- **Platform:** Purch — AI shopping agent on Solana with x402 micropayments
- **Chain:** Solana (also supports Base for agents)
- **Submission:** Video demo on X tagging @trypurch + Typeform registration
- **First edition** — no past winners

## JUDGING CRITERIA (equal weight, ~33% each)
1. **Demo** — Video demonstration on X showing product working. Visual impact matters most (first-listed).
2. **Usefulness** — Solves real problems with practical applications.
3. **Quality** — Clean code, documentation, ease of setup.

## CONFIRMED JUDGES
- **@pixelarthur** (Purch co-founder) — wants deep Purch product integration, novel Vault use cases
- **@ththomas_** (Purch co-founder) — wants product quality, real-world usefulness, clean code
- **@fedesarquis** (Crossmint DevRel) — wants Crossmint wallet SDK usage, onboarding UX
- **@henloitsjoyce** (Crossmint DevRel) — wants agentic finance, Crossmint wallet integration

**50% of judges are Crossmint — wallet/payment UX matters to half the jury.**

## THE BUILDER
- Solo developer using Claude Code (10x dev speed)
- Deep experience with AI agents, trust scoring, payment systems, Solana
- Existing repos: agent-auditor (trust scoring), trusttap (8-dim reputation), verdikt (dispute resolution), axon (AI trading terminal), kasgate (payment gateway)
- Preference: deep native integration as primary strategy
- Stack: TypeScript/Next.js/Tailwind/Solana

---

## PURCH VAULT CAPABILITIES

### What Purch Is
AI-powered shopping concierge for agentic commerce. Natural language search across 1B+ Amazon items + Shopify stores. Payments in USDC via x402 micropayments. Crossmint smart wallets (email signup, no wallet needed).

### Vault Asset Types
- **Skills** — Ready-to-use agent workflows. Command-trigger format ("buy X", "check X", "thread X").
- **Knowledge** — Curated knowledge bases. Domain expertise packaged as reference frameworks.
- **Personas** — Agent personalities. Voice, personality, behavioral constraints.
- **Categories:** Marketing, Development, Automation, Career, iOS, Productivity

### Vault API
| Endpoint | Method | Cost | Purpose |
|----------|--------|------|---------|
| `/x402/vault/search` | GET | $0.01 | Search assets (q, category, productType) |
| `/x402/vault/buy` | POST | Item price | Purchase (slug, walletAddress, email) |
| `/x402/vault/download/:id` | GET | $0.01 | Download ZIP (downloadToken) |

### Product API
| Endpoint | Method | Cost | Purpose |
|----------|--------|------|---------|
| `/x402/search` | GET | $0.01 | Structured product search |
| `/x402/shop` | POST | $0.10 | AI natural language search |
| `/x402/buy` | POST | Product price | One-command checkout |

### x402 Protocol
- HTTP 402 Payment Required → client signs USDC payment → retries → response
- No API keys — wallet = identity, payment = auth
- Packages: @x402/fetch, @x402/svm, @solana/kit

### Crossmint Smart Wallets
- Non-custodial, email sign-in, no wallet needed
- SDK: @crossmint/client-sdk-react-ui
- 50% of judges are Crossmint DevRel — integration is strategic

---

## EXISTING VAULT MARKETPLACE (all by Purch, all $1)

| Asset | Type | Category |
|-------|------|----------|
| Lightning Quick Buy | Skill | Automation |
| Auto Thread Writer | Skill | Marketing |
| Instant Rug Check | Skill | Automation |
| Memecoin Playbook | Knowledge | Automation |
| Rug Check Master | Knowledge | Automation |
| Content Creator Bible | Knowledge | Marketing |
| Content Machine | Persona | Marketing |
| Degen Trader | Persona | Automation |
| Security Sentinel | Persona | Automation |
| Faith | Knowledge | Productivity |

**Pattern:** All crypto/trading focused. Development, Career, iOS categories = EMPTY.

---

## KNOWN COMPETITORS
Zero visible competitors. First-edition hackathon. No GitHub repos, no X activity from builders found.

| Category | Activity | Est. Teams | Density |
|----------|----------|:---:|:---:|
| Best Skill | Low | 0-3 | LOW |
| Best Knowledge Pack | Low | 0-3 | LOW |
| Best Persona | Low | 0-3 | LOW |
| Grand Prize | Low | 0-3 | LOW |

---

## KILL LIST (ideas matching ANY = dead)
1. **Saturated:** Generic rug checkers, basic trading bots, CT thread writers
2. **Broken Dependencies:** $PURCH token integration (not shipped), X Integration features (in-progress)
3. **Already Built:** Shopping assistant clones, gift recommendation tools, quick buy wrappers
4. **Zero Alignment:** DeFi protocols, NFT projects, standalone AI chatbots, hardware projects

---

## WHAT PAST WINNERS HAVE IN COMMON
- Problem-solution fit (~25%), technical execution (~20%), innovation (~20%)
- Deep sponsor integration beats surface-level (45% of Chainlink winners used multiple services)
- Solo developers CAN win with deep integration
- Limit to 3 features maximum
- Target less popular bounties (empty categories = blue ocean)
- Clean README + screenshots increases judging scores

---

## BUILDER'S GITHUB REPOS (evaluated for adaptation)

### HIGH POTENTIAL
- **agent-auditor / agent-auditor-solana** — Trust scoring for AI agents → Vault Skill for asset quality auditing
- **trusttap** — 8-dimension reputation infrastructure → Knowledge Pack for trust frameworks
- **verdikt** — Dispute resolution for micropayments → x402 commerce protection
- **omnispect-x** — Multi-dimensional trust scoring → Combo with agent-auditor

### KILLED
- deltaagent (DeFi trading, saturated), ghostfund (DeFi vault, zero alignment), deeprock (RWA, zero alignment), cre-compliance-gate (wrong chain), axon (trading copilot, saturated overlap)

---

## YOUR TASK
You are 4 expert agents debating which idea to build for the Purch Vault Hackathon.

### AGENT ROLES

**DEMO — "The Demo Whisperer"** (Archetype: Judge Whisperer)
Lens: "What does the judge SEE in the X video?"
Evaluates: Visual impact, X engagement, viewer experience
Criteria: Demo (primary)
Bias: Overvalues flash over substance

**USE — "The Real-World Advocate"** (Archetype: User Advocate)
Lens: "Who uses this on day 1?"
Evaluates: Pain point severity, user accessibility, utility
Criteria: Usefulness (primary)
Bias: Overvalues user delight over novelty

**CRAFT — "The Code Craftsman"** (Archetype: Engineer)
Lens: "Is the code clean, documented, deeply integrated?"
Evaluates: Code quality, x402 depth, Crossmint usage, ZIP structure
Criteria: Quality (primary)
Bias: Overvalues elegance over user appeal

**WILD — "The Contrarian"** (Archetype: Contrarian)
Lens: "What would NOBODY else submit?"
Evaluates: Uniqueness, category gaps, differentiation
Criteria: Cross-cutting (innovation, surprise)
Bias: Overvalues uniqueness over execution

### IDEAS TO EVALUATE (from ideas.md)

1. **VaultGuard** (23/25) — Vault asset auditor skill using agent-auditor repo. vault/search→buy→download→analyze.
2. **SkillForge** (23/25) — Meta-skill that creates vault assets. "create skill <desc>" → generates formatted ZIP.
3. **VaultGuard Suite** (22/25) — VaultGuard skill + x402 Builder's Guide knowledge pack combo.
4. **TrustLayer** (21/25) — 8-dimension trust scoring (trusttap) for vault assets and creators.
5. **CommerceGuard** (20/25) — x402 transaction intelligence + dispute resolution (verdikt).
6. **VaultScout** (20/25) — Vault discovery & recommendation skill.
7. **DevKit Persona** (18/25) — Developer companion persona for Purch/x402 ecosystem.
8. **ShopSage Persona** (17/25) — Strategic shopping advisor persona.

**Agents can and should propose completely new ideas beyond this list, including novel repo combinations not yet considered.**
