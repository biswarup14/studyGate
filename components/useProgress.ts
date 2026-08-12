"use client";
import { useState, useEffect, useCallback } from "react";
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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(loadProgress());
  }, []);

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
      if (!mounted) return { attempted: 0, correct: 0, total: 0 };
      const data = questionIds
        ? questionIds.map((id) => progress[id]).filter(Boolean)
        : Object.values(progress);
      const attempted = data.filter((p) => p.attempts > 0).length;
      const correct = data.filter((p) => p.correct > 0).length;
      return { attempted, correct, total: data.length };
    },
    [progress, mounted]
  );

  const isAttempted = useCallback(
    (questionId: string) => {
      return mounted && progress[questionId] && progress[questionId].attempts > 0;
    },
    [progress, mounted]
  );

  return { progress, recordAttempt, getStats, isAttempted, mounted };
}
