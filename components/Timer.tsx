"use client";
import { useState, useEffect } from "react";

interface TimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export function Timer({ initialMinutes, onTimeUp, isPaused = false }: TimerProps) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);

  useEffect(() => {
    if (isPaused || seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, seconds, onTimeUp]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const urgent = seconds < 60;

  return (
    <div className={`flex items-center gap-2 font-mono text-lg font-bold ${urgent ? "text-error animate-pulse" : "text-foreground"}`}>
      <svg className={`h-5 w-5 ${urgent ? "text-error" : "text-muted-foreground"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
    </div>
  );
}
