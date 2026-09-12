"use client";

import { Check } from "lucide-react";

export function ColorSwatchPicker({ options, value, onSelect, label }: { options: { label: string; value: string }[]; value: string; onSelect: (value: string) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value === option.value;
        return <button key={option.value} type="button" role="radio" aria-checked={selected} aria-label={option.label} title={option.label} onClick={() => onSelect(option.value)} className="flex size-8 items-center justify-center rounded-full outline-none ring-offset-2 ring-offset-(--surface-app) transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-(--focus-ring)" style={{ backgroundColor: option.value, boxShadow: selected ? "0 0 0 2px var(--surface-app), 0 0 0 4px currentColor" : undefined, color: option.value }}>
          {selected ? <Check size={14} className="text-white" /> : null}
        </button>;
      })}
    </div>
  );
}
