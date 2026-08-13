"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Question } from "@/lib/types";
import { QuestionCard } from "@/components/QuestionCard";
import { FilterDropdown } from "@/components/FilterDropdown";
import { PageHeader } from "@/components/PageHeader";
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
];
const YEARS = Array.from({ length: 27 }, (_, i) => 2000 + i).reverse();
const TYPES = ["mcq", "msq", "nat"] as const;

export function QuestionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [subject, setSubject] = useState(searchParams.get("subject") || "");
  const [subtopic, setSubtopic] = useState(searchParams.get("subtopic") || "");
  const [branch, setBranch] = useState(searchParams.get("branch") || "");
  const [year, setYear] = useState(searchParams.get("year") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [hasAnswer, setHasAnswer] = useState(searchParams.get("answered") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));

  // Keep filters + page in sync with the URL so back/forward restores the exact view
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (subject) params.set("subject", subject);
    if (subtopic) params.set("subtopic", subtopic);
    if (branch) params.set("branch", branch);
    if (year) params.set("year", year);
    if (type) params.set("type", type);
    if (hasAnswer) params.set("answered", hasAnswer);
    if (page > 1) params.set("page", String(page));
    const target = params.toString();
    const current = window.location.search.replace(/^\?/, "");
    if (target !== current) {
      router.replace(`/questions${target ? `?${target}` : ""}`, { scroll: false });
    }
  }, [router, search, subject, subtopic, branch, year, type, hasAnswer, page]);

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
    if (branch) q = q.filter((item) => item.branch === branch);
    if (year) q = q.filter((item) => item.year === parseInt(year));
    if (type) q = q.filter((item) => item.type === type);
    if (hasAnswer === "yes") q = q.filter((item) => item.correctAnswer && item.correctAnswer.length > 0);
    if (hasAnswer === "no") q = q.filter((item) => !item.correctAnswer || item.correctAnswer.length === 0);
    return q;
  }, [allQuestions, search, subject, subtopic, branch, year, type, hasAnswer]);

  const availableSubtopics = useMemo(() => {
    if (!subject) return [];
    const set = new Set<string>();
    allQuestions.forEach((q) => {
      if (q.subject === subject && q.subtopic) set.add(q.subtopic);
    });
    return [...set].sort();
  }, [allQuestions, subject]);

  const subjectCounts = useMemo(() => {
    const c = new Map<string, number>();
    allQuestions.forEach((q) => c.set(q.subject, (c.get(q.subject) || 0) + 1));
    return c;
  }, [allQuestions]);

  const yearCounts = useMemo(() => {
    const c = new Map<string, number>();
    allQuestions.forEach((q) => c.set(String(q.year), (c.get(String(q.year)) || 0) + 1));
    return c;
  }, [allQuestions]);

  const typeCounts = useMemo(() => {
    const c = new Map<string, number>();
    allQuestions.forEach((q) => c.set(q.type, (c.get(q.type) || 0) + 1));
    return c;
  }, [allQuestions]);

  const statusCounts = useMemo(() => {
    let yes = 0;
    allQuestions.forEach((q) => {
      if (q.correctAnswer && q.correctAnswer.length > 0) yes += 1;
    });
    return { yes, no: allQuestions.length - yes };
  }, [allQuestions]);

  const availableBranches = useMemo(() => {
    if (!subject) return [];
    const counts = new Map<string, number>();
    allQuestions.forEach((q) => {
      if (q.subject === subject && q.branch)
        counts.set(q.branch, (counts.get(q.branch) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [allQuestions, subject]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changeSubject = (value: string) => {
    setSubject(value);
    setSubtopic("");
    setBranch("");
    setPage(1);
  };

  const clearAll = () => {
    changeSubject("");
    setYear("");
    setType("");
    setHasAnswer("");
    setSearch("");
    setPage(1);
  };

  const hasFilters = subject || subtopic || branch || year || type || hasAnswer || search;

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
      <PageHeader
        title="Browse Questions"
        subtitle={`Search and filter ${allQuestions.length.toLocaleString()} questions from 2000–2026.`}
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />

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

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 mb-6">
        <FilterDropdown
          label="Subject"
          value={subject}
          placeholder="All Subjects"
          onChange={changeSubject}
          options={SUBJECTS.map((s) => ({ value: s, label: s, count: subjectCounts.get(s) || 0 }))}
        />

        {availableSubtopics.length > 0 && (
          <FilterDropdown
            label="Topic"
            value={subtopic}
            placeholder="All Topics"
            onChange={(v) => { setSubtopic(v); setPage(1); }}
            options={availableSubtopics.map((s) => {
              const count = allQuestions.filter((q) => q.subject === subject && q.subtopic === s).length;
              return { value: s, label: s, count };
            })}
          />
        )}

        {availableBranches.length > 1 && (
          <FilterDropdown
            label="Branch"
            value={branch}
            placeholder="All Branches"
            onChange={(v) => { setBranch(v); setPage(1); }}
            options={availableBranches.map(([name, count]) => ({ value: name, label: name, count }))}
          />
        )}

        <FilterDropdown
          label="Year"
          value={year}
          placeholder="All Years"
          onChange={(v) => { setYear(v); setPage(1); }}
          options={YEARS.map((y) => ({ value: String(y), label: String(y), count: yearCounts.get(String(y)) || 0 }))}
        />

        <FilterDropdown
          label="Type"
          value={type}
          placeholder="All Types"
          onChange={(v) => { setType(v); setPage(1); }}
          options={TYPES.map((t) => ({ value: t, label: t.toUpperCase(), count: typeCounts.get(t) || 0 }))}
        />

        <FilterDropdown
          label="Status"
          value={hasAnswer}
          placeholder="Any Status"
          onChange={(v) => { setHasAnswer(v); setPage(1); }}
          options={[
            { value: "yes", label: "Has Answer", count: statusCounts.yes },
            { value: "no", label: "Missing Answer", count: statusCounts.no },
          ]}
        />

        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-error/30 text-sm font-medium text-error hover:bg-error/10 transition-all hover-lift"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{filtered.length.toLocaleString()}</span>
          question{filtered.length !== 1 ? "s" : ""} found
        </span>
        {hasFilters && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
            Filters active
          </span>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-2xl bg-muted text-muted-foreground">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="font-semibold text-foreground mb-1">No questions match your filters</p>
          <p className="text-muted-foreground text-sm mb-4">Try adjusting your search or clearing some filters.</p>
          <button
            onClick={clearAll}
            className="inline-flex px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted hover:border-primary/30 transition-all"
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
