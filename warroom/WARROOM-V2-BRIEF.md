# WAR ROOM V2 — PURCH VAULT HACKATHON DELIBERATION BRIEF
**Date:** 2026-04-18
**Objective:** Pick THE ONE idea that is BOTH the most winnable AND solves a significant real problem.
**Version:** V2 (Clean Slate — no GitHub repo influence)

---

## NON-NEGOTIABLE RULES (from the builder)

### CRITICAL CONCERNS (Must satisfy — idea eliminated if violated)
1. [C] Time NOT a constraint — Claude Code = 10x dev speed
2. [C] Uniqueness is non-negotiable — zero competitors preferred
3. [C] "Does this help real humans?" test — must point to real people
4. [C] Cumulative corrections (nothing dropped)
5. [C] Must solve a SIGNIFICANT, real problem — "Would I build this without a prize?"
6. [C] Must serve actual target users who exist TODAY

### IMPORTANT CONCERNS (Should satisfy — score penalty if violated)
7. [I] Everything is devnet/testnet — mocks fine
8. [I] Read ALL research data
9. [I] Take your time, be extensive
10. [I] Focused product, BROAD problem
11. [I] Winning AND real impact not mutually exclusive
12. [I] Demo must feel like the real product
13. [I] AI/Agents should be considered
14. [I] Deep integration across full Purch API wins

### ADVISORY CONCERNS
15. [A] Fresh ideas allowed
16. [A] Reframing on the table

### PER-HACKATHON CONCERNS
17. [I] Empty Vault categories (Development, Career, iOS, Productivity) = blue ocean priority
18. [I] Evaluate ideas on buildability and demo polish, not formula optimization

### V2 CORRECTIONS (from V1 learnings)
- V2: Clean slate — no GitHub repo influence. Brand new ideas only.
- V2: Builder doesn't fully understand Vault yet — ideas must be explained plainly.
- V1 concern: VaultForge was "optimized for warroom formula, not reality" — V2 must prioritize buildability and demo polish over formula score.
- V1 concern: Split focus across 2 features in 2 days = neither is polished. V2 should favor ONE clean thing over TWO half-finished things.

---

## HACKATHON FACTS
- Hackathon: Purch Vault Hackathon
- Deadline: April 20, 2026 (2 days remaining)
- Prize: $5,000 USDC + $PURCH tokens
- Tracks: Best Skill ($700/$300/$100), Best Knowledge Pack ($700/$300/$100), Best Persona ($700/$300/$100), Grand Prize ($1,500 + $PURCH)
- Platform: Purch — AI shopping concierge on Solana
- Zero competitors found. First-edition hackathon.

## JUDGING CRITERIA (equal weight ~33% each)
- **Demo (33%):** Video on X tagging @trypurch. Visual impact, compelling narrative.
- **Usefulness (33%):** Solves real problems with practical applications.
- **Quality (33%):** Clean code, documentation, ease of setup.

## CONFIRMED JUDGES
- @pixelarthur (Purch co-founder) — wants deep Purch integration, novel Vault use cases
- @ththomas_ (Purch co-founder) — wants product quality, real-world usefulness
- @fedesarquis (Crossmint DevRel) — wants Crossmint wallet usage, good DX
- @henloitsjoyce (Crossmint DevRel) — interested in agentic finance, consumer products

50% of judges are Crossmint — wallet/payment UX matters to half the jury.

## THE BUILDER
- Solo developer, 2 days remaining
- Uses Claude Code (10x speed)
- Does NOT fully understand Vault product internals yet — needs plain explanations
- Previous hackathon experience with agent-auditor pattern
- V1 lesson: ONE polished thing beats TWO half-finished things

---

## PURCH VAULT — PLAIN ENGLISH
A Vault asset is a ZIP file sold on Purch's marketplace. Three types:
- **Skill** = a command the AI can run ("compare X vs Y", "review <code>")
- **Knowledge Pack** = a reference guide that makes the AI smarter about a topic
- **Persona** = a personality template that changes how the AI talks

The deliverable: create ONE asset + build a demo web app showing the full Vault lifecycle (search → buy → download → use).

