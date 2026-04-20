// components/chat-panel.tsx
"use client";

import { motion } from "framer-motion";
import type { ChatPanelProps } from "@/types";

export function ChatPanel({
  variant,
  userMessage,
  response,
  isLoading,
}: ChatPanelProps) {
  const isFomo = variant === "fomo";

  return (
    <div className={`p-6 md:p-8 ${isFomo ? "fg-fomo-chat-bg" : ""}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span
          className={`w-2 h-2 rounded-full ${
            isFomo
              ? "bg-fg-accent fg-status-dot-live"
              : "bg-fg-text-muted"
          }`}
        />
        <span
          className={`text-xs font-semibold ${
            isFomo ? "text-fg-accent" : "text-fg-text-secondary"
          }`}
        >
          {isFomo ? "Agent + FOMO Guard" : "Agent without persona"}
        </span>
      </div>

      {/* Messages */}
      <div className="space-y-3 min-h-[180px]">
        {/* User bubble */}
        <div className="flex justify-end">
          <div className="bg-fg-overlay rounded-2xl rounded-br-md px-4 py-2.5 text-sm max-w-[85%] text-fg-text">
            <p className="font-light">{userMessage}</p>
          </div>
        </div>

        {/* AI response */}
        {isLoading ? (
          <div className="flex justify-start">
            <div
              className={`rounded-2xl rounded-bl-md px-4 py-2.5 text-sm max-w-[85%] ${
                isFomo
                  ? "bg-fg-accent/5 border border-fg-accent/15"
                  : "bg-fg-elevated"
              }`}
            >
              <div className="flex gap-1.5 py-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      isFomo ? "bg-fg-accent/60" : "bg-fg-text-muted"
                    }`}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : response ? (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div
              className={`rounded-2xl rounded-bl-md px-4 py-2.5 text-sm max-w-[85%] ${
                isFomo
                  ? "bg-fg-accent/5 border border-fg-accent/15 text-fg-text"
                  : "bg-fg-danger/8 border border-fg-danger/15 text-fg-text"
              }`}
            >
              <p className="font-light leading-relaxed">{response}</p>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
