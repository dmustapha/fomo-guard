// components/vault-lifecycle.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { searchVaultAssets, buyVaultAsset, downloadVaultAsset } from "@/app/actions/vault";
import type { VaultLifecycleState, VaultAsset } from "@/types";

const STEPS = ["Search", "Found", "Buy", "Download", "Install"] as const;

function StepIndicator({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
              i <= currentIndex
                ? "bg-emerald-600 text-white"
                : "bg-gray-800 text-gray-500"
            }`}
          >
            {i + 1}
          </div>
          <span className={`text-xs ${i <= currentIndex ? "text-emerald-400" : "text-gray-600"}`}>
            {step}
          </span>
          {i < STEPS.length - 1 && (
            <div className={`w-6 h-px ${i < currentIndex ? "bg-emerald-600" : "bg-gray-800"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export function VaultLifecycle() {
  const [state, setState] = useState<VaultLifecycleState>({
    step: "idle",
    asset: null,
    purchaseId: null,
    downloadToken: null,
    error: null,
  });

  const stepIndex =
    state.step === "idle" ? -1
    : state.step === "searching" ? 0
    : state.step === "found" ? 1
    : state.step === "buying" ? 2
    : state.step === "purchased" ? 2
    : state.step === "downloading" ? 3
    : 4;

  async function handleStart() {
    setState({ step: "searching", asset: null, purchaseId: null, downloadToken: null, error: null });

    try {
      const result = await searchVaultAssets("fomo guard");
      const persona = result.items.find((i) => i.productType === "persona");

      if (!persona) {
        setState((s) => ({
          ...s,
          step: "found",
          error: "FOMO Guard persona not found in Vault yet. It will be published before submission.",
        }));
        return;
      }

      setState((s) => ({ ...s, step: "found", asset: persona }));
    } catch (err) {
      setState((s) => ({
        ...s,
        step: "idle",
        error: `Search failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      }));
    }
  }

  async function handleBuy() {
    if (!state.asset) return;
    setState((s) => ({ ...s, step: "buying", error: null }));

    try {
      const result = await buyVaultAsset(
        state.asset.slug,
        process.env.NEXT_PUBLIC_DEMO_WALLET_ADDRESS ?? "",
        "demo@fomoguard.xyz"
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
        error: `Buy failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      }));
    }
  }

  async function handleDownload() {
    if (!state.purchaseId || !state.downloadToken) return;
    setState((s) => ({ ...s, step: "downloading", error: null }));

    try {
      const base64 = await downloadVaultAsset(state.purchaseId, state.downloadToken);
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
        error: `Download failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      }));
    }
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Get FOMO Guard from the Vault</h2>
        <span className="text-xs text-gray-500">Powered by x402 micropayments</span>
      </div>

      <StepIndicator currentIndex={stepIndex} />

      {state.error && (
        <p className="text-sm text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        {state.step === "idle" && (
          <button
            onClick={handleStart}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
          >
            Search Vault for FOMO Guard
          </button>
        )}

        {state.step === "found" && state.asset && (
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex-1">
              <p className="text-sm text-gray-100">{state.asset.title}</p>
              <p className="text-xs text-gray-400">{state.asset.cardDescription}</p>
              <p className="text-sm text-emerald-400 mt-1">${state.asset.price} USDC</p>
            </div>
            <button
              onClick={handleBuy}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
            >
              Buy Persona
            </button>
          </motion.div>
        )}

        {state.step === "purchased" && (
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
          >
            Download ZIP
          </button>
        )}

        {state.step === "complete" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-emerald-400"
          >
            FOMO Guard persona downloaded. Extract the ZIP and load system-prompt.md into your AI agent.
          </motion.div>
        )}
      </div>
    </div>
  );
}
