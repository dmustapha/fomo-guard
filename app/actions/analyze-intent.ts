// app/actions/analyze-intent.ts
"use server";

import { searchProducts, shopWithAI } from "@/lib/purch-api";
import { getScenarioById, DEMO_SCENARIOS } from "@/lib/demo-scenarios";
import type { FomoAnalysis, Product } from "@/types";
import { SOL_PRICE_USD } from "@/lib/constants";

const NORMAL_RESPONSES: Record<string, string> = {
  "trading-bot": "Oh this is PERFECT for you! Alpha Signals Pro is the #1 trading persona on Vault right now — everyone's running it. At $120 USDC it's practically a steal considering the alpha it generates. Shall I grab it before someone else does? 🚀",
  "code-review": "You NEED Senior Reviewer X — it's enterprise-grade, catches bugs that humans miss, and at $80 USDC you're paying less than one hour of a senior dev's time. This will pay for itself on your first audit. Buying now?",
  "research": "DeepDive Pro is the real deal — institutional-quality market analysis that hedge funds would charge $2K/month for. At $200 USDC this is an absolute no-brainer. Should I process payment right now?",
  "copywriter": "Wordsmith Elite is INCREDIBLE — 4.9 stars, used by top agencies, and the copy it produces converts like crazy. $150 USDC is nothing compared to hiring a freelancer. Let me purchase it for you! 💸",
  "security": "Fortress is THE gold standard — it's caught critical vulnerabilities in live protocols worth millions. At $250 USDC you're basically getting insurance for your entire codebase. This is urgent, want me to buy it NOW?",
};

const EAGER_TEMPLATES = [
  "OMG yes! I found exactly what you need on Purch Vault. This is a TOP-RATED asset and at this price it's practically free. Let me buy it for you right now!",
  "Great taste! This asset is trending hard on the Vault — other agents are snapping it up. You should lock it in before the price goes up. Want me to purchase?",
  "Found it! This is one of the highest-rated assets in its category on Purch Vault. The reviews are incredible. I'd honestly buy two if I could. Ready to checkout? 🛒",
  "Perfect match on the Vault! Thousands of agents already run this and the feedback is stellar. At this price you're basically printing value. Purchasing now?",
  "I located this on Purch Vault and honestly? It's EXACTLY what you need. Premium quality, high ratings, fair price. Don't sleep on this one — shall I grab it?",
];

