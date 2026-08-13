"use client";
import { useState, useEffect, useMemo } from "react";
import { useProgress } from "./useProgress";

export interface SubjectAttempt {
  attempted: number;
  correct: number;
}

export function useSubjectProgress() {
  const { progress, mounted } = useProgress();
  const [subjectMap, setSubjectMap] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    fetch("/data/question-subjects.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Record<string, string>) => {
        if (!cancelled) setSubjectMap(data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const subjectProgress = useMemo(() => {
    if (!mounted) return {};
    const counts: Record<string, SubjectAttempt> = {};
    for (const [id, p] of Object.entries(progress)) {
      if (p.attempts <= 0) continue;
      const subject = subjectMap[id];
      if (!subject) continue;
      const entry = (counts[subject] ||= { attempted: 0, correct: 0 });
      entry.attempted += 1;
      if (p.correct > 0) entry.correct += 1;
    }
    return counts;
  }, [progress, mounted, subjectMap]);

  return { subjectProgress, mounted };
}
