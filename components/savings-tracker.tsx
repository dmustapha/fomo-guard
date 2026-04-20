// components/savings-tracker.tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import type { SavingsTrackerProps } from "@/types";
import { SOL_PRICE_USD } from "@/lib/constants";

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 50, damping: 15 });
  const display = useTransform(spring, (v) =>
    `$${Math.round(v).toLocaleString()}`
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function SavingsTracker({
  totalSaved,
  solPrice = SOL_PRICE_USD,
}: SavingsTrackerProps) {
  const solEquiv = (totalSaved / solPrice).toFixed(2);
  const prevTotal = useRef(0);
  const justUpdated = totalSaved > prevTotal.current;

  useEffect(() => {
    prevTotal.current = totalSaved;
  }, [totalSaved]);

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      animate={justUpdated ? { scale: [1, 1.015, 1] } : {}}
      transition={{ duration: 0.4 }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fg-accent/20 via-transparent to-fg-accent/10 p-px">
        <div className="w-full h-full rounded-2xl bg-fg-raised" />
      </div>

      <div className="relative p-8 text-center" role="status" aria-live="polite">
        <p className="text-fg-text-secondary text-sm font-medium mb-2">
          Savings demonstrated in demo
        </p>
        <div className="text-5xl font-bold font-[family-name:var(--font-space-grotesk)] text-fg-accent mb-3">
          <AnimatedNumber value={totalSaved} />
        </div>
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="text-fg-text-muted">
            ≈ {solEquiv} SOL at ${solPrice}/SOL
          </span>
          <span className="w-1 h-1 rounded-full bg-fg-border" />
          <span className="text-fg-accent/70 font-medium">
            {seenCount(totalSaved)} impulse buys intercepted by persona
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function seenCount(total: number): number {
  // Rough estimate based on average savings per scenario (~$150)
  return Math.max(1, Math.round(total / 150));
}
