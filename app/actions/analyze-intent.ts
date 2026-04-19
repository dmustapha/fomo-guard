// app/actions/analyze-intent.ts
"use server";

import { searchProducts, shopWithAI } from "@/lib/purch-api";
import { getScenarioById, DEMO_SCENARIOS } from "@/lib/demo-scenarios";
import type { FomoAnalysis, Product } from "@/types";

const NORMAL_RESPONSES: Record<string, string> = {
  headphones: "Great choice! The Sony WH-1000XM5 is one of the best noise-cancelling headphones. Here's the link to buy them.",
  keyboard: "Nice pick! The Razer Huntsman V2 is a top-tier gaming keyboard. Ready to add to cart?",
  shoes: "The Nike Pegasus 41 is a solid running shoe. Want me to order them for you?",
  monitor: "The LG 27UP850-W is excellent for coding. Should I proceed with the purchase?",
  webcam: "The Logitech Brio is a great webcam! Want me to get it for you?",
};

function generateNormalResponse(message: string): string {
  return `Sure! That sounds great. I found what you're looking for. Want me to go ahead and purchase it for you? Here's the buy link.`;
}

function generateFomoResponse(
  original: Product,
  alternative: Product
): { fomoResponse: string; degenComment: string } {
  const savings = original.price - alternative.price;
  const solEquiv = (savings / 300).toFixed(2);

  const fomoResponse = `Bro hold up. The ${alternative.title} is $${alternative.price} with ${alternative.rating} stars on Purch. That's $${savings} saved = ${solEquiv} SOL to stack. Diamond hands your wallet, anon.`;
  const degenComment = `$${savings} saved. WAGMI.`;

  return { fomoResponse, degenComment };
}

export async function analyzeIntent(
  message: string,
  scenarioId?: string
): Promise<FomoAnalysis> {
  // Mode 1: Pre-cached scenario (instant, reliable)
  if (scenarioId) {
    const scenario = getScenarioById(scenarioId);
    if (scenario) {
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
