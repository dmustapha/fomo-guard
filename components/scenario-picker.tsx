// components/scenario-picker.tsx
"use client";

import type { ScenarioPickerProps } from "@/types";

export function ScenarioPicker({ scenarios, onSelect, activeId, disabled }: ScenarioPickerProps & { disabled?: boolean }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Try a demo scenario:</p>
      <div className="flex flex-wrap gap-2">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario)}
            disabled={disabled}
            className={`px-3 py-2 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              activeId === scenario.id
                ? "bg-emerald-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {scenario.label}
          </button>
        ))}
      </div>
    </div>
  );
}
