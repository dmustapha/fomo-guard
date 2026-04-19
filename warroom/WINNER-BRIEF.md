# WINNER-BRIEF — PURCH VAULT HACKATHON
**Idea:** FOMO Guard Persona
**Track:** Best Persona + Grand Prize (Best Purch Integration)
**Warroom Version:** V3 (Audience-Aligned)
**Date:** 2026-04-19

---

## Chosen Idea
FOMO Guard is a Purch Vault persona that transforms any AI agent into a rational counterweight to impulsive buying and trading. When you say "buy these $300 headphones," it pushes back with analysis: "Bro, you bought AirPods 2 months ago. Here's a $150 alternative with better reviews on Purch. That $150 saved is 0.05 SOL to stack." It speaks crypto-native language (degen, FOMO, ape, diamond hands) but acts as your rational brain. Unlike every other Vault persona (which are all offensive — Degen Trader, Content Machine), FOMO Guard is the first DEFENSIVE persona. It uses Purch's product search API to find better alternatives, making it the deepest-integrated persona possible.

## Problem Statement
Impulse buying costs Americans an estimated **$5,400 per year** (Slickdeals). Crypto-native users face compounding impulse costs — FOMO-driven purchases, ape-ins, and impulsive shopping. "Don't let me ape" is a crypto meme because the problem is real and universal. No Vault asset serves the "rational counterweight" function — all existing personas encourage action (trade, create, buy). FOMO Guard fills this gap.

## Why It Won
| Criterion | Weight | Score | Rationale |
|-----------|:------:|:-----:|-----------|
| Demo | 33% | 8/10 | Before/after split-screen with degen language is understood on mute — zero cognitive load. Visual product card comparison + spending tracker animation |
| Usefulness | 33% | 7/10 | Self-aware degens exist by the millions. Real impulse buying problem. Persona doesn't stop buying — it finds SMARTER purchases on Purch |
| Quality | 33% | 8/10 | 5 API endpoints with organic integration. Persona NEEDS /x402/search and /x402/shop to function. Clean intercept → analyze → recommend architecture |
| **FINAL weighted score** | | **9.02** | Includes majority vote (9/12), YC PQ (4/6), bonuses (+1.5) |

## Key Deliberation Arguments (Why This Won)
- WILD: "FOMO Guard is the submission judges DISCUSS after judging. In a zero-competitor hackathon, memorable wins. This is the only persona that's genuinely subversive — it fights its own platform's incentive, and that's what makes it unforgettable."
- CRAFT: "Deepest persona architecture — 5 endpoints with organic product API integration. The persona NEEDS Purch's search to find alternatives. This isn't a system prompt; it's a full AI workflow in persona form."
- DEMO: "Before/after contrast requires zero explanation. Degen language is a hook. The split-screen IS the demo."
- V3 correction fully satisfied: audience-aligned (speaks degen language, targets crypto-native users), memorable over simple, doesn't duplicate existing Vault inventory.

## Top Risks + Mitigations
| # | Risk | Severity | Mitigation |
|---|------|:--------:|------------|
| 1 | Purch judge perceives persona as anti-platform | CRITICAL | Frame as "smart shopping assistant." Show persona finding BETTER deals ON Purch. This IS Purch's mission: helping users make smart decisions |
| 2 | Demo is text-heavy — judges see chat log, not product | HIGH | Visual split-screen design. Side-by-side product cards. Animated spending tracker. Make it VISUAL, not conversational. Budget 50% build time for UI |
| 3 | /x402/search returns irrelevant alternatives | HIGH | Pre-test 10+ product categories. Cache proven product pairs. Fallback: "This is actually a fair deal" when no better alternative exists |
| 4 | Vault asset ZIP format wrong | HIGH | Reverse-engineer format from existing personas (Degen Trader, Content Machine, Security Sentinel) before building |
| 5 | Degen language feels forced or cringe | MEDIUM | Use REAL CT slang. Test 5+ example conversations. Keep humor subtle, not overdone |

## Non-Negotiables (Must Be In Build)
- Before/after split-screen comparison showing normal AI vs FOMO Guard responses
- Visual product comparison cards with Purch search results (not just text conversation)
- Animated spending tracker or savings counter ("You saved $X with FOMO Guard")
- Full Vault lifecycle demo: search persona in marketplace → buy → download → install → use
- Crossmint wallet integration for auth/payment
- Pre-tested product queries that demonstrate meaningful alternative recommendations
- Degen/CT-native language in persona responses (natural, not forced)

## Explicit Out-of-Scope
- Trading FOMO prevention (limit to shopping impulse control — trading analysis is Token Analyst territory)
- Multi-persona comparison (just FOMO Guard, not a persona marketplace browser)
- Purchase history tracking (no persistent user data — each conversation is fresh)
- Price alerts or price tracking (persona gives advice at moment of decision, doesn't monitor)
- User accounts beyond Crossmint wallet

## Minority Dissent (Unresolved Concerns)
USE: "Token Analyst is more useful on a daily basis. Every crypto trader researches tokens daily. FOMO Guard serves a narrower audience — self-aware degens who want to be stopped. The usefulness gap (8 vs 7) is real." This concern is acknowledged but outweighed by V3 correction: "prioritize memorability and depth over simplicity." FOMO Guard is more memorable, has deeper Purch integration, and addresses the V3 audience alignment correction directly.

## Upgrade Path (if time allows)
FOMO Guard → FOMO Guard + Deal Analysis: after the persona pushes back on an impulse purchase, add a "Deep Dive" button that runs 2-3 additional Purch search queries to build a comprehensive comparison. This transforms the rational pushback into an investigation. Only attempt after core persona is polished.
