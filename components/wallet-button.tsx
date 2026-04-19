// components/wallet-button.tsx
"use client";

import { useCrossmintAuth } from "@crossmint/client-sdk-react-ui";
import { useEffect, useState } from "react";

function WalletButtonInner() {
  const { login, logout, user, status } = useCrossmintAuth();

  if (status === "initializing" || status === "in-progress") {
    return (
      <button
        disabled
        className="px-4 py-2 rounded-lg bg-gray-800 text-gray-500 text-sm"
      >
        Loading...
      </button>
    );
  }

  if (user) {
    const short = user.email
      ? user.email
      : `${user.id.slice(0, 6)}...${user.id.slice(-4)}`;

    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-emerald-400 font-mono">{short}</span>
        <button
          onClick={logout}
          className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
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
    return (
      <button
        disabled
        className="px-4 py-2 rounded-lg bg-gray-800 text-gray-500 text-sm"
      >
        Wallet (configure API key)
      </button>
    );
  }

  return <WalletButtonInner />;
}
