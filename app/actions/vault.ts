// app/actions/vault.ts
"use server";

import { vaultSearch, vaultBuy, vaultDownload } from "@/lib/purch-api";
import type { VaultSearchResponse, VaultBuyResponse } from "@/types";

export async function searchVaultAssets(
  query: string
): Promise<VaultSearchResponse> {
  return vaultSearch(query, { productType: "persona", limit: 10 });
}

export async function buyVaultAsset(
  slug: string,
  walletAddress: string,
  email: string
): Promise<VaultBuyResponse> {
  if (!slug || typeof slug !== "string" || slug.length > 200) {
    throw new Error("Invalid asset slug");
  }
  if (!walletAddress || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress)) {
    throw new Error("Invalid Solana wallet address");
  }
  if (!email || !email.includes("@") || email.length > 200) {
    throw new Error("Invalid email address");
  }
  return vaultBuy(slug, walletAddress, email);
}

export async function downloadVaultAsset(
  purchaseId: string,
  downloadToken: string
): Promise<string> {
  const buffer = await vaultDownload(purchaseId, downloadToken);
  // Convert to base64 for client download
  const base64 = Buffer.from(buffer).toString("base64");
  return base64;
}
