// app/page.tsx
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroShield } from "@/components/hero-shield";
import { ValuePreview } from "@/components/value-preview";
import { SplitScreen } from "@/components/split-screen";
import { SavingsTracker } from "@/components/savings-tracker";
import { ScenarioPicker } from "@/components/scenario-picker";
import { VaultLifecycle } from "@/components/vault-lifecycle";
import { WalletButton } from "@/components/wallet-button";
import { X402Indicator } from "@/components/x402-indicator";
import { UnderTheHood } from "@/components/under-the-hood";
import { useWallet, useCrossmintAuth } from "@crossmint/client-sdk-react-ui";
import { analyzeIntent } from "@/app/actions/analyze-intent";
import { DEMO_SCENARIOS } from "@/lib/demo-scenarios";
import type { FomoAnalysis, DemoScenario } from "@/types";

// Synchronous check — matches Providers logic exactly (no timing mismatch)
const HAS_CROSSMINT = !!process.env.NEXT_PUBLIC_CROSSMINT_API_KEY
  && !process.env.NEXT_PUBLIC_CROSSMINT_API_KEY.includes("your_");

function CrossmintData({ onData }: { onData: (addr: string | null, email: string | null) => void }) {
  const { wallet, status } = useWallet();
  const { user } = useCrossmintAuth();
  const addr = status === "loaded" && wallet ? wallet.address : null;
  const email = user?.email ?? null;

  useEffect(() => {
    onData(addr, email);
  }, [addr, email, onData]);

  return null;
}

