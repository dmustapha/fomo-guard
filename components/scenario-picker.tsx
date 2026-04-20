// components/scenario-picker.tsx
"use client";

import { motion } from "framer-motion";
import type { ScenarioPickerProps } from "@/types";

const EMOJI_MAP: Record<string, string> = {
  "trading-bot": "🤖",
  "code-review": "🔍",
  "research": "📚",
  "copywriter": "✍️",
  "security": "🛡️",
};

const PRICE_MAP: Record<string, { from: number; to: number }> = {
  "trading-bot": { from: 120, to: 35 },
  "code-review": { from: 80, to: 20 },
  "research": { from: 200, to: 55 },
  "copywriter": { from: 150, to: 40 },
  "security": { from: 250, to: 70 },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export function ScenarioPicker({
  scenarios,
  onSelect,
  activeId,
  disabled,
}: ScenarioPickerProps) {
  return (
    <section id="scenarios" className="py-16 md:py-20 px-5 scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-center mb-8 text-fg-text">
          Test the persona on a Vault purchase
        </h2>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {scenarios.map((scenario, i) => {
            const isActive = activeId === scenario.id;
            const emoji = EMOJI_MAP[scenario.id] ?? "📦";
            const price = PRICE_MAP[scenario.id];
            const name = scenario.id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
            // Last item spans 2 cols on mobile
            const mobileSpan = i === scenarios.length - 1 ? "col-span-2 md:col-span-1" : "";

            return (
              <motion.button
                key={scenario.id}
                onClick={() => onSelect(scenario)}
                disabled={disabled}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`fg-card text-left p-4 rounded-xl cursor-pointer transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${mobileSpan} ${
                  isActive
                    ? "border-fg-accent fg-glow-accent"
                    : "hover:border-fg-border"
                }`}
              >
                <span className="text-2xl">{emoji}</span>
                <p className="text-xs font-semibold mt-2 text-fg-text">{name}</p>
                {price && (
                  <p className="font-[family-name:var(--font-space-grotesk)] text-xs mt-1">
                    <span className="text-fg-danger line-through">${price.from}</span>{" "}
                    <span className="text-fg-accent font-bold">${price.to}</span>
                  </p>
                )}
              </motion.button>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
