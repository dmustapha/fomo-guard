// components/vault-lifecycle.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  searchVaultAssets,
  buyVaultAsset,
  downloadVaultAsset,
} from "@/app/actions/vault";
import type { VaultLifecycleState, VaultAsset } from "@/types";

const STEPS = ["Search", "Found", "Buy", "Download", "Install"] as const;

function StepIndicator({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none" role="list" aria-label="Purchase steps">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-1 flex-shrink-0">
          <motion.div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
              i < currentIndex
                ? "bg-fg-accent text-fg-base"
                : i === currentIndex
                  ? "bg-fg-accent/20 text-fg-accent border border-fg-accent/30"
                  : "bg-fg-raised text-fg-text-muted border border-fg-border-subtle"
            }`}
            animate={
              i === currentIndex ? { scale: [1, 1.1, 1] } : {}
            }
            transition={{ duration: 0.5, repeat: i === currentIndex ? Infinity : 0, repeatDelay: 2 }}
          >
            {i < currentIndex ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              i + 1
            )}
          </motion.div>
          <span
            className={`text-[11px] font-medium mr-1 ${
              i <= currentIndex ? "text-fg-accent" : "text-fg-text-muted"
            }`}
          >
            {step}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className={`w-8 h-px transition-colors duration-300 ${
                i < currentIndex ? "bg-fg-accent" : "bg-fg-border-subtle"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function VaultLifecycle({ walletAddress, userEmail }: { walletAddress?: string | null; userEmail?: string | null }) {
  const [state, setState] = useState<VaultLifecycleState>({
    step: "idle",
    asset: null,
    purchaseId: null,
    downloadToken: null,
    error: null,
  });

  const STEP_INDEX: Record<string, number> = {
    idle: -1,
    searching: 0,
    found: 1,
    buying: 2,
    purchased: 2,
    downloading: 3,
    complete: 4,
  };
  const stepIndex = STEP_INDEX[state.step] ?? -1;

  async function handleStart() {
    setState({
      step: "searching",
      asset: null,
      purchaseId: null,
      downloadToken: null,
      error: null,
    });

    try {
      const result = await searchVaultAssets("fomo guard");
      const persona = result.items.find(
        (i: VaultAsset) => i.productType === "persona"
      );

      if (!persona) {
        setState((s) => ({
          ...s,
          step: "found",
          error:
            "FOMO Guard persona isn't on the Vault yet — check back soon!",
        }));
        return;
      }

      setState((s) => ({ ...s, step: "found", asset: persona }));
    } catch (err) {
      setState((s) => ({
        ...s,
        step: "idle",
        error: "Couldn't reach the Vault right now. Please try again.",
      }));
    }
  }

  async function handleBuy() {
    if (!state.asset) return;

    const addr = walletAddress ?? process.env.NEXT_PUBLIC_DEMO_WALLET_ADDRESS;
    if (!addr || addr.includes("your_") || addr === "placeholder") {
      setState((s) => ({
        ...s,
        error: "Connect your wallet first to make a purchase.",
      }));
      return;
    }

    setState((s) => ({ ...s, step: "buying", error: null }));

    try {
      const result = await buyVaultAsset(
        state.asset.slug,
        addr,
        userEmail ?? "demo@fomoguard.xyz"
      );
      setState((s) => ({
        ...s,
        step: "purchased",
        purchaseId: result.purchaseId,
        downloadToken: result.downloadToken,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        step: "found",
        error: "Purchase didn't go through. Please try again.",
      }));
    }
  }

  async function handleDownload() {
    if (!state.purchaseId || !state.downloadToken) return;
    setState((s) => ({ ...s, step: "downloading", error: null }));

    try {
      const base64 = await downloadVaultAsset(
        state.purchaseId,
        state.downloadToken
      );
      const blob = new Blob(
        [Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))],
        { type: "application/zip" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "fomo-guard-persona.zip";
      a.click();
      URL.revokeObjectURL(url);

      setState((s) => ({ ...s, step: "complete" }));
    } catch (err) {
      setState((s) => ({
        ...s,
        step: "purchased",
        error: "Download failed. Please try again.",
      }));
    }
  }

  return (
    <div className="fg-card-elevated rounded-2xl p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-[family-name:var(--font-space-grotesk)] text-fg-text mb-1">
            Get FOMO Guard from the Vault
          </h2>
          <p className="text-xs text-fg-text-muted">
            Search, buy, and install — all via x402 micropayments
          </p>
        </div>
        <div className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-fg-accent/10 border border-fg-accent/20">
          <span className="text-[11px] font-medium text-fg-accent">
            x402 Powered
          </span>
        </div>
      </div>

      <StepIndicator currentIndex={stepIndex} />

      <AnimatePresence mode="wait">
        {state.error && (
          <motion.p
            key="error"
            className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3.5 py-2.5"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {state.error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        {state.step === "idle" && (
          <motion.button
            onClick={handleStart}
            className="px-5 py-2.5 rounded-xl bg-fg-accent text-fg-base text-sm font-semibold transition-colors duration-200 hover:brightness-110"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Search Vault for FOMO Guard
          </motion.button>
        )}

        {state.step === "searching" && (
          <motion.div
            className="flex items-center gap-3 text-fg-text-secondary text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-fg-accent border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            Searching the Vault...
          </motion.div>
        )}

        {state.step === "found" && state.asset && (
          <motion.div
            className="flex items-center gap-4 w-full"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-fg-text">
                {state.asset.title}
              </p>
              <p className="text-xs text-fg-text-muted line-clamp-1">
                {state.asset.cardDescription}
              </p>
              <p className="text-sm text-fg-accent font-semibold mt-1">
                ${state.asset.price} USDC
              </p>
            </div>
            <motion.button
              onClick={handleBuy}
              className="px-5 py-2.5 rounded-xl bg-fg-accent text-fg-base text-sm font-semibold transition-colors duration-200 hover:brightness-110 flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Buy Persona
            </motion.button>
          </motion.div>
        )}

        {state.step === "purchased" && (
          <motion.button
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-xl bg-fg-accent text-fg-base text-sm font-semibold transition-colors duration-200 hover:brightness-110"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Download ZIP
          </motion.button>
        )}

        {state.step === "complete" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-sm text-fg-accent"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            FOMO Guard persona downloaded. Extract the ZIP and load
            system-prompt.md into your AI agent.
          </motion.div>
        )}
      </div>
    </div>
  );
}
