// components/value-preview.tsx
"use client";

import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function ValuePreview() {
  return (
    <section className="py-16 md:py-20 px-5">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <motion.div
          className="fg-card text-center p-6"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <p className="text-sm font-light mb-2 text-fg-text-secondary">
            Agent without persona
          </p>
          <p className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-fg-danger">
            $800
          </p>
          <p className="text-xs font-light mt-1 text-fg-text-muted">
            Total Vault spend
          </p>
        </motion.div>

        {/* Arrow — desktop only */}
        <div className="hidden md:flex items-center justify-center">
          <svg width="40" height="24" viewBox="0 0 40 24" fill="none" aria-hidden="true">
            <path
              d="M2 12h36M30 4l8 8-8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-fg-accent"
            />
          </svg>
        </div>

        <motion.div
          className="fg-card text-center p-6"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <p className="text-sm font-light mb-2 text-fg-text-secondary">
            Agent with FOMO Guard
          </p>
          <p className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-fg-accent">
            $220
          </p>
          <p className="text-xs font-light mt-1 text-fg-text-muted">
            Smart Vault spend
          </p>
        </motion.div>

        {/* Full-width save card */}
        <motion.div
          className="md:col-span-3 fg-card text-center p-6 border-2 border-fg-accent"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <p className="text-sm font-light mb-2 text-fg-text-secondary">
            You Save
          </p>
          <motion.p
            className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-fg-accent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.3 }}
          >
            $580
          </motion.p>
          <p className="text-xs font-light mt-1 text-fg-text-muted">
            Across all 5 demo scenarios
          </p>
        </motion.div>
      </div>
    </section>
  );
}
