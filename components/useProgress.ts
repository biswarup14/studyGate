"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { ProgressData } from "@/lib/types";

const GUEST_KEY = "gate_cs_progress";

function loadGuestProgress(): ProgressData {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveGuestProgress(data: ProgressData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(data));
  } catch {}
}

export function useProgress() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.id;

  const [progress, setProgress] = useState<ProgressData>(() => loadGuestProgress());
  const [loaded, setLoaded] = useState(false);
  const prevLoggedIn = useRef(isLoggedIn);

  useEffect(() => {
    const justLoggedOut = prevLoggedIn.current && !isLoggedIn;
    prevLoggedIn.current = isLoggedIn;

    if (!isLoggedIn) {
      if (justLoggedOut) {
        setProgress(loadGuestProgress());
      }
      // Defer setLoaded to avoid synchronous setState in effect
      queueMicrotask(() => setLoaded(true));
      return;
    }

    let cancelled = false;
    fetch("/api/progress")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: ProgressData) => {
        if (!cancelled) {
          setProgress(data);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => { cancelled = true; };
  }, [isLoggedIn]);

  const recordAttempt = useCallback(
    async (questionId: string, correct: boolean) => {
      if (isLoggedIn) {
        try {
          const res = await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionId, correct }),
          });
          if (res.ok) {
            const updated = await res.json();
            setProgress((prev) => ({
              ...prev,
              [questionId]: {
                attempts: updated.attempts,
                correct: updated.correct,
                lastSeen: updated.lastSeen,
              },
            }));
          }
        } catch {}
      } else {
        setProgress((prev) => {
          const existing = prev[questionId] || { attempts: 0, correct: 0, lastSeen: "" };
          const updated = {
            ...prev,
            [questionId]: {
              attempts: existing.attempts + 1,
              correct: existing.correct + (correct ? 1 : 0),
              lastSeen: new Date().toISOString(),
            },
          };
          saveGuestProgress(updated);
          return updated;
        });
      }
    },
    [isLoggedIn]
  );

  const getStats = useCallback(
    (questionIds?: string[]) => {
      const data = questionIds
        ? questionIds.map((id) => progress[id]).filter(Boolean)
        : Object.values(progress);
      const attempted = data.filter((p) => p.attempts > 0).length;
      const correct = data.filter((p) => p.correct > 0).length;
      return { attempted, correct, total: data.length };
    },
    [progress]
  );

  const isAttempted = useCallback(
    (questionId: string) => {
      return !!(progress[questionId] && progress[questionId].attempts > 0);
    },
    [progress]
  );

  const mounted = typeof window !== "undefined" && loaded;

  return { progress, recordAttempt, getStats, isAttempted, mounted, isLoggedIn };
}
