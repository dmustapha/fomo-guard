// components/wallet-button.tsx
"use client";

import { useCrossmintAuth, useWallet } from "@crossmint/client-sdk-react-ui";
import { useEffect, useState } from "react";

function WalletButtonInner() {
  const { login, logout, user, status: authStatus } = useCrossmintAuth();
  const { wallet, status: walletStatus } = useWallet();
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);

  useEffect(() => {
    if (wallet && walletStatus === "loaded") {
      wallet.balances().then((b) => {
        setUsdcBalance(b.usdc.amount);
      }).catch(() => {
        setUsdcBalance(null);
      });
    }
  }, [wallet, walletStatus]);

  if (authStatus === "initializing" || authStatus === "in-progress") {
    return (
      <button
        disabled
        className="px-4 py-2 rounded-xl bg-fg-raised border border-fg-border-subtle text-fg-text-muted text-sm"
      >
        Loading...
      </button>
    );
  }

  if (user) {
    const address = wallet?.address;
    const shortAddr = address
      ? `${address.slice(0, 4)}...${address.slice(-4)}`
      : null;

    return (
      <div className="flex items-center gap-3">
        {usdcBalance !== null && (
          <span className="text-xs font-mono text-fg-accent bg-fg-accent/10 px-2 py-1 rounded-lg">
            {parseFloat(usdcBalance).toFixed(2)} USDC
          </span>
        )}
        <span className="text-sm text-fg-text-secondary font-mono text-[13px]">
          {shortAddr ?? user.email ?? `${user.id.slice(0, 6)}...${user.id.slice(-4)}`}
        </span>
        <button
          onClick={logout}
          className="px-3 py-1.5 rounded-xl fg-card text-fg-text-secondary text-sm hover:text-fg-text transition-colors duration-200"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="px-4 py-2 rounded-xl bg-fg-accent text-fg-base text-sm font-semibold transition-colors duration-200 hover:brightness-110"
    >
      Connect Wallet
    </button>
  );
}

export function WalletButton() {
  const [hasCrossmint, setHasCrossmint] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_CROSSMINT_API_KEY;
    setHasCrossmint(!!key && !key.includes("your_"));
  }, []);

  if (!hasCrossmint) {
    return null;
  }

  return <WalletButtonInner />;
}