export default function HomePage() {
  const [userMessage, setUserMessage] = useState("");
  const [analysis, setAnalysis] = useState<FomoAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalSaved, setTotalSaved] = useState(0);
  const seenRef = useRef<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");
  const [x402Count, setX402Count] = useState(0);
  const [x402Variant, setX402Variant] = useState<"live" | "demo">("demo");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const handleCrossmintData = useCallback((addr: string | null, email: string | null) => {
    setWalletAddress(addr);
    setUserEmail(email);
  }, []);

  const runAnalysis = useCallback(
    async (message: string, scenarioId?: string) => {
      setIsLoading(true);
      setError(null);
      setUserMessage(message);
      setActiveScenarioId(scenarioId ?? null);

      try {
        const result = await analyzeIntent(message, scenarioId);
        setAnalysis(result);
        setX402Variant(result.isLiveApi ? "live" : "demo");
        setX402Count((c) => c + 1);
        const key = scenarioId ?? message;
        if (result.savingsAmount > 0 && !seenRef.current.has(key)) {
          seenRef.current.add(key);
          setTotalSaved((prev) => prev + result.savingsAmount);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Try a scenario button instead."
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  function handleScenarioSelect(scenario: DemoScenario) {
    runAnalysis(scenario.userMessage, scenario.id);
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customInput.trim()) return;
    runAnalysis(customInput.trim());
    setCustomInput("");
  }

  return (
    <div className="relative z-10 min-h-[100dvh]">
      {HAS_CROSSMINT && <CrossmintData onData={handleCrossmintData} />}

      {/* Header — glass nav */}
      <motion.header
        className="border-b border-fg-border-subtle/50 backdrop-blur-xl bg-fg-base/70 fixed top-0 left-0 right-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 h-14" aria-label="Main">
          <div className="flex items-center gap-2.5">
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              className="text-fg-accent"
              aria-hidden="true"
            >
              <path
                d="M16 2L4 8v8c0 7.7 5.1 14.5 12 16 6.9-1.5 12-8.3 12-16V8L16 2z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M12 16l3 3 5-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm text-fg-text tracking-tight">
              FOMO Guard
            </span>
          </div>
          <p className="hidden md:block text-xs text-fg-text-secondary">
            Defensive AI persona for Purch Vault
          </p>
          <WalletButton />
        </nav>
      </motion.header>

      <main className="relative z-10 pt-14">
        {/* Hero — editorial generous spacing */}
        <HeroShield />

        {/* Gradient divider */}
        <div className="fg-gradient-divider max-w-4xl mx-auto" />

        {/* Problem → Solution hook — centered text */}
        <motion.section
          className="py-16 md:py-20 px-5 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <p className="text-base md:text-lg text-fg-text-secondary max-w-2xl mx-auto leading-[1.7]">
            AI agents rubber-stamp every Vault purchase —{" "}
            <span className="text-fg-accent font-semibold">
              FOMO Guard intercepts overpriced personas, skills, and knowledge packs.
            </span>
          </p>
        </motion.section>

        {/* Gradient divider */}
        <div className="fg-gradient-divider max-w-4xl mx-auto" />

        {/* Scenario Picker — directly after problem/solution */}
        <ScenarioPicker
          scenarios={DEMO_SCENARIOS}
          onSelect={handleScenarioSelect}
          activeId={activeScenarioId}
          disabled={isLoading}
        />

        {/* Custom Input */}
        <div className="max-w-4xl mx-auto px-5 -mt-10 mb-8">
          <form
            onSubmit={handleCustomSubmit}
            className="flex gap-2"
          >
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Describe a Vault asset you want to buy..."
              aria-label="Purchase intent to analyze"
              className="flex-1 px-4 py-3 rounded-xl bg-fg-raised border border-fg-border-subtle text-sm text-fg-text placeholder-fg-text-muted focus:border-fg-accent transition-colors outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !customInput.trim()}
              className="px-5 py-3 rounded-xl bg-fg-accent text-fg-base text-sm font-semibold transition-colors duration-200 hover:bg-fg-accent-dim disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              Analyze
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <motion.p
            role="alert"
            className="text-sm text-fg-danger bg-fg-danger/10 border border-fg-danger/20 rounded-xl px-4 py-2.5 text-center max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}

        {/* Split Screen — full-width chat + product cards */}
        <AnimatePresence>
          {(userMessage || isLoading) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <SplitScreen
                userMessage={userMessage}
                analysis={analysis}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Degen Comment — right after split screen results */}
        <AnimatePresence>
          {analysis?.degenComment && (
            <motion.p
              className="text-center text-sm text-fg-text-muted italic py-4 px-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {analysis.degenComment}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Bridge CTA — connects demo results to vault lifecycle */}
        <AnimatePresence>
          {analysis && analysis.savingsAmount > 0 && (
            <motion.div
              className="text-center py-10 px-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <a
                href="#vault-lifecycle"
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full bg-fg-accent/10 text-fg-accent border border-fg-accent/20 transition-colors duration-200 hover:bg-fg-accent/20"
              >
                Liked the savings? Install FOMO Guard into your agent
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gradient divider */}
        <div className="fg-gradient-divider max-w-4xl mx-auto" />

        {/* Savings Tracker */}
        <AnimatePresence>
          {totalSaved > 0 && (
            <motion.section
              className="py-16 md:py-20 px-5 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="max-w-sm mx-auto">
                <SavingsTracker totalSaved={totalSaved} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Gradient divider */}
        <div className="fg-gradient-divider max-w-4xl mx-auto" />

        {/* Value Preview — below results for returning visitors */}
        {!userMessage && !isLoading && <ValuePreview />}
        {!userMessage && !isLoading && (
          <div className="fg-gradient-divider max-w-4xl mx-auto" />
        )}

        {/* Vault Lifecycle */}
        <motion.section
          id="vault-lifecycle"
          className="py-16 md:py-20 px-5 scroll-mt-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="max-w-3xl mx-auto">
            <VaultLifecycle walletAddress={walletAddress} userEmail={userEmail} />
          </div>
        </motion.section>

        {/* Gradient divider */}
        <div className="fg-gradient-divider max-w-4xl mx-auto" />

        {/* Under the Hood */}
        <motion.section
          className="py-16 md:py-20 px-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <UnderTheHood />
        </motion.section>
      </main>

      {/* x402 Payment Indicator */}
      <X402Indicator triggerCount={x402Count} variant={x402Variant} />

      {/* Footer */}
      <footer className="border-t border-fg-border-subtle/50 relative z-10 py-10 px-5 text-center">
        <p className="text-sm text-fg-text-secondary">
          Built on <span className="text-fg-text">Purch</span>. Powered by{" "}
          <span className="text-fg-text">x402</span> micropayments.
        </p>
        <p className="text-xs text-fg-text-muted mt-2">
          @trypurch
        </p>
      </footer>
    </div>
  );
}
