"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Question, SUBJECT_COLORS, SUBJECT_ICONS } from "@/lib/types";
import { QuestionCard } from "@/components/QuestionCard";
import { FilterDropdown } from "@/components/FilterDropdown";
import { PageHeader } from "@/components/PageHeader";
import { sortNewestFirst } from "@/lib/sort";

const PAGE_SIZE = 20;

export default function SubjectDetailPage() {
  return (
    <Suspense fallback={<SubjectDetailSkeleton />}>
      <SubjectDetailContent />
    </Suspense>
  );
}

function SubjectDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="skeleton h-9 w-40" />
        <div className="skeleton h-5 w-24" />
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="skeleton h-8 w-24" />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton h-44" />
        ))}
      </div>
    </div>
  );
}

function SubjectDetailContent() {
  const { subject } = useParams<{ subject: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [subtopic, setSubtopic] = useState(searchParams.get("subtopic") || "");
  const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || "");
  const [branch, setBranch] = useState(searchParams.get("branch") || "");
  const [year, setYear] = useState(searchParams.get("year") || "");
  const DIFFICULTIES = ["easy", "medium", "hard"] as const;

  // Keep filters + page in sync with the URL so back/forward restores the exact view
  useEffect(() => {
    const params = new URLSearchParams();
    if (subtopic) params.set("subtopic", subtopic);
    if (difficulty) params.set("difficulty", difficulty);
    if (branch) params.set("branch", branch);
    if (year) params.set("year", year);
    if (page > 1) params.set("page", String(page));
    const target = params.toString();
    const current = window.location.search.replace(/^\?/, "");
    if (target !== current) {
      router.replace(`/subjects/${subject}${target ? `?${target}` : ""}`, { scroll: false });
    }
  }, [router, subject, subtopic, difficulty, branch, year, page]);

  // decode slug back to subject name
  const subjectName = subject
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  useEffect(() => {
    Promise.all(
      Array.from({ length: 27 }, (_, i) =>
        fetch(`/data/questions-${2000 + i}.json`)
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => [])
      )
    ).then((results) => {
      setAllQuestions(results.flat().sort(sortNewestFirst));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return allQuestions.filter(
      (q) => q.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === subject
    );
  }, [allQuestions, subject]);

  const subtopics = useMemo(() => {
    const counts = new Map<string, number>();
    filtered.forEach((q) => {
      if (q.subtopic) counts.set(q.subtopic, (counts.get(q.subtopic) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  const branches = useMemo(() => {
    const counts = new Map<string, number>();
    filtered.forEach((q) => {
      if (q.branch) counts.set(q.branch, (counts.get(q.branch) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  const years = useMemo(() => {
    const counts = new Map<string, number>();
    filtered.forEach((q) => {
      counts.set(String(q.year), (counts.get(String(q.year)) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [filtered]);

  const shown = useMemo(() => {
    let qs = filtered;
    if (subtopic) qs = qs.filter((q) => q.subtopic === subtopic);
    if (difficulty) qs = qs.filter((q) => q.difficulty === difficulty);
    if (branch) qs = qs.filter((q) => q.branch === branch);
    if (year) qs = qs.filter((q) => q.year === parseInt(year));
    return qs;
  }, [filtered, subtopic, difficulty, branch, year]);

  const totalPages = Math.ceil(shown.length / PAGE_SIZE);
  const paginated = shown.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const actualSubject = filtered[0]?.subject || subjectName;

  const difficultyCounts = useMemo(() => {
    const counts = { easy: 0, medium: 0, hard: 0 };
    const base = subtopic ? filtered.filter((q) => q.subtopic === subtopic) : filtered;
    base.forEach((q) => {
      if (q.difficulty in counts) counts[q.difficulty as keyof typeof counts] += 1;
    });
    return counts;
  }, [filtered, subtopic]);

  const selectSubtopic = (value: string) => {
    setSubtopic(value);
    setPage(1);
  };

  const selectDifficulty = (value: string) => {
    setDifficulty(value);
    setPage(1);
  };

  const selectBranch = (value: string) => {
    setBranch(value);
    setPage(1);
  };

  const selectYear = (value: string) => {
    setYear(value);
    setPage(1);
  };

  if (loading) {
    return <SubjectDetailSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        back={{ href: "/subjects", label: "All Subjects" }}
        icon={<span>{SUBJECT_ICONS[actualSubject] || actualSubject.slice(0, 2)}</span>}
        iconClass={`bg-gradient-to-br ${SUBJECT_COLORS[actualSubject] || "from-gray-500 to-gray-600"}`}
        title={actualSubject}
        subtitle={`${shown.length.toLocaleString()} question${shown.length !== 1 ? "s" : ""} available`}
        right={
          <Link
            href={`/quiz?subject=${encodeURIComponent(actualSubject)}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Quiz this subject
          </Link>
        }
      />

      {/* Filters row: dropdowns left, difficulty chips right */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Left: dropdown filters + reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          {subtopics.length > 0 && (
            <FilterDropdown
              label="Topic"
              value={subtopic}
              placeholder="All Topics"
              onChange={selectSubtopic}
              options={subtopics.map(([name, count]) => ({ value: name, label: name, count }))}
            />
          )}

          {branches.length > 1 && (
            <FilterDropdown
              label="Branch"
              value={branch}
              placeholder="All Branches"
              onChange={selectBranch}
              options={branches.map(([name, count]) => ({ value: name, label: name, count }))}
            />
          )}

          <FilterDropdown
            label="Year"
            value={year}
            placeholder="All Years"
            onChange={selectYear}
            options={years.map(([name, count]) => ({ value: name, label: name, count }))}
          />

          {(subtopic || branch || year) && (
            <button
              onClick={() => { selectSubtopic(""); selectBranch(""); selectYear(""); }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted hover:border-primary/30 transition-all hover-lift"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset
            </button>
          )}
        </div>

        {/* Right: difficulty chips */}
        <div className="flex flex-wrap items-center gap-2">
          {(["", ...DIFFICULTIES] as const).map((d) => {
            const label = d === "" ? "All" : d[0].toUpperCase() + d.slice(1);
            const count =
              d === ""
                ? difficultyCounts.easy + difficultyCounts.medium + difficultyCounts.hard
                : difficultyCounts[d];
            return (
              <button
                key={d}
                onClick={() => selectDifficulty(d)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all hover-lift ${
                  difficulty === d ? "bg-primary text-primary-foreground border-primary shadow-sm" : "border-border hover:bg-muted hover:border-primary/30"
                }`}
              >
                {label}
                <span className={`ml-1 text-xs ${difficulty === d ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>

      {shown.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No questions found for this subject.
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
