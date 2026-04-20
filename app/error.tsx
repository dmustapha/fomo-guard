// app/error.tsx
"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center text-center px-5">
      <div>
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-fg-danger/10 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-fg-danger"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-lg font-bold font-[family-name:var(--font-space-grotesk)] text-fg-text mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-fg-text-secondary mb-6 max-w-sm mx-auto">
          FOMO Guard hit an unexpected error. Your savings data is safe.
        </p>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-fg-accent text-fg-base text-sm font-semibold transition-colors duration-200 hover:brightness-110"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
