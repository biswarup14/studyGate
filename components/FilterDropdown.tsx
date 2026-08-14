"use client";
import { useState, useEffect, useRef } from "react";

interface FilterDropdownProps {
  label: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string; count?: number }[];
  onChange: (value: string) => void;
}

export function FilterDropdown({
  label,
  value,
  placeholder,
  options,
  onChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  const select = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm transition-all hover-lift ${
          open
            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
            : value
            ? "border-primary/40 bg-primary/10"
            : "border-border bg-card hover:border-primary/30 hover:bg-muted"
        }`}
      >
        <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">{label}</span>
        <span className={value ? "text-foreground font-medium" : "text-muted-foreground"}>{selected?.label || placeholder}</span>
        <svg
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 left-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-xl animate-menu-in">
          <button
            onClick={() => select("")}
            className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              value === "" ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
            }`}
          >
            <span>{placeholder}</span>
            {value === "" && (
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <div className="my-1 mx-3 h-px bg-border" />
          {options.map((o, i) => (
            <button
              key={o.value}
              onClick={() => select(o.value)}
              className={`animate-fade-in flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                o.value === value ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
              }`}
              style={{ animationDelay: `${i * 15}ms`, animationFillMode: "both" }}
            >
              <span className="truncate">{o.label}</span>
              <span className="flex items-center gap-2 shrink-0">
                {o.count !== undefined && (
                  <span className={`text-xs ${o.value === value ? "text-primary/70" : "text-muted-foreground"}`}>{o.count}</span>
                )}
                {o.value === value && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
