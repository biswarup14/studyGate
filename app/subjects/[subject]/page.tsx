"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Question, SUBJECT_COLORS, SUBJECT_ICONS } from "@/lib/types";
import { QuestionCard } from "@/components/QuestionCard";

const PAGE_SIZE = 20;

export default function SubjectDetailPage() {
  const { subject } = useParams<{ subject: string }>();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [subtopic, setSubtopic] = useState("");

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
      setAllQuestions(results.flat());
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

  const shown = useMemo(() => {
    return subtopic ? filtered.filter((q) => q.subtopic === subtopic) : filtered;
  }, [filtered, subtopic]);

  const totalPages = Math.ceil(shown.length / PAGE_SIZE);
  const paginated = shown.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const actualSubject = filtered[0]?.subject || subjectName;

  const selectSubtopic = (value: string) => {
    setSubtopic(value);
    setPage(1);
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
      <div className="flex items-center gap-3 mb-6">
        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r ${SUBJECT_COLORS[actualSubject] || "from-gray-500 to-gray-600"} text-white text-sm font-bold`}>
          {SUBJECT_ICONS[actualSubject]} {actualSubject}
        </span>
        <span className="text-sm text-muted-foreground">
          {shown.length.toLocaleString()} question{shown.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Link href="/subjects" className="text-sm text-primary hover:underline">← All Subjects</Link>
        <Link href={`/quiz`} className="text-sm text-primary hover:underline">Quiz this subject →</Link>
      </div>

      {/* Subtopic chips */}
      {subtopics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => selectSubtopic("")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              subtopic === "" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
            }`}
          >
            All
          </button>
          {subtopics.map(([name, count]) => (
            <button
              key={name}
              onClick={() => selectSubtopic(name)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                subtopic === name ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
              }`}
            >
              {name}
              <span className={`ml-1 text-xs ${subtopic === name ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      )}

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
