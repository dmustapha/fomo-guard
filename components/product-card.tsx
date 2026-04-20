// components/product-card.tsx
"use client";

import { motion } from "framer-motion";
import type { ProductCardProps } from "@/types";

const TYPE_ICONS: Record<string, string> = {
  "purch-vault": "🏪",
  "amazon": "📦",
};

export function ProductCard({
  product,
  variant,
  savingsDelta,
}: ProductCardProps) {
  const isOriginal = variant === "original";
  const isVault = product.source === "purch-vault";

  return (
    <motion.div
      className={`rounded-2xl p-4 flex flex-col gap-3 ${
        isOriginal
          ? "fg-card fg-glow-danger"
          : "fg-card-elevated fg-glow-accent"
      }`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: isOriginal ? 0 : 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Label */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
            isOriginal
              ? "bg-fg-danger/10 text-fg-danger border border-fg-danger/20"
              : "bg-fg-accent/10 text-fg-accent border border-fg-accent/20"
          }`}
        >
          {isOriginal ? "Impulse Pick" : "Smarter Pick"}
        </span>
        {isVault && (
          <span className="text-[11px] text-fg-accent font-medium bg-fg-accent/10 px-2 py-0.5 rounded-md">
            Vault
          </span>
        )}
        {product.isPrime && !isVault && (
          <span className="text-[11px] text-blue-400 font-medium">Prime</span>
        )}
      </div>

      {/* Product info */}
      <div className="flex gap-3">
        <div className="w-20 h-20 rounded-xl bg-fg-overlay border border-fg-border-subtle p-1.5 flex-shrink-0 overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-3xl">{TYPE_ICONS[product.source] ?? "📦"}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-fg-text line-clamp-2 leading-snug">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-amber-400 text-xs tracking-tight">
              {"★".repeat(Math.min(5, Math.max(0, Math.round(product.rating))))}
              {"☆".repeat(5 - Math.min(5, Math.max(0, Math.round(product.rating))))}
            </span>
            <span className="text-fg-text-muted text-xs">
              {isVault
                ? `${product.reviewCount.toLocaleString()} installs`
                : `(${product.reviewCount.toLocaleString()})`}
            </span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-end justify-between mt-auto pt-2 border-t border-fg-border-subtle/50">
        <div>
          <span
            className={`text-2xl font-bold font-[family-name:var(--font-space-grotesk)] ${
              isOriginal ? "text-fg-danger" : "text-fg-accent"
            }`}
          >
            ${product.price}
          </span>
          <span className="text-fg-text-muted text-xs ml-1">
            {product.currency}
          </span>
        </div>
        {savingsDelta !== undefined && savingsDelta > 0 && !isOriginal && (
          <motion.span
            className="text-fg-accent text-sm font-bold bg-fg-accent/10 px-2.5 py-1 rounded-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.3 }}
          >
            Save ${savingsDelta}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
