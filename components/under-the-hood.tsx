// components/under-the-hood.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SYSTEM_PROMPT = `You are FOMO Guard, a defensive AI persona that intercepts impulsive purchases and finds smarter alternatives. You speak in crypto-native language but your advice is practical and data-driven.

## Core Behavior
1. Intercept — When a user expresses purchase intent, pause and analyze.
2. Search — Use Purch's /x402/search endpoint to find cheaper alternatives.
3. Compare — Present original vs alternative with price, rating, reviews.
4. Quantify — Express savings in USD and SOL equivalent.
5. Advise — Give a clear recommendation. Never block — redirect.

## Voice & Tone
- Direct, confident, slightly irreverent
- Crypto terminology: "diamond hands", "don't ape in", "WAGMI", "ser"
- Concise: 2-3 sentences max, then show data`;

const MANIFEST = {
  name: "FOMO Guard",
  version: "1.0.0",
  type: "persona",
  description: "Your rational brain for impulsive buying decisions.",
  author: "FOMO Labs",
  category: "productivity",
  tags: ["shopping", "savings", "impulse-control", "purch", "defi", "crypto"],
  entryPoint: "system-prompt.md",
  requiredApis: ["/x402/search", "/x402/shop"],
};

const API_ENDPOINTS = [
  { method: "GET", path: "/x402/search", cost: "$0.01", desc: "Find alternative products" },
  { method: "POST", path: "/x402/shop", cost: "$0.10", desc: "AI-powered product discovery" },
  { method: "GET", path: "/x402/vault/search", cost: "$0.01", desc: "Search Vault assets" },
  { method: "POST", path: "/x402/vault/buy", cost: "varies", desc: "Purchase Vault asset" },
  { method: "GET", path: "/x402/vault/download", cost: "$0.01", desc: "Download purchased asset" },
];

type Tab = "prompt" | "manifest" | "api";

export function UnderTheHood() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("prompt");

  const tabs: { id: Tab; label: string }[] = [
    { id: "prompt", label: "System Prompt" },
    { id: "manifest", label: "manifest.json" },
    { id: "api", label: "API Endpoints" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 rounded-xl fg-card hover:border-fg-border transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fg-accent">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <div className="text-left">
            <p className="text-sm font-semibold text-fg-text">Under the Hood</p>
            <p className="text-xs text-fg-text-muted">
              Real persona artifact — not a demo facade
            </p>
          </div>
        </div>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-fg-text-muted"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">
              {/* Tab bar */}
              <div className="flex gap-1 p-1 rounded-lg bg-fg-raised">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "bg-fg-accent/15 text-fg-accent"
                        : "text-fg-text-muted hover:text-fg-text"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="fg-card rounded-xl p-4 max-h-80 overflow-y-auto">
                {activeTab === "prompt" && (
                  <pre className="text-xs text-fg-text-secondary font-mono whitespace-pre-wrap leading-relaxed">
                    {SYSTEM_PROMPT}
                  </pre>
                )}

                {activeTab === "manifest" && (
                  <pre className="text-xs text-fg-text-secondary font-mono whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify(MANIFEST, null, 2)}
                  </pre>
                )}

                {activeTab === "api" && (
                  <div className="space-y-2">
                    {API_ENDPOINTS.map((ep) => (
                      <div
                        key={ep.path}
                        className="flex items-start gap-3 py-2 border-b border-fg-border-subtle/50 last:border-0"
                      >
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          ep.method === "GET"
                            ? "bg-fg-accent/10 text-fg-accent"
                            : "bg-amber-500/10 text-amber-400"
                        }`}>
                          {ep.method}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono text-fg-text">{ep.path}</p>
                          <p className="text-[11px] text-fg-text-muted">{ep.desc}</p>
                        </div>
                        <span className="text-[11px] font-mono text-fg-accent shrink-0">
                          {ep.cost}
                        </span>
                      </div>
                    ))}
                    <p className="text-[11px] text-fg-text-muted pt-2">
                      All endpoints use HTTP 402 micropayments via x402 protocol on Solana
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
