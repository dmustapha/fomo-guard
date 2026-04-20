// components/hero-shield.tsx
"use client";

import { motion } from "framer-motion";

export function HeroShield() {
  return (
    <section className="py-20 md:py-28 px-5">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold leading-[1.1] tracking-tight mb-6 text-fg-text fg-hero-headline">
            Give your agent
            <br />
            <span className="fg-gradient-text">a rational brain.</span>
          </h1>
          <p className="text-sm sm:text-[15px] leading-[1.7] max-w-md mb-8 font-light text-fg-text-secondary">
            The first defensive persona for Purch Vault. FOMO Guard intercepts
            overpriced skills, personas, and knowledge packs — finding smarter
            alternatives before your agent overspends.
          </p>
          <a
            href="#scenarios"
            className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full w-fit bg-fg-accent text-fg-base transition-colors duration-200 hover:bg-fg-accent-dim"
          >
            Try the Demo
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>

        {/* Right: Shield */}
        <motion.div
          className="flex justify-center items-center relative"
          aria-hidden="true"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Radial glow */}
          <div
            className="absolute w-64 h-64 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,232,120,0.12), transparent 70%)",
            }}
          />
          {/* Pulse rings */}
          <div className="relative flex items-center justify-center">
            <span className="fg-pulse-ring" />
            <span className="fg-pulse-ring" style={{ animationDelay: "0.8s" }} />
            <span className="fg-pulse-ring" style={{ animationDelay: "1.6s" }} />
            {/* Shield SVG */}
            <svg
              width="120"
              height="140"
              viewBox="0 0 32 36"
              fill="none"
              className="relative z-10 fg-shield-glow"
            >
              <path
                d="M16 2L3 8.5v8.5c0 8 5.5 15.4 13 17 7.5-1.6 13-9 13-17V8.5L16 2z"
                fill="rgba(0, 232, 120, 0.12)"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-fg-accent"
              />
              <path
                d="M12 18l3 3 5-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-fg-accent"
              />
            </svg>
          </div>
          {/* IMPULSE / RATIONAL labels */}
          <span
            className="absolute left-0 top-1/2 text-xs font-bold uppercase tracking-wider text-fg-danger hidden md:block"
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg) translateY(50%)" }}
          >
            Impulse
          </span>
          <span
            className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wider text-fg-accent hidden md:block"
            style={{ writingMode: "vertical-lr" }}
          >
            Rational
          </span>
        </motion.div>
      </div>
    </section>
  );
}
