// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "FOMO Guard — Defensive AI Persona for Purch Vault",
  description:
    "The first defensive persona for Purch Vault. Install FOMO Guard into your AI agent to intercept impulse buys and find smarter deals on Purch.",
  openGraph: {
    title: "FOMO Guard — Defensive AI Persona for Purch Vault",
    description: "Install FOMO Guard into your AI agent to intercept impulse buys and find smarter deals. Buy it from the Vault via x402 micropayments.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FOMO Guard — AI Persona for Purch Vault",
    description: "The first defensive persona for AI agents. Intercepts impulse buys, finds smarter deals on Purch. Powered by x402.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-fg-base text-fg-text antialiased fg-grid-bg fg-ambient-orb`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
