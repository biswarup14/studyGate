"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Question } from "@/lib/types";
import { MathBlock } from "./MathBlock";
import { Timer } from "./Timer";
import { ProgressRing } from "./ProgressRing";

interface QuizState {
  currentIndex: number;
  answers: Record<number, string[]>;
  submitted: boolean;
  timePerQuestion: number;
}

export function QuizRunner({ questions }: { questions: Question[] }) {
  const [state, setState] = useState<QuizState>({
    currentIndex: 0,
    answers: {},
    submitted: false,
    timePerQuestion: 90,
  });
  const [startTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const current = questions[state.currentIndex];
  const selected = state.answers[state.currentIndex] || [];
  const progress = ((state.currentIndex + 1) / questions.length) * 100;

  const toggleOption = useCallback(
    (letter: string) => {
      if (state.submitted) return;
      setState((prev) => {
        const cur = prev.answers[prev.currentIndex] || [];
        const isMulti = current.type === "msq";
        const next = isMulti
          ? cur.includes(letter) ? cur.filter((l) => l !== letter) : [...cur, letter]
          : [letter];
        return { ...prev, answers: { ...prev.answers, [prev.currentIndex]: next } };
      });
    },
    [state.submitted, current]
  );

  const goNext = () => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, questions.length - 1),
    }));
  };

  const goPrev = () => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(prev.currentIndex - 1, 0),
    }));
  };

  const handleSubmit = () => {
    if (startTime !== null) {
      setElapsed(Math.round((Date.now() - startTime) / 1000));
    }
    setState((prev) => ({ ...prev, submitted: true }));
  };

  const handleTimeUp = () => {
    if (startTime !== null) {
      setElapsed(Math.round((Date.now() - startTime) / 1000));
    }
    setState((prev) => ({ ...prev, submitted: true }));
  };

  if (state.submitted) {
    return <QuizResults questions={questions} answers={state.answers} elapsed={elapsed} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Question {state.currentIndex + 1} / {questions.length}
          </span>
          <Timer initialMinutes={Math.ceil(questions.length * 1.5)} onTimeUp={handleTimeUp} />
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          Submit
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Question */}
      <div className="rounded-xl border border-border p-6 bg-card mb-6 card-surface animate-fade-in">
        <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
          <span>{current.year}</span>
          <span>·</span>
          <span>{current.subject}</span>
          <span>·</span>
          <span className={`px-1.5 py-0.5 rounded-full font-medium ${
            current.type === "mcq" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
            current.type === "msq" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
          }`}>
            {current.type.toUpperCase()}
          </span>
          {current.marks && <span>{current.marks} mark{current.marks > 1 ? "s" : ""}</span>}
        </div>

        <div className="text-base mb-6">
          <MathBlock text={current.text} />
        </div>

        {current.options.length > 0 && (
          <div className="space-y-2.5">
            {current.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const isSelected = selected.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => toggleOption(letter)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm hover-lift flex items-start gap-3 ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm"
                      : "border-border hover:border-primary/30 hover:bg-muted"
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-bold shrink-0 mt-0.5 text-xs ${
                    isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  }`}>{letter}</span>
                  <span className="flex-1 leading-relaxed">
                    <MathBlock text={opt} />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goPrev}
          disabled={state.currentIndex === 0}
          className="px-4 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted hover:border-primary/30 transition-all"
        >
          ← Previous
        </button>

        {state.currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-success text-white text-sm font-medium hover:bg-success/90 hover:shadow-lg hover:shadow-success/20 transition-all"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={goNext}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted hover:border-primary/30 transition-all"
          >
            Next →
          </button>
        )}
      </div>

      {/* Question navigator grid */}
      <div className="rounded-xl border border-border bg-card p-4 card-surface">
        <p className="text-xs text-muted-foreground mb-2">Questions</p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((_, i) => {
            const answered = !!state.answers[i];
            const isCurrent = i === state.currentIndex;
            return (
              <button
                key={i}
                onClick={() => setState((prev) => ({ ...prev, currentIndex: i }))}
                className={`w-8 h-8 rounded-lg text-xs font-medium border transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : answered
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "border-border text-muted-foreground hover:bg-muted hover:border-primary/30"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function QuizResults({
  questions,
  answers,
  elapsed,
}: {
  questions: Question[];
  answers: Record<number, string[]>;
  elapsed: number;
}) {
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  let correct = 0;
  let totalScore = 0;
  let maxScore = 0;

  questions.forEach((q, i) => {
    const marks = q.marks || 1;
    maxScore += marks;
    const ans = answers[i] || [];
    const isCorrect =
      q.correctAnswer &&
      q.type === "mcq"
        ? ans[0] === q.correctAnswer[0]
        : q.correctAnswer &&
          q.correctAnswer.length === ans.length &&
          q.correctAnswer.every((a) => ans.includes(a));
    if (isCorrect) {
      correct++;
      totalScore += marks;
    }
  });

  return (
    <div className="max-w-2xl mx-auto text-center py-8 animate-fade-in">
      <ProgressRing correct={correct} total={questions.length} size={120} />

      <h2 className="text-2xl font-bold mt-6 mb-2">Quiz Complete!</h2>
      <p className="text-muted-foreground mb-6">
        {correct}/{questions.length} correct · {totalScore}/{maxScore} marks · {mins}m {secs}s
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="rounded-xl border border-border bg-card p-4 card-surface">
          <div className="text-xl font-bold text-primary">{correct}/{questions.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Correct</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 card-surface">
          <div className="text-xl font-bold text-success">
            {questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">Accuracy</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 card-surface">
          <div className="text-xl font-bold text-amber-500">{mins}m {secs}s</div>
          <div className="text-xs text-muted-foreground mt-1">Time</div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <Link
          href="/quiz"
          className="px-6 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted hover:border-primary/30 transition-all"
        >
          New Quiz
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          Retry
        </button>
      </div>

      <div className="text-left space-y-3">
        <h3 className="font-semibold text-lg">Review</h3>
        {questions.map((q, i) => {
          const ans = answers[i] || [];
          const isCorrect =
            q.correctAnswer &&
            q.type === "mcq"
              ? ans[0] === q.correctAnswer[0]
              : q.correctAnswer &&
                q.correctAnswer.length === ans.length &&
                q.correctAnswer.every((a) => ans.includes(a));

          return (
            <div
              key={i}
              className={`p-4 rounded-xl border transition-all ${
                isCorrect ? "border-success/30 bg-success/5" : "border-error/30 bg-error/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isCorrect ? "bg-success text-white" : "bg-error text-white"
                }`}>
                  {isCorrect ? "✓" : "✗"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Q{i + 1} · {q.year} · {q.subject}
                </span>
              </div>
              <MathBlock text={q.text} className="text-sm mb-2" />
              {!isCorrect && q.correctAnswer && (
                <p className="text-xs text-error">
                  Correct: {q.correctAnswer.join(", ")} · Your answer: {ans.join(", ") || "—"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
