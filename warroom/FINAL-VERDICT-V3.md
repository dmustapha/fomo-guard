# FINAL VERDICT V3 — PURCH VAULT HACKATHON
**Date:** 2026-04-19
**Warroom Version:** V3 (Audience-Aligned — crypto-native users)
**Deliberation Rounds:** 6 (Round 0 through Round 4 + Premortem)

---

## Section 1: Deliberation Transcript

### Round 0 — Silent Assessment (Delphi Method, 4 Independent Subagents)

| Idea | DEMO Avg | USE Avg | CRAFT Avg | WILD Avg | Cross-Agent Avg | Divergence |
|------|:--------:|:-------:|:---------:|:--------:|:---------------:|:----------:|
| Token Analyst | 7.0 | 7.7 | 7.3 | 7.3 | 7.3 | LOW (0.7) |
| Onchain Sleuth | 7.3 | 7.7 | 6.3 | 7.7 | 7.3 | MED (1.4) |
| Degen Shopping Guide | 6.7 | 5.7 | 8.0 | 7.0 | 6.9 | HIGH (2.3) |
| FOMO Guard | 6.0 | 5.7 | 7.7 | 7.7 | 6.8 | MED (2.0) |
| Airdrop Scout | 6.7 | 7.3 | 6.0 | 7.3 | 6.8 | MED (1.3) |
| Web3 Builder Kit | 6.3 | 6.0 | 7.0 | 6.0 | 6.3 | LOW (1.0) |
| Portfolio Risk | 5.7 | 5.0 | 5.3 | 6.3 | 5.6 | MED (1.3) |
| CT Alpha | 5.0 | 4.7 | 5.3 | 6.0 | 5.3 | LOW (1.3) |

**Key divergences flagged for debate:**
- Degen Shopping Guide (2.3 spread): CRAFT 8.0 vs USE 5.7 — integration depth vs audience mismatch
- FOMO Guard (2.0 spread): CRAFT/WILD 7.7 vs DEMO/USE 5.7-6.0 — memorability vs demo risk
- Onchain Sleuth (1.4 spread): CRAFT 6.3 vs others 7.3-7.7 — shallow Purch integration concern

### Round 1 — Proposals (12 total, Toulmin-structured)

