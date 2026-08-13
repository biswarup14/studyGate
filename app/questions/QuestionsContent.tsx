"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Question } from "@/lib/types";
import { QuestionCard } from "@/components/QuestionCard";
import { sortNewestFirst } from "@/lib/sort";

const PAGE_SIZE = 20;
const SUBJECTS = [
  "General Aptitude",
  "Engineering Mathematics",
  "Discrete Mathematics",
  "Digital Logic",
  "Computer Organization",
  "Programming in C",
  "Data Structures",
  "Algorithms",
  "Theory of Computation",
  "Compiler Design",
  "Operating Systems",
  "Databases (DBMS)",
  "Computer Networks",
  "Unclassified",
];
const YEARS = Array.from({ length: 27 }, (_, i) => 2000 + i).reverse();
const TYPES = ["mcq", "msq", "nat"] as const;

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "border-border hover:bg-muted hover:border-primary/30"
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-1 text-xs ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

export function QuestionsContent() {
  const searchParams = useSearchParams();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [subject, setSubject] = useState(searchParams.get("subject") || "");
  const [subtopic, setSubtopic] = useState(searchParams.get("subtopic") || "");
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
      setAllQuestions(results.flat().sort(sortNewestFirst));
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
    if (subtopic) q = q.filter((item) => item.subtopic === subtopic);
    if (year) q = q.filter((item) => item.year === parseInt(year));
    if (type) q = q.filter((item) => item.type === type);
    if (hasAnswer === "yes") q = q.filter((item) => item.correctAnswer && item.correctAnswer.length > 0);
    if (hasAnswer === "no") q = q.filter((item) => !item.correctAnswer || item.correctAnswer.length === 0);
    return q;
  }, [allQuestions, search, subject, subtopic, year, type, hasAnswer]);

  const availableSubtopics = useMemo(() => {
    if (!subject) return [];
    const set = new Set<string>();
    allQuestions.forEach((q) => {
      if (q.subject === subject && q.subtopic) set.add(q.subtopic);
    });
    return [...set].sort();
  }, [allQuestions, subject]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changeSubject = (value: string) => {
    setSubject(value);
    setSubtopic("");
    setPage(1);
  };

  const hasFilters = subject || subtopic || year || type || hasAnswer;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="skeleton h-9 w-64 mb-6" />
        <div className="skeleton h-11 w-full mb-6" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="skeleton h-44" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Browse Questions</h1>

      {/* Search */}
      <div className="relative mb-5">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search questions, subjects, or keywords…"
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50"
        />
      </div>

      {/* Subject chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        <FilterChip active={subject === ""} onClick={() => changeSubject("")} label="All Subjects" />
        {SUBJECTS.map((s) => (
          <FilterChip key={s} active={subject === s} onClick={() => changeSubject(s)} label={s} />
        ))}
      </div>

      {/* Topic chips */}
      {availableSubtopics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          <FilterChip active={subtopic === ""} onClick={() => { setSubtopic(""); setPage(1); }} label="All Topics" />
          {availableSubtopics.map((s) => (
            <FilterChip key={s} active={subtopic === s} onClick={() => { setSubtopic(s); setPage(1); }} label={s} />
          ))}
        </div>
      )}

      {/* Year chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        <FilterChip active={year === ""} onClick={() => { setYear(""); setPage(1); }} label="All Years" />
        {YEARS.map((y) => (
          <FilterChip key={y} active={year === String(y)} onClick={() => { setYear(String(y)); setPage(1); }} label={String(y)} />
        ))}
      </div>

      {/* Type + status chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterChip active={type === ""} onClick={() => { setType(""); setPage(1); }} label="All Types" />
        {TYPES.map((t) => (
          <FilterChip key={t} active={type === t} onClick={() => { setType(t); setPage(1); }} label={t.toUpperCase()} />
        ))}
        <FilterChip active={hasAnswer === ""} onClick={() => { setHasAnswer(""); setPage(1); }} label="Any Status" />
        <FilterChip active={hasAnswer === "yes"} onClick={() => { setHasAnswer("yes"); setPage(1); }} label="Has Answer" />
        <FilterChip active={hasAnswer === "no"} onClick={() => { setHasAnswer("no"); setPage(1); }} label="Missing Answer" />
        {hasFilters && (
          <button
            onClick={() => { changeSubject(""); setYear(""); setType(""); setHasAnswer(""); setPage(1); }}
            className="px-3 py-1.5 rounded-full text-sm font-medium text-primary hover:underline"
          >
            Clear all filters
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
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-muted-foreground mb-4">No questions match your filters.</p>
          <button
            onClick={() => { changeSubject(""); setYear(""); setType(""); setHasAnswer(""); setSearch(""); setPage(1); }}
            className="text-primary text-sm font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-muted hover:border-primary/30 transition-all"
          >
            ← Prev
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-muted hover:border-primary/30 transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
