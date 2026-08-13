"use client";
import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
}

function getTimeLeft(target: number): TimeLeft {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    passed: false,
  };
}

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

export function CountdownTimer() {
  const target = new Date("2027-02-07T09:30:00+05:30").getTime();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="animate-pop card-surface relative overflow-hidden p-5 sm:p-7">
      <span className="pointer-events-none absolute -top-14 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <span className="pointer-events-none absolute inset-x-6 top-0 h-0.5 rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            {timeLeft.passed ? "GATE 2027 underway" : "Countdown to GATE 2027"}
          </p>
          <p className="text-lg sm:text-xl font-bold">CSE Paper · Feb 7, 2027</p>
          <p className="text-sm text-muted-foreground mt-0.5">9:30 AM – 12:30 PM (IST)</p>
        </div>

        {timeLeft.passed ? (
          <p className="text-2xl font-bold text-primary">The exam has begun — good luck!</p>
        ) : (
          <div className="flex items-start gap-2 sm:gap-3">
            {UNITS.map(({ key, label }) => (
              <div key={key} className="flex flex-col items-center">
                <div className="w-16 sm:w-20 rounded-xl border border-border bg-muted px-2 py-2.5 text-center">
                  <span className="block text-2xl sm:text-3xl font-black tabular-nums text-primary">
                    {String(timeLeft[key]).padStart(2, "0")}
                  </span>
                </div>
                <span className="mt-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
