// components/x402-indicator.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface X402IndicatorProps {
  triggerCount: number;
  variant?: "live" | "demo";
}

export function X402Indicator({ triggerCount, variant = "live" }: X402IndicatorProps) {
  const [visible, setVisible] = useState(false);
  const lastCount = useRef(0);

  useEffect(() => {
    if (triggerCount > lastCount.current) {
      lastCount.current = triggerCount;
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [triggerCount]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-fg-raised border border-fg-accent/30 shadow-lg shadow-fg-accent/10"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-fg-accent"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1, repeat: 2, ease: "easeInOut" }}
            />
            <span className="text-xs font-mono text-fg-accent font-semibold">
              x402
            </span>
          </div>
          <div className="h-4 w-px bg-fg-border-subtle" />
          <p className="text-xs text-fg-text-secondary">
            {variant === "live" ? (
              <>
                <span className="text-fg-text font-medium">$0.11 USDC</span> paid
                for this analysis
              </>
            ) : (
              <>
                x402 — cached scenario{" "}
                <span className="text-fg-text-muted">(live calls cost $0.11)</span>
              </>
            )}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
