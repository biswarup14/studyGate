"use client";
import { useState, useEffect } from "react";
import { IndexData } from "@/lib/types";
import { SubjectCard } from "@/components/SubjectCard";
import { PageHeader } from "@/components/PageHeader";
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
      <PageHeader
        title="All Subjects"
        subtitle={`${index.subjects.length} subject${index.subjects.length !== 1 ? "s" : ""} · ${index.total.toLocaleString()} questions total`}
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        }
      />
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
