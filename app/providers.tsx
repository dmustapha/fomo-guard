// app/providers.tsx
"use client";

import {
  CrossmintProvider,
  CrossmintAuthProvider,
  CrossmintWalletProvider,
} from "@crossmint/client-sdk-react-ui";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_CROSSMINT_API_KEY;

  // Skip Crossmint providers if no real API key is configured
  if (!apiKey || apiKey.includes("your_")) {
    return <>{children}</>;
  }

  return (
    <CrossmintProvider apiKey={apiKey}>
      <CrossmintAuthProvider
        loginMethods={["email"]}
        appearance={{
          colors: {
            buttonBackground: "#10b981",
            textPrimary: "#ffffff",
          },
        }}
      >
        <CrossmintWalletProvider
          createOnLogin={{
            chain: "solana",
            recovery: { type: "api-key" },
          }}
        >
          {children}
        </CrossmintWalletProvider>
      </CrossmintAuthProvider>
    </CrossmintProvider>
  );
}
