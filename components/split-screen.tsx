// components/split-screen.tsx
"use client";

import { motion } from "framer-motion";
import { ChatPanel } from "./chat-panel";
import { ProductCard } from "./product-card";
import type { FomoAnalysis } from "@/types";

interface SplitScreenProps {
  userMessage: string;
  analysis: FomoAnalysis | null;
  isLoading: boolean;
}

export function SplitScreen({
  userMessage,
  analysis,
  isLoading,
}: SplitScreenProps) {
  return (
    <div className="space-y-0">
      {/* Chat comparison — full-width divider layout */}
      <div className="bg-fg-raised border-t border-b border-fg-border-subtle">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-fg-border-subtle">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <ChatPanel
              variant="normal"
              userMessage={userMessage}
              response={analysis?.normalResponse ?? ""}
              isLoading={isLoading}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          >
            <ChatPanel
              variant="fomo"
              userMessage={userMessage}
              response={analysis?.fomoResponse ?? ""}
              isLoading={isLoading}
            />
          </motion.div>
        </div>
      </div>

      {/* Product comparison — inside single card with vertical divider */}
      {analysis && analysis.savingsAmount > 0 && analysis.alternatives.length > 0 && (
        <div className="py-16 md:py-20 px-5">
          <div className="max-w-4xl mx-auto">
            <div className="fg-card overflow-hidden grid md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-fg-border-subtle">
              <div className="md:col-span-5 p-6 relative">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-fg-danger" />
                <ProductCard product={analysis.originalProduct} variant="original" />
              </div>
              <div className="md:col-span-7 p-6 relative">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-fg-accent" />
                <ProductCard
                  product={analysis.alternatives[0]}
                  variant="alternative"
                  savingsDelta={analysis.savingsAmount}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
