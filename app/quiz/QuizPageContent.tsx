"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Question, IndexData } from "@/lib/types";
import { QuizRunner } from "@/components/QuizRunner";
import { PageHeader } from "@/components/PageHeader";
import { Select } from "@/components/Select";

const QUIZ_SIZES = [10, 20, 30, 50];

export function QuizPageContent() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
          <div className="text-center mb-8">
            <div className="skeleton h-10 w-56 mx-auto mb-3" />
            <div className="skeleton h-5 w-72 mx-auto" />
          </div>
          <div className="skeleton h-96" />
        </div>
      }
    >
      <QuizConfig />
    </Suspense>
  );
}

function QuizConfig() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [index, setIndex] = useState<IndexData | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // config
  const [subject, setSubject] = useState(searchParams.get("subject") || "");
  const [subtopic, setSubtopic] = useState("");
  const [year, setYear] = useState("");
  const [count, setCount] = useState(() => {
    const c = parseInt(searchParams.get("count") || "10");
    return QUIZ_SIZES.includes(c) ? c : 10;
  });
  const [started, setStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/data/index.json").then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
      fetch("/data/questions-all.json").then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    ])
      .then(([idx, questions]) => {
        setIndex(idx);
        setAllQuestions(questions);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load quiz data:", err);
        setLoading(false);
      });
  }, []);

  const availableSubtopics = index?.subtopics[subject] || [];

  const poolSize = useMemo(() => {
    let pool = allQuestions.filter((q) => q.correctAnswer && q.correctAnswer.length > 0);
    if (subject) pool = pool.filter((q) => q.subject === subject);
    if (subtopic) pool = pool.filter((q) => q.subtopic === subtopic);
    if (year) pool = pool.filter((q) => q.year === parseInt(year));
    return pool.length;
  }, [allQuestions, subject, subtopic, year]);

  const effectiveCount = Math.min(count, poolSize || count);

  const startQuiz = () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent("/quiz")}`);
      return;
    }
    let pool = allQuestions.filter((q) => q.correctAnswer && q.correctAnswer.length > 0);
    if (subject) pool = pool.filter((q) => q.subject === subject);
    if (subtopic) pool = pool.filter((q) => q.subtopic === subtopic);
    if (year) pool = pool.filter((q) => q.year === parseInt(year));

    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, effectiveCount);
    if (shuffled.length > 0) {
      setQuizQuestions(shuffled);
      setStarted(true);
    }
  };

  if (loading || !index) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <div className="skeleton h-10 w-56 mx-auto mb-3" />
          <div className="skeleton h-5 w-72 mx-auto" />
        </div>
        <div className="skeleton h-96" />
      </div>
    );
  }

  if (started) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <QuizRunner questions={quizQuestions} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <PageHeader
        title="Practice Quiz"
        subtitle="Customize your practice session and test your knowledge."
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 card-surface">
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium mb-2">Subject</label>
          <Select
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setSubtopic(""); }}
          >
            <option value="">All Subjects</option>
            {index.subjects.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} ({s.count})
              </option>
            ))}
          </Select>
        </div>

        {/* Subtopic */}
        {availableSubtopics.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <Select value={subtopic} onChange={(e) => setSubtopic(e.target.value)}>
              <option value="">All Topics</option>
              {availableSubtopics.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} ({s.count})
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Year */}
        <div>
          <label className="block text-sm font-medium mb-2">Year</label>
          <Select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">All Years</option>
            {Object.keys(index.years)
              .sort((a, b) => Number(b) - Number(a))
              .map((y) => (
                <option key={y} value={y}>
                  {y} ({index.years[Number(y)]})
                </option>
              ))}
          </Select>
        </div>

        {/* Count */}
        <div>
          <label className="block text-sm font-medium mb-2">Number of Questions</label>
          <div className="flex gap-2">
            {QUIZ_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setCount(s)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all hover-lift ${
                  count === s
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "border-border hover:bg-muted hover:border-primary/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Pool hint */}
        {poolSize > 0 && (
          <p className="text-xs text-muted-foreground text-center -mt-2">
            {poolSize.toLocaleString()} question{poolSize !== 1 ? "s" : ""} available
            {effectiveCount < count && (
              <> — using {effectiveCount} for this quiz</>
            )}
          </p>
        )}

        {/* Start */}
        <button
          onClick={startQuiz}
          disabled={poolSize === 0}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-40 disabled:hover:shadow-none transition-all"
        >
          Start Quiz
        </button>

        <p className="text-xs text-muted-foreground text-center">
          Only questions with available answers are included. Randomized order.
        </p>
      </div>
    </div>
  );
}
