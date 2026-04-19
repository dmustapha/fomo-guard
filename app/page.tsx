// app/page.tsx
"use client";

import { useState, useCallback } from "react";
import { SplitScreen } from "@/components/split-screen";
import { SavingsTracker } from "@/components/savings-tracker";
import { ScenarioPicker } from "@/components/scenario-picker";
import { VaultLifecycle } from "@/components/vault-lifecycle";
import { WalletButton } from "@/components/wallet-button";
import { analyzeIntent } from "@/app/actions/analyze-intent";
import { DEMO_SCENARIOS } from "@/lib/demo-scenarios";
import type { FomoAnalysis, DemoScenario } from "@/types";

export default function HomePage() {
  const [userMessage, setUserMessage] = useState("");
  const [analysis, setAnalysis] = useState<FomoAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalSaved, setTotalSaved] = useState(0);
  const [seenScenarios, setSeenScenarios] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");

  const runAnalysis = useCallback(async (message: string, scenarioId?: string) => {
    setIsLoading(true);
    setError(null);
    setUserMessage(message);
    setActiveScenarioId(scenarioId ?? null);

    try {
      const result = await analyzeIntent(message, scenarioId);
      setAnalysis(result);
      // Only add savings once per scenario to prevent inflation on repeated clicks
      const key = scenarioId ?? message;
      if (result.savingsAmount > 0 && !seenScenarios.has(key)) {
        setSeenScenarios((prev) => new Set(prev).add(key));
        setTotalSaved((prev) => prev + result.savingsAmount);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try a scenario button instead.");
    } finally {
      setIsLoading(false);
    }
  }, [seenScenarios]);

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
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h1 className="text-lg font-bold text-emerald-400">FOMO Guard</h1>
              <p className="text-xs text-gray-500">Your rational brain. On-chain.</p>
            </div>
          </div>
          <WalletButton />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {/* Hero */}
        <section className="text-center space-y-3">
          <h2 className="text-3xl font-bold">
            Stop aping. Start <span className="text-emerald-400">saving</span>.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            FOMO Guard is the first defensive persona for Purch Vault. It intercepts impulsive purchases
            and finds you smarter deals on Purch. Not less buying. Smarter buying.
          </p>
        </section>

        {/* Scenario Picker */}
        <ScenarioPicker
          scenarios={DEMO_SCENARIOS}
          onSelect={handleScenarioSelect}
          activeId={activeScenarioId}
          disabled={isLoading}
        />

        {/* Error display */}
        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2 text-center">
            {error}
          </p>
        )}

        {/* Custom Input */}
        <form onSubmit={handleCustomSubmit} className="flex gap-3">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Or type what you want to buy..."
            className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50"
          />
          <button
            type="submit"
            disabled={isLoading || !customInput.trim()}
            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-600 text-white text-sm font-medium transition-colors"
          >
            Analyze
          </button>
        </form>

        {/* Split Screen (shows after first interaction) */}
        {(userMessage || isLoading) && (
          <SplitScreen
            userMessage={userMessage}
            analysis={analysis}
            isLoading={isLoading}
          />
        )}

        {/* Savings Tracker (shows after first savings) */}
        {totalSaved > 0 && <SavingsTracker totalSaved={totalSaved} />}

        {/* Degen Comment */}
        {analysis?.degenComment && (
          <p className="text-center text-sm text-gray-500 italic">
            {analysis.degenComment}
          </p>
        )}

        {/* Divider */}
        <hr className="border-gray-800" />

        {/* Vault Lifecycle */}
        <VaultLifecycle />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-4 mt-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-gray-600">
          <span>Built on Purch. Powered by x402 micropayments.</span>
          <span>@trypurch</span>
        </div>
      </footer>
    </div>
  );
}
