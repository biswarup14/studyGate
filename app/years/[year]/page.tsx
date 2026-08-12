"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Question } from "@/lib/types";
import { QuestionCard } from "@/components/QuestionCard";

const PAGE_SIZE = 20;

export default function YearDetailPage() {
  const { year } = useParams<{ year: string }>();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`/data/questions-${year}.json`)
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => [])
      .then((data) => { setAllQuestions(data); setLoading(false); });
  }, [year]);

  const totalPages = Math.ceil(allQuestions.length / PAGE_SIZE);
  const paginated = allQuestions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const subjectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allQuestions.forEach((q) => {
      counts[q.subject] = (counts[q.subject] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]);
  }, [allQuestions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold">GATE {year}</h1>
        <span className="text-sm text-muted-foreground">
          {allQuestions.length.toLocaleString()} question{allQuestions.length !== 1 ? "s" : ""}
        </span>
      </div>

      <Link href="/questions" className="text-sm text-primary hover:underline block mb-6">
        ← All Questions
      </Link>

      {/* Subject breakdown */}
      {subjectCounts.length > 0 && (
        <div className="mb-6 p-4 rounded-xl border border-border bg-card">
          <h2 className="text-sm font-medium mb-3">Subject Breakdown</h2>
          <div className="flex flex-wrap gap-2">
            {subjectCounts.map(([subj, count]) => (
              <span key={subj} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted text-xs">
                <span className="font-medium">{subj}</span>
                <span className="text-muted-foreground">({count})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>

      {allQuestions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No questions available for {year}.
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-muted"
          >
            ← Prev
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-muted"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
