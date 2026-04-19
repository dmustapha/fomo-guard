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
