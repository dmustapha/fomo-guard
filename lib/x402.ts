// lib/x402.ts
import { createKeyPairSignerFromBytes } from "@solana/kit";
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { SOLANA_MAINNET_CAIP2 } from "@x402/svm";
import { ExactSvmScheme } from "@x402/svm/exact/client";

let cachedFetch: typeof fetch | null = null;

export async function getPaymentFetch(): Promise<typeof fetch> {
  if (cachedFetch) return cachedFetch;

  const secretKeyBase64 = process.env.X402_WALLET_SECRET;
  if (!secretKeyBase64) {
    throw new Error("X402_WALLET_SECRET env var is required");
  }

  const secretKeyBytes = Buffer.from(secretKeyBase64, "base64");
  const signer = await createKeyPairSignerFromBytes(
    new Uint8Array(secretKeyBytes)
  );

  const client = new x402Client();
  client.register(SOLANA_MAINNET_CAIP2, new ExactSvmScheme(signer));

  cachedFetch = wrapFetchWithPayment(fetch, client);
  return cachedFetch;
}
