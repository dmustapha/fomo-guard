// lib/purch-api.ts
import { getPaymentFetch } from "./x402";
import type {
  SearchResponse,
  ShopResponse,
  VaultSearchResponse,
  VaultBuyResponse,
} from "@/types";

const BASE = "https://api.purch.xyz";

export async function searchProducts(
  query: string,
  options?: { priceMax?: number; brand?: string; page?: number }
): Promise<SearchResponse> {
  const fetchWithPay = await getPaymentFetch();
  const params = new URLSearchParams({ q: query });
  if (options?.priceMax) params.set("priceMax", String(options.priceMax));
  if (options?.brand) params.set("brand", options.brand);
  if (options?.page) params.set("page", String(options.page));

  const res = await fetchWithPay(`${BASE}/x402/search?${params}`);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}

export async function shopWithAI(
  message: string,
  context?: { priceRange?: { min: number; max: number }; preferences?: string[] }
): Promise<ShopResponse> {
  const fetchWithPay = await getPaymentFetch();
  const res = await fetchWithPay(`${BASE}/x402/shop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, context }),
  });
  if (!res.ok) throw new Error(`Shop failed: ${res.status}`);
  return res.json();
}

export async function vaultSearch(
  query: string,
  options?: { productType?: string; limit?: number }
): Promise<VaultSearchResponse> {
  const fetchWithPay = await getPaymentFetch();
  const params = new URLSearchParams({ q: query });
  if (options?.productType) params.set("productType", options.productType);
  if (options?.limit) params.set("limit", String(options.limit));

  const res = await fetchWithPay(`${BASE}/x402/vault/search?${params}`);
  if (!res.ok) throw new Error(`Vault search failed: ${res.status}`);
  return res.json();
}

export async function vaultBuy(
  slug: string,
  walletAddress: string,
  email: string
): Promise<VaultBuyResponse> {
  const fetchWithPay = await getPaymentFetch();
  const res = await fetchWithPay(`${BASE}/x402/vault/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, walletAddress, email }),
  });
  if (!res.ok) throw new Error(`Vault buy failed: ${res.status}`);
  return res.json();
}

export async function vaultDownload(
  purchaseId: string,
  downloadToken: string
): Promise<ArrayBuffer> {
  const fetchWithPay = await getPaymentFetch();
  const res = await fetchWithPay(
    `${BASE}/x402/vault/download/${purchaseId}?downloadToken=${downloadToken}`
  );
  if (!res.ok) throw new Error(`Vault download failed: ${res.status}`);
  return res.arrayBuffer();
}
