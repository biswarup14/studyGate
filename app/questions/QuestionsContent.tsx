"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Question } from "@/lib/types";
import { QuestionCard } from "@/components/QuestionCard";

const PAGE_SIZE = 20;
const SUBJECTS = [
  "Discrete Mathematics",
  "Programming",
  "Data Structures",
  "Algorithms",
  "Theory of Computation",
  "Compiler Design",
  "Operating System",
  "Databases",
  "Computer Networks",
  "Digital Logic",
  "Computer Organization",
  "Engineering Mathematics",
  "General Aptitude",
  "Unclassified",
];
const YEARS = Array.from({ length: 27 }, (_, i) => 2000 + i).reverse();
const TYPES = ["mcq", "msq", "nat"] as const;

export function QuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [subject, setSubject] = useState(searchParams.get("subject") || "");
  const [year, setYear] = useState(searchParams.get("year") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [hasAnswer, setHasAnswer] = useState(searchParams.get("answered") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));

  useEffect(() => {
    Promise.all(
      Array.from({ length: 27 }, (_, i) =>
        fetch(`/data/questions-${2000 + i}.json`)
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => [])
      )
    ).then((results) => {
      setAllQuestions(results.flat());
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let q = allQuestions;
    if (search) {
      const s = search.toLowerCase();
      q = q.filter(
        (item) =>
          item.text.toLowerCase().includes(s) ||
          item.subject.toLowerCase().includes(s) ||
          item.options.some((o) => o.toLowerCase().includes(s))
      );
    }
    if (subject) q = q.filter((item) => item.subject === subject);
    if (year) q = q.filter((item) => item.year === parseInt(year));
    if (type) q = q.filter((item) => item.type === type);
    if (hasAnswer === "yes") q = q.filter((item) => item.correctAnswer && item.correctAnswer.length > 0);
    if (hasAnswer === "no") q = q.filter((item) => !item.correctAnswer || item.correctAnswer.length === 0);
    return q;
  }, [allQuestions, search, subject, year, type, hasAnswer]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/questions?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Browse Questions</h1>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search questions, subjects, or keywords…"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <select
          value={subject}
          onChange={(e) => { setSubject(e.target.value); setPage(1); }}
          className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm"
        >
          <option value="">All Subjects</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => { setYear(e.target.value); setPage(1); }}
          className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm"
        >
          <option value="">All Years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
          className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm"
        >
          <option value="">All Types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t.toUpperCase()}</option>
          ))}
        </select>

        <select
          value={hasAnswer}
          onChange={(e) => { setHasAnswer(e.target.value); setPage(1); }}
          className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm"
        >
          <option value="">Any Status</option>
          <option value="yes">Has Answer</option>
          <option value="no">Missing Answer</option>
        </select>

        {(subject || year || type || hasAnswer) && (
          <button
            onClick={() => { setSubject(""); setYear(""); setType(""); setHasAnswer(""); setPage(1); }}
            className="px-3 py-1.5 rounded-lg text-sm text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        {filtered.length.toLocaleString()} question{filtered.length !== 1 ? "s" : ""} found
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No questions match your filters.
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
