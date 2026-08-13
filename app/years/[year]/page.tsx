"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Question, SUBJECT_COLORS, SUBJECT_ICONS } from "@/lib/types";
import { QuestionCard } from "@/components/QuestionCard";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { sortNewestFirst } from "@/lib/sort";

const PAGE_SIZE = 20;

export default function YearDetailPage() {
  return (
    <Suspense fallback={<YearDetailSkeleton />}>
      <YearDetailContent />
    </Suspense>
  );
}

function YearDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="skeleton h-9 w-48 mb-6" />
      <div className="skeleton h-20 mb-6" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton h-44" />
        ))}
      </div>
    </div>
  );
}

function YearDetailContent() {
  const { year } = useParams<{ year: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));

  // Keep page in sync with the URL so back/forward restores the exact page
  useEffect(() => {
    const target = page > 1 ? `page=${page}` : "";
    const current = window.location.search.replace(/^\?/, "");
    if (target !== current) {
      router.replace(`/years/${year}${target ? `?${target}` : ""}`, { scroll: false });
    }
  }, [router, year, page]);

  useEffect(() => {
    fetch(`/data/questions-${year}.json`)
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => [])
      .then((data) => { setAllQuestions([...data].sort(sortNewestFirst)); setLoading(false); });
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
    return <YearDetailSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        back={{ href: "/questions", label: "All Questions" }}
        icon={<span className="text-sm font-black">{year}</span>}
        title={`GATE ${year}`}
        subtitle={`${allQuestions.length.toLocaleString()} question${allQuestions.length !== 1 ? "s" : ""} from this paper`}
      />

      {/* Subject breakdown */}
      {subjectCounts.length > 0 && (
        <div className="mb-8 p-5 rounded-2xl border border-border bg-card card-surface">
          <h2 className="text-sm font-semibold mb-3.5 flex items-center gap-2">
            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Subject Breakdown
          </h2>
          <div className="flex flex-wrap gap-2">
            {subjectCounts.map(([subj, count]) => (
              <span
                key={subj}
                className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border bg-background text-sm hover:border-primary/30 transition-colors"
              >
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br ${SUBJECT_COLORS[subj] || "from-gray-500 to-gray-600"} text-white text-[10px] font-bold`}>
                  {SUBJECT_ICONS[subj] || subj.slice(0, 2)}
                </span>
                <span className="font-medium text-xs">{subj}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((q, i) => (
          <Reveal key={q.id} delay={((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6}>
            <QuestionCard question={q} />
          </Reveal>
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
