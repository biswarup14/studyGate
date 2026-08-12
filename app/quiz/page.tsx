"use client";
import { useState, useEffect } from "react";
import { Question, IndexData } from "@/lib/types";
import { QuizRunner } from "@/components/QuizRunner";

const QUIZ_SIZES = [10, 20, 30, 50];

export default function QuizPage() {
  const [index, setIndex] = useState<IndexData | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // config
  const [subject, setSubject] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [year, setYear] = useState("");
  const [count, setCount] = useState(10);
  const [started, setStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/data/index.json").then((r) => r.json()),
      ...Array.from({ length: 27 }, (_, i) =>
        fetch(`/data/questions-${2000 + i}.json`)
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => [])
      ),
    ]).then(([idx, ...results]) => {
      setIndex(idx);
      setAllQuestions(results.flat());
      setLoading(false);
    });
  }, []);

  const startQuiz = () => {
    let pool = allQuestions.filter((q) => q.correctAnswer && q.correctAnswer.length > 0);
    if (subject) pool = pool.filter((q) => q.subject === subject);
    if (subtopic) pool = pool.filter((q) => q.subtopic === subtopic);
    if (year) pool = pool.filter((q) => q.year === parseInt(year));

    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count);
    if (shuffled.length > 0) {
      setQuizQuestions(shuffled);
      setStarted(true);
    }
  };

  const availableSubtopics = index?.subtopics[subject] || [];

  if (loading || !index) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Start a Quiz</h1>
        <p className="text-muted-foreground">
          Customize your practice session and test your knowledge.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium mb-2">Subject</label>
          <select
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setSubtopic(""); }}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
          >
            <option value="">All Subjects</option>
            {index.subjects.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} ({s.count})
              </option>
            ))}
          </select>
        </div>

        {/* Subtopic */}
        {availableSubtopics.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <select
              value={subtopic}
              onChange={(e) => setSubtopic(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            >
              <option value="">All Topics</option>
              {availableSubtopics.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} ({s.count})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Year */}
        <div>
          <label className="block text-sm font-medium mb-2">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
          >
            <option value="">All Years</option>
            {Object.keys(index.years)
              .sort((a, b) => Number(b) - Number(a))
              .map((y) => (
                <option key={y} value={y}>
                  {y} ({index.years[Number(y)]})
                </option>
              ))}
          </select>
        </div>

        {/* Count */}
        <div>
          <label className="block text-sm font-medium mb-2">Number of Questions</label>
          <div className="flex gap-2">
            {QUIZ_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setCount(s)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  count === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Start */}
        <button
          onClick={startQuiz}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
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
