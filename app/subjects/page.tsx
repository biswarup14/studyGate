"use client";
import { useState, useEffect } from "react";
import { IndexData } from "@/lib/types";
import { SubjectCard } from "@/components/SubjectCard";
import { useSubjectProgress } from "@/components/useSubjectProgress";

export default function SubjectsPage() {
  const [index, setIndex] = useState<IndexData | null>(null);
  const [loading, setLoading] = useState(true);
  const { subjectProgress, mounted } = useSubjectProgress();

  useEffect(() => {
    fetch("/data/index.json")
      .then((r) => r.json())
      .then((d) => { setIndex(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !index) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="skeleton h-9 w-48 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="skeleton h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">All Subjects</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {index.subjects.map((s) => (
          <SubjectCard
            key={s.name}
            name={s.name}
            count={s.count}
            attempted={mounted ? subjectProgress[s.name]?.attempted : undefined}
          />
        ))}
      </div>
    </div>
  );
}
