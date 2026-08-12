"use client";
import { useState, useCallback } from "react";
import { ProgressData } from "@/lib/types";

const STORAGE_KEY = "gate_cs_progress";

function loadProgress(): ProgressData {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress(data: ProgressData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(() => loadProgress());

  const recordAttempt = useCallback(
    (questionId: string, correct: boolean) => {
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
        saveProgress(updated);
        return updated;
      });
    },
    []
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

  const mounted = typeof window !== "undefined";

  return { progress, recordAttempt, getStats, isAttempted, mounted };
}