**Idea frequency across agents:**
- Token Analyst: 3 agents (DEMO #3, USE #1, CRAFT #3)
- Onchain Sleuth: 3 agents (DEMO #1, USE #3, WILD #1)
- FOMO Guard: 3 agents (DEMO #2, CRAFT #2, WILD #2)
- Degen Shopping Guide: 2 agents (CRAFT #1, WILD #3)
- Airdrop Scout: 1 agent (USE #2)

**Not proposed:** Web3 Builder Kit, CT Alpha, Portfolio Risk

### Round 2 — Cross-Examination

**Attacks delivered: 10 total**

| Attack | Attacker → Target | Classification | Result |
|--------|-------------------|:-:|---|
| "Barely needs Purch to exist" | CRAFT → Onchain Sleuth | HEAVY HIT | Partially defended — Vault lifecycle IS the demo, but product API absent |
| "Deeper rug check, not novel" | WILD → Token Analyst | HEAVY HIT | Defended — Rug Check = contract code scans, Token Analyst = fundamental analysis. Different scope entirely |
| "Wrong audience — degens don't shop" | USE → Degen Shopping Guide | HEAVY HIT | Partially defended — judges ARE building a shopping platform, but user mismatch is real |
| "Anti-platform perception" | USE → FOMO Guard | HEAVY HIT | Defended — "smart shopping, not anti-Purch." Finds BETTER alternatives on Purch. Uses Purch's own search API to recommend |
| "Data staleness kills credibility" | DEMO → Airdrop Scout | HEAVY HIT | Partially survived — framework value exists, but stale data in live demo = credibility collapse |
| "Just a system prompt with personality" | CRAFT → CT Alpha | KILLING BLOW | FATAL — 3 endpoints, vault-only, no unique functionality |
| "Nobody demos seatbelts" | DEMO → Portfolio Risk | KILLING BLOW | FATAL — risk warnings in text conversations are visually dead |
| "Invisible demo — code comparison in 60s" | DEMO → Web3 Builder Kit | KILLING BLOW | FATAL — judges on X scroll past code comparisons |
| "Persona or skill? Category confusion" | CRAFT → FOMO Guard | FLESH WOUND | Defended — exceeding category expectations is a feature, not a bug. Judges reward depth. |
| "No real on-chain data access" | USE → Onchain Sleuth | HEAVY HIT | Partially defended — skill provides FRAMEWORK, but lack of real APIs limits depth |

### Round 3 — Defense, Self-Critique, Kills

**Self-critiques (all 4 agents):**

- DEMO on Onchain Sleuth: "The investigation board visual is ambitious. If it looks half-built, it's worse than a clean simple UI. I'm betting on execution quality I can't guarantee. This is the highest-ceiling AND highest-floor idea."

- USE on Token Analyst: "Free tools exist — DEXScreener, CoinGecko, Token Sniffer. The AI adds synthesis and structure, but the data sources are the same. Users might not pay $1 for what they get free elsewhere. The real value must be in the FRAMEWORK and REASONING, not data."

- CRAFT on Degen Shopping Guide: "I'm optimizing for judge approval, not user need. The deepest Purch integration doesn't matter if nobody uses the skill after the hackathon. I've been blinded by endpoint count."

- WILD on FOMO Guard: "The subversive angle is a double-edged sword. If even ONE Purch judge perceives this as mocking their platform, the demo score craters. The line between 'clever' and 'insulting' is razor-thin. I'm betting on judge sophistication."

**Hybrid proposed: Token Sleuth** (Token Analyst + Onchain Sleuth combined)
- Token fundamental analysis + deployer wallet investigation in one skill
- "Investigate $WIF" → tokenomics report + deployer wallet behavior analysis
- Proposed by CRAFT, supported by WILD
- REJECTED by USE and DEMO: "This is TWO features, not ONE. V1 correction says ONE clean thing. Split focus = neither polished."

**Killed (3):** CT Alpha (no engineering depth, just a prompt), Portfolio Risk (invisible demo), Web3 Builder Kit (can't demo code learning in 60s)

**Survived (5):**
- FOMO Guard: HIGH confidence (survived all attacks + deep integration defense)
- Token Analyst: HIGH confidence (differentiated from Rug Check, most useful)
- Onchain Sleuth: MEDIUM confidence (best demo, but shallow Purch integration is real concern)
- Degen Shopping Guide: MEDIUM confidence (deepest integration, but audience mismatch)
- Airdrop Scout: LOW confidence (universal need, but data reliability fatal flaw)

### Round 3.5 — Premortem

**FOMO Guard top 3 preventable failures:**
1. Purch judge perceives persona as anti-platform → Prevention: Frame EXPLICITLY as "smart shopping assistant" in demo video. Show it finding BETTER deals on Purch, not discouraging purchase. The persona USES Purch's search to find alternatives.
2. Demo is text-heavy — judges watching X on mute see a chat log, not a product → Prevention: Visual split-screen design. Side-by-side comparison. Spending tracker animation. Make it VISUAL, not conversational.
3. "Persona" category seems too simple — judges expect a system prompt, get confused by app → Prevention: Demo the full Vault lifecycle first (search → buy → install), THEN show the persona in action. Make the persona format clear.

**Token Analyst top 3 preventable failures:**
1. Report card looks like "prettier rug check" — judges see incremental → Prevention: Side-by-side comparison showing Rug Check (3 lines: risk score) vs Token Analyst (full report: tokenomics, social, fundamentals, comparable projects). Make the depth difference obvious.
2. Analysis is generic — AI fabricates data for obscure tokens → Prevention: Pre-test with well-known tokens ($SOL, $BONK, $WIF) where the AI has training data. Demo with proven tokens only.
3. Shallow Purch integration (mostly Vault endpoints) → Prevention: Add product recommendations at the end of analysis: "Based on this analysis, you might want:" → search for hardware wallets, crypto security books via /x402/search.

**Degen Shopping Guide top 3 preventable failures:**
1. "Sharpe ratio on headphones" gimmick wears thin → Prevention: Focus on GENUINE analytical value (price efficiency, review analysis, deal scoring) with trader terminology as flavor, not core.
2. Audience mismatch — demo doesn't resonate with crypto judges → Prevention: Use crypto-adjacent products in demo (hardware wallets, mining equipment, gaming peripherals for crypto gamers).
3. Feels like V2's Shop & Compare with crypto slang → Prevention: Emphasize the ANALYTICAL framework (confidence-weighted scoring, multi-dimensional evaluation) as genuine product innovation, not just language swap.

### Round 4 — Final Vote

**Vote tally:**
| Idea | DEMO | USE | CRAFT | WILD | Total |
|------|:----:|:---:|:-----:|:----:|:-----:|
| FOMO Guard | 3 | 1 | 2 | 3 | **9** |
| Token Analyst | 1 | 3 | 1 | — | 5 |
| Onchain Sleuth | 2 | — | — | 2 | 4 |
| Degen Shopping Guide | — | — | 3 | 1 | 4 |
| Airdrop Scout | — | 2 | — | — | 2 |

**DEMO vote reasoning:** "FOMO Guard's before/after contrast is the most engaging 60 seconds on X. The degen language is a hook. The split-screen IS the demo. Onchain Sleuth has higher ceiling but more execution risk."

**USE vote reasoning:** "Token Analyst solves the most significant daily workflow for the most users. Airdrop Scout is universal but data staleness concern drops it to #2. FOMO Guard's usefulness is real but narrow."

**CRAFT vote reasoning:** "Degen Shopping Guide uses 5+ Purch endpoints as core functionality — it IS the Grand Prize entry. FOMO Guard is second because it's the strongest persona architecture I've seen — 5 endpoints with natural product API integration."

**WILD vote reasoning:** "FOMO Guard is the submission judges DISCUSS after judging. In a zero-competitor hackathon, memorable wins. Onchain Sleuth is the most novel but can't win Grand Prize with 3 endpoints."

---

## Section 2: Top Ideas Table

| Rank | Idea | Demo (33%) | Useful (33%) | Quality (33%) | Wtd Avg | Vote Pts | YC PQ | Bonus | FINAL |
|:----:|------|:----------:|:------------:|:-------------:|:-------:|:--------:|:-----:|:-----:|:-----:|
| 1 | **FOMO Guard Persona** | 8 | 7 | 8 | 7.67 | 9 (7.50) | 4 (6.67) | +1.5 | **9.02** |
| 2 | Token Analyst Skill | 7 | 8 | 7 | 7.33 | 5 (4.17) | 4 (6.67) | +1.5 | 7.82 |
| 3 | Degen Shopping Guide | 7 | 6 | 8 | 7.00 | 4 (3.33) | 3 (5.00) | +1.5 | 7.20 |
| 4 | Onchain Sleuth Skill | 9 | 7 | 6 | 7.33 | 4 (3.33) | 4 (6.67) | +1.0 | 7.07 |
| 5 | Airdrop Scout Skill | 7 | 8 | 5 | 6.67 | 2 (1.67) | 4 (6.67) | +1.0 | 5.67 |

Formula: FINAL = (Norm_Vote × 0.3) + (Wtd_Criteria × 0.6) + (Norm_YC × 0.1) + Bonuses

**Math for top 3:**

FOMO Guard: (7.50 × 0.3) + (7.67 × 0.6) + (6.67 × 0.1) + 1.5 = 2.25 + 4.60 + 0.67 + 1.5 = **9.02**
Token Analyst: (4.17 × 0.3) + (7.33 × 0.6) + (6.67 × 0.1) + 1.5 = 1.25 + 4.40 + 0.67 + 1.5 = **7.82**
Degen Shopping Guide: (3.33 × 0.3) + (7.00 × 0.6) + (5.00 × 0.1) + 1.5 = 1.00 + 4.20 + 0.50 + 1.5 = **7.20**

---

## Section 3: THE WINNER — FOMO Guard Persona

**Why this idea wins on every judging criterion:**

- **Demo (8/10):** Before/after split-screen is understood on mute in 3 seconds. Normal AI: "Buy these $300 headphones!" → FOMO Guard: "Bro, you bought AirPods 2 months ago. Here's a $150 alternative with better reviews. That $150 saved is 0.05 SOL to stack." The contrast IS the demo. Degen language is the hook. Visual spending tracker adds motion.

- **Usefulness (7/10):** Impulse buying is a universal human problem. Crypto-native users are especially susceptible — FOMO is a cultural phenomenon. "Don't let me ape" is a meme because it's TRUE. FOMO Guard is the AI agent version of that impulse. It doesn't stop you from buying — it finds SMARTER purchases on Purch using the product search API.

- **Quality (8/10):** Deepest Purch integration of any persona: user states intent → persona queries /x402/search for alternatives → queries /x402/shop for AI recommendations → presents comparison with reasoning. 5 API endpoints used organically (not bolted-on). Full Vault lifecycle. Crossmint wallet for auth. Clean architecture: intercept → analyze → recommend → decide.

**How it is unique:** Zero comparison in the Vault marketplace. All existing personas are OFFENSIVE (Degen Trader encourages risk, Content Machine encourages output). FOMO Guard is the FIRST DEFENSIVE persona — it pushes back, analyzes, and recommends smarter choices. No Vault asset serves this "rational counterweight" function.

**Who the users are:** Self-aware crypto-native users who KNOW they're impulsive. People who tweet "don't let me ape" before aping. People who bought AirPods Max at launch and regretted it. These are the Vault's existing users — crypto degens who want a smarter version of themselves. Identifiable, reachable, existing TODAY.

**Why the builder believes in it:** Impulse buying is genuinely costly. FOMO destroys portfolios and drains wallets. An AI that speaks your language but acts as your rational brain is something the builder would use personally. It makes Purch better at what Purch claims to be — a SMART shopping experience.

**The "one shocking number":** Americans spend an estimated **$5,400 per year on impulse purchases** (Slickdeals consumer survey). Crypto-native users, with their higher risk tolerance and FOMO-driven culture, likely exceed this figure significantly. FOMO Guard intercepts this behavior at the moment of decision.

**Minority dissent summary:**
- USE: "Token Analyst is more useful on a daily basis. FOMO Guard serves a narrow audience — self-aware degens." Valid, but the V3 correction says "prioritize memorability and depth over simplicity." FOMO Guard is more memorable AND has deeper Purch integration than Token Analyst.
- CRAFT: "Degen Shopping Guide has deeper integration." CRAFT self-corrected: "I was optimizing for endpoint count, not user need." FOMO Guard's integration is deep AND organic — the persona NEEDS product search to function.

---

## Section 4: Risk Register

| # | Risk | Severity | Likelihood | Impact | Mitigation | Source |
|---|------|:--------:|:----------:|--------|------------|--------|
| 1 | Purch judge perceives persona as anti-platform — scores demo 0 | CRITICAL | LOW | Demo score cratered, eliminated | Frame EXPLICITLY as "smart shopping assistant." Show persona finding BETTER deals ON Purch. Demo narrative: "helps users make better decisions" = Purch's own mission statement | Premortem |
| 2 | Demo is text-heavy — judges on X see chat log, not product | HIGH | MEDIUM | Demo (33%) drops to 5/10. Loses visual impact. | Visual split-screen design. Side-by-side product cards. Animated spending tracker. Make it VISUAL, not conversational. Budget 50% of build time for UI | Premortem |
| 3 | /x402/search returns irrelevant alternatives — persona can't find better deals | HIGH | MEDIUM | Core value proposition fails — persona says "don't buy this" but can't suggest alternatives | Pre-test 10+ product categories. Cache proven product pairs. Fallback: if no better alternative found, persona says "OK, this is actually a fair deal" | Round 2 |
| 4 | "Persona" category too simple — judges expect system prompt, get confused by full app | HIGH | LOW | Category mismatch confusion | Demo Vault lifecycle first (search → buy → install persona), THEN show persona in action. Make format clear. README explicitly explains persona type | Premortem |
| 5 | Degen language doesn't land — humor feels forced or cringe | MEDIUM | MEDIUM | Memorability advantage disappears. Persona feels like a gimmick | Script language carefully. Use REAL CT slang, not manufactured. Test with 5+ example conversations. Keep humor subtle, not overdone | Round 3 |
| 6 | USDC wallet runs dry during demo recording | HIGH | LOW | API calls fail mid-demo | Pre-fund with $5+ USDC. Cache API responses as fallback. Record demo in segments | Premortem |
| 7 | Vault asset ZIP format doesn't match Purch's expected structure | HIGH | MEDIUM | Asset can't be installed/used, demo breaks | Reverse-engineer format from existing Vault personas (Degen Trader, Content Machine, Security Sentinel) before building | Round 2 |
| 8 | Another team built a persona with similar concept | MEDIUM | LOW | Uniqueness score drops | Extremely low risk given $5K niche hackathon. Differentiate through UI polish and product API depth — no other persona will have 5 endpoints | Round 2 |

---

## Section 5: Concerns Compliance

| # | Severity | Concern | How Winner Addresses It |
|---|:---:|---------|------------------------|
| 1 | C | Time NOT a constraint | FOMO Guard is buildable in 1 day with Claude Code. Persona definition + web app + visual demo. Day 2 for polish and video. |
| 2 | C | Uniqueness is non-negotiable | Zero defensive personas in Vault. All existing personas are offensive (Degen Trader, Content Machine). First contrarian persona. |
| 3 | C | "Does this help real humans?" | Yes — impulse buying costs Americans $5,400/year. Crypto FOMO costs more. Self-aware degens are the target user. They exist in massive numbers. |
| 4 | C | Cumulative corrections | V1: ONE clean thing (✓ — single persona). V2: plain explanations (✓). V3: crypto-native audience (✓ — speaks degen language). V3: don't duplicate Purch inventory (✓ — first defensive persona). V3: expansion (✓ — bridges crypto users to smart commerce). V3: memorability over simplicity (✓ — most memorable idea). |
| 5 | C | Must solve SIGNIFICANT problem | Impulse buying is a multi-billion dollar problem. FOMO in crypto destroys portfolios. This is significant and personal. |
| 6 | C | Must serve users who exist TODAY | Self-aware crypto degens who tweet "don't let me ape." Vault users who buy Degen Trader persona. These people exist by the millions. |
| 7 | I | Everything is devnet/testnet | Uses real USDC via x402 but amounts are micro ($0.01-$0.10 per API call). Pre-funded wallet handles this. |
| 8 | I | Read ALL research data | research-brief.md, ideas.md (V3), V1 and V2 verdicts, winning-patterns.md, hackathon brief all cited. |
| 9 | I | Take your time, be extensive | 6 rounds, 8 ideas evaluated, 10 attacks, 4 self-critiques, 3 premortems, genuine debate. |
| 10 | I | Focused product, BROAD problem | Focused: one persona doing one thing (rational counterweight). Broad: impulse buying affects billions globally. FOMO affects every crypto user. |
| 11 | I | Winning AND real impact | FOMO Guard wins on memorability + integration depth AND genuinely helps users make better decisions. |
| 12 | I | Demo must feel like real product | Visual split-screen web app with product cards, spending tracker, real Purch product data. Not a CLI. Not a chat log. |
| 13 | I | AI/Agents should be considered | The persona IS an AI agent enhancement. The agent BECOMES a rational advisor. Core AI functionality. |
| 14 | I | Deep integration across full Purch API | 5 endpoints: /x402/search (alternatives), /x402/shop (AI recs), vault/search, vault/buy, vault/download. Crossmint wallet for auth. Deepest persona integration. |
| 15 | A | Fresh ideas allowed | FOMO Guard is a V3-evolved idea — V2's Anti-Impulse reframed for crypto-native audience with deeper integration. |
| 16 | A | Reframing on the table | Reframed V2's mainstream "Anti-Impulse" into crypto-native "FOMO Guard" with degen language and product API depth. |
| 17 | I | Empty Vault categories = blue ocean | FOMO Guard is a persona — the Persona category has 3 existing assets but NONE are defensive/rational. Blue ocean within the category. |
| 18 | I | Buildability and demo polish | Persona + web app is buildable in 1 day. Full Day 2 for UI polish, animations, demo video. V1/V2 corrections fully satisfied. |

---

## Section 6: Deliberation Health Report

| Metric | Result | Status |
|--------|--------|:------:|
| Argument Diversity | ~20% evidence overlap | PASS |
| Attack Depth | 9/10 attacks with specific evidence | PASS |
| Kill Honesty | 3 ideas killed (CT Alpha, Portfolio Risk, Web3 Builder Kit) | PASS |
| Self-Critique Quality | 4/4 genuine (each agent attacked own top pick) | PASS |
| Evidence Density | ~75% claims cited | PASS |
| Score Calibration | SD = 1.12 | PASS (marginal) |

| Failure Mode | Detected? |
|-------------|:---------:|
| Groupthink | NO (genuine CRAFT vs USE tension on Degen Shopping Guide, WILD dissent on Token Analyst) |
| Anchoring | NO (Round 1 proposals diverged from Round 0 — FOMO Guard rose from 6.8 avg to #1) |
| Grade Inflation | NO (mean = 7.36) |
| Hollow Debate | NO (3 kills, 1 hybrid rejected, substantive self-critiques) |
| Research Neglect | NO (all research files cited) |

**Overall: PASS**

---

## Backup Plans

### Backup 1: Token Analyst Skill (FINAL: 7.82)
**Why it lost:** Most useful idea but less memorable than FOMO Guard. Lower Purch integration depth (4-5 endpoints vs 5). V3 correction explicitly prioritized memorability over simplicity.
**When to switch:** If FOMO Guard's anti-platform perception risk materializes during build. If the persona format doesn't work with Purch's expected ZIP structure. Token Analyst is the safe fallback — high usefulness, low risk, clean build.

### Backup 2: Degen Shopping Guide Skill (FINAL: 7.20)
**Why it lost:** Deepest Purch integration but audience mismatch. CRAFT's own self-critique acknowledged: "optimizing for endpoint count, not user need." Crypto degens don't shop for headphones.
**When to switch:** If both FOMO Guard and Token Analyst fail. If Grand Prize ($1,500) becomes the sole target and deep product API usage is the only path. Use crypto-adjacent products (hardware wallets, gaming gear) to bridge the audience gap.
