"use client";
import { useState, useEffect } from "react";
import { IndexData } from "@/lib/types";
import { SubjectCard } from "@/components/SubjectCard";

export default function SubjectsPage() {
  const [index, setIndex] = useState<IndexData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/index.json")
      .then((r) => r.json())
      .then((d) => { setIndex(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !index) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">All Subjects</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {index.subjects.map((s) => (
          <SubjectCard key={s.name} name={s.name} count={s.count} />
        ))}
      </div>
    </div>
  );
}