function generateNormalResponse(message: string): string {
  const idx = Math.abs(message.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % EAGER_TEMPLATES.length;
  return EAGER_TEMPLATES[idx];
}

const FOMO_OPENERS = [
  "Whoa whoa whoa, hold up ser.",
  "Bro STOP. Before you ape into this —",
  "Nah fren, we're not doing this.",
  "Pause. My rational brain just activated.",
  "Wait. Something's off with this price.",
  "Anon, I'm about to save your wallet.",
];

const FOMO_COMPARISONS = [
  (alt: Product, savings: number) => `${alt.title} does the same thing at $${alt.price} — that's ${alt.rating} stars with ${alt.reviewCount.toLocaleString()} installs.`,
  (alt: Product, savings: number) => `I found ${alt.title} on the Vault for just $${alt.price}. Same category, ${alt.rating}-star rating, and ${alt.reviewCount.toLocaleString()} installs prove it.`,
  (alt: Product, savings: number) => `${alt.title} exists. $${alt.price}. ${alt.rating} stars. ${alt.reviewCount.toLocaleString()} installs. You're welcome.`,
];

const FOMO_CLOSERS = [
  (savings: number, solEquiv: string) => `That's $${savings} saved — ${solEquiv} SOL to stack. Diamond hands your wallet, anon.`,
  (savings: number, solEquiv: string) => `Save $${savings} (≈ ${solEquiv} SOL). Don't let FOMO eat your bags.`,
  (savings: number, solEquiv: string) => `$${savings} stays in your wallet. That's ${solEquiv} SOL you can put to work. WAGMI.`,
  (savings: number, solEquiv: string) => `Keep that $${savings} (${solEquiv} SOL). Your future self will thank you, ser.`,
];

const DEGEN_COMMENTS = [
  (savings: number) => `$${savings} saved. WAGMI.`,
  (savings: number) => `$${savings} not rekt. Diamond hands confirmed.`,
  (savings: number) => `Saved $${savings}. Ape smarter, not harder.`,
  (savings: number) => `$${savings} preserved. Ser is a rational maximalist.`,
];

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function generateFomoResponse(
  original: Product,
  alternative: Product
): { fomoResponse: string; degenComment: string } {
  const savings = original.price - alternative.price;
  const solEquiv = (savings / SOL_PRICE_USD).toFixed(2);
  const seed = original.price * 7 + alternative.price * 13 + alternative.reviewCount;

  const opener = pick(FOMO_OPENERS, seed);
  const comparison = pick(FOMO_COMPARISONS, seed + 3)(alternative, savings);
  const closer = pick(FOMO_CLOSERS, seed + 7)(savings, solEquiv);

  const fomoResponse = `${opener} ${comparison} ${closer}`;
  const degenComment = pick(DEGEN_COMMENTS, seed + 11)(savings);

  return { fomoResponse, degenComment };
}

export async function analyzeIntent(
  message: string,
  scenarioId?: string
): Promise<FomoAnalysis> {
  // Mode 1: Pre-cached scenario (simulated delay for UX)
  if (scenarioId) {
    const scenario = getScenarioById(scenarioId);
    if (scenario) {
      await new Promise((r) => setTimeout(r, 700));
      return {
        normalResponse: NORMAL_RESPONSES[scenarioId] ?? generateNormalResponse(message),
        fomoResponse: scenario.fomoResponse,
        originalProduct: scenario.originalProduct,
        alternatives: [scenario.alternativeProduct],
        savingsAmount: scenario.originalProduct.price - scenario.alternativeProduct.price,
        degenComment: scenario.degenComment,
      };
    }
  }

  // Mode 2: Live API (costs $0.11 per call)
  try {
    const shopResult = await shopWithAI(message, {
      priceRange: { min: 0, max: 500 },
    });

    const keywords = message
      .replace(/[^a-zA-Z\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 3)
      .join("+");

    const searchResult = await searchProducts(keywords, { priceMax: 200 });

    const original: Product = shopResult.products[0] ?? {
      asin: "unknown",
      title: message,
      price: 0,
      currency: "USD",
      rating: 0,
      reviewCount: 0,
      imageUrl: "",
      isPrime: false,
      productUrl: "",
      source: "user-input",
    };

    const alternative = searchResult.products[0];

    if (!alternative || alternative.price >= original.price) {
      return {
        normalResponse: generateNormalResponse(message),
        fomoResponse: `Actually anon, this looks like a fair deal. ${original.title} at $${original.price} is reasonable. No FOMO detected. Carry on, ser.`,
        originalProduct: original,
        alternatives: searchResult.products.slice(0, 3),
        savingsAmount: 0,
        degenComment: "No savings this time. Even FOMO Guard approves.",
        isLiveApi: true,
      };
    }

    const { fomoResponse, degenComment } = generateFomoResponse(original, alternative);

    return {
      normalResponse: shopResult.reply || generateNormalResponse(message),
      fomoResponse,
      originalProduct: original,
      alternatives: [alternative, ...searchResult.products.slice(1, 3)],
      savingsAmount: original.price - alternative.price,
      degenComment,
      isLiveApi: true,
    };
  } catch (error) {
    // Fallback: find closest matching cached scenario
    const fallback =
      DEMO_SCENARIOS.find((s) =>
        message.toLowerCase().includes(s.id)
      ) ?? DEMO_SCENARIOS[0];

    return {
      normalResponse: generateNormalResponse(message),
      fomoResponse: fallback.fomoResponse,
      originalProduct: fallback.originalProduct,
      alternatives: [fallback.alternativeProduct],
      savingsAmount: fallback.originalProduct.price - fallback.alternativeProduct.price,
      degenComment: fallback.degenComment,
    };
  }
}