## PURCH API ENDPOINTS
| Endpoint | Method | Cost | Purpose |
|----------|--------|------|---------|
| /x402/search | GET | $0.01 | Product search (1B+ items) |
| /x402/shop | POST | $0.10 | AI natural language search |
| /x402/buy | POST | Price | One-command checkout |
| /x402/vault/search | GET | $0.01 | Search vault assets |
| /x402/vault/buy | POST | Price | Purchase vault asset |
| /x402/vault/download/:id | GET | $0.01 | Download ZIP |

## EXISTING VAULT (10 assets, ALL by Purch, ALL crypto/trading)
- Lightning Quick Buy, Auto Thread Writer, Instant Rug Check (Skills)
- Memecoin Playbook, Rug Check Master, Content Creator Bible, Faith (Knowledge)
- Content Machine, Degen Trader, Security Sentinel (Personas)
- ALL $1, ALL crypto-focused. Zero community content. Empty categories: Development, Career, iOS, Productivity.

---

## V1 RESULTS
**Previous winner:** VaultForge (9.38) — create + audit vault assets
**Why V2 exists:** VaultForge was "optimized for the formula, not reality." Split focus (create AND audit) in 2 days = neither polished. V2 must find ONE clean thing.
**V1 top ideas:** VaultForge (9.38), VaultGuard (7.35), SkillForge Pro (7.13), VaultScout (5.20)

---

## IDEAS TO EVALUATE (8 from Phase 0.5)

1. **Deal Finder Skill** (19/25) — "deal headphones under $100" → finds best deals via Purch search, recommends buy/wait
2. **Purch Power User Knowledge Pack** (20/25) — teaches AI to use Purch like a pro. Self-referential.
3. **Code Review Skill** (19/25) — paste code → bug/security report. Development category = empty.
4. **Anti-Impulse Persona** (19/25) — pushes back on impulse purchases. Contrarian, memorable.
5. **Smart Shopper Toolkit Skill** (19/25) — methodical shopping: search → evaluate → recommend
6. **Shop & Compare Skill** (19/25) — "compare X vs Y" → side-by-side with winner declaration
7. **Career Coach Persona** (15/25) — warm career mentor. Career category = empty.
8. **Price Detective Skill** (19/25) — "is this deal good?" → investigation report with verdict

Agents can propose NEW ideas beyond this list.

---

## AGENT ROLES

### DEMO — The Demo Whisperer
- **Lens:** "Will this blow judges away in a 60-second X video?"
- **Evaluates:** Visual impact, narrative arc, wow moment, X engagement potential
- **Attacks:** Boring demos, invisible value, too much explanation needed
- **Criteria alignment:** Demo (33%)
- **Known Bias:** Overvalues spectacle, may undervalue substance

### USE — The Real-World Advocate
- **Lens:** "Would real humans actually use this?"
- **Evaluates:** Problem significance, target user existence, day-1 utility
- **Attacks:** Solutions looking for problems, hypothetical users, tech for tech's sake
- **Criteria alignment:** Usefulness (33%)
- **Known Bias:** May dismiss novel ideas that create new categories

### CRAFT — The Code Craftsman
- **Lens:** "Is this technically sound and buildable in 2 days?"
- **Evaluates:** Architecture, API integration depth, code quality, buildability
- **Attacks:** Vaporware, shallow integration, scope creep, impossible timelines
- **Criteria alignment:** Quality (33%)
- **Known Bias:** May overvalue engineering elegance over user impact

### WILD — The Contrarian
- **Lens:** "What makes judges go 'wow, I haven't seen that before'?"
- **Evaluates:** Innovation, uniqueness, memorability, surprise factor
- **Attacks:** Predictable ideas, copycat projects, playing it safe
- **Criteria alignment:** Innovation, Uniqueness
- **Known Bias:** May overvalue novelty over execution

---

## SCORING CRITERIA
Each idea scored 1-10 on:
- Demo (33%): Visual impact, narrative, wow moment
- Usefulness (33%): Real problem, real users, practical value
- Quality (33%): Code quality, API integration depth, buildability
- YC Problem Quality (+0 to +6): How big, urgent, underserved is the problem?
- BONUS: Competition check (+0 to +1)
- BONUS: Demo-product gap (+0 to +1)

FINAL = (Norm_Vote × 0.3) + (Wtd_Criteria × 0.6) + (Norm_YC × 0.1) + Bonuses
