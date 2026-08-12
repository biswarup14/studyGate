"use client";
import { useState, useCallback, useRef } from "react";
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
  const startTimeRef = useRef<number>(Date.now());
  const [state, setState] = useState<QuizState>({
    currentIndex: 0,
    answers: {},
    submitted: false,
    timePerQuestion: 90,
  });

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
    [state.submitted, state.currentIndex, current]
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
    setState((prev) => ({ ...prev, submitted: true }));
  };

  const handleTimeUp = () => {
    setState((prev) => ({ ...prev, submitted: true }));
  };

  if (state.submitted) {
    return <QuizResults questions={questions} answers={state.answers} startTime={startTimeRef.current} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Question {state.currentIndex + 1} / {questions.length}
          </span>
          <Timer initialMinutes={Math.ceil(questions.length * 1.5)} onTimeUp={handleTimeUp} />
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          Submit
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="rounded-xl border border-border p-6 bg-card mb-6">
        <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
          <span>{current.year}</span>
          <span>·</span>
          <span>{current.subject}</span>
          <span>·</span>
          <span className={`px-1.5 py-0.5 rounded font-medium ${
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
          <div className="space-y-2">
            {current.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const isSelected = selected.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => toggleOption(letter)}
                  className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                      : "border-border hover:border-primary/30 hover:bg-muted"
                  }`}
                >
                  <span className="font-medium mr-2">{letter}.</span>
                  <MathBlock text={opt} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={state.currentIndex === 0}
          className="px-4 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted"
        >
          ← Previous
        </button>

        <div className="flex gap-1">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setState((prev) => ({ ...prev, currentIndex: i }))}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === state.currentIndex
                  ? "bg-primary"
                  : state.answers[i]
                  ? "bg-primary/40"
                  : "bg-border"
              }`}
            />
          ))}
        </div>

        {state.currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-success text-white text-sm font-medium hover:bg-success/90"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={goNext}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

function QuizResults({
  questions,
  answers,
  startTime,
}: {
  questions: Question[];
  answers: Record<number, string[]>;
  startTime: number;
}) {
  const [elapsed, setElapsed] = useState(0);

  // Compute elapsed from ref value passed in (no impure call in render)
  const computeElapsed = useCallback(() => {
    return Math.round((Date.now() - startTime) / 1000);
  }, [startTime]);

  // Store computed value in state after mount
  const [computed, setComputed] = useState(false);
  if (!computed) {
    setElapsed(computeElapsed());
    setComputed(true);
  }

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
    <div className="max-w-2xl mx-auto text-center py-8">
      <ProgressRing correct={correct} total={questions.length} size={120} />

      <h2 className="text-2xl font-bold mt-6 mb-2">Quiz Complete!</h2>
      <p className="text-muted-foreground mb-6">
        {correct}/{questions.length} correct · {totalScore}/{maxScore} marks · {mins}m {secs}s
      </p>

      <div className="flex justify-center gap-4 mb-8">
        <Link
          href="/quiz"
          className="px-6 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted"
        >
          New Quiz
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          Retry
        </button>
      </div>

      <div className="text-left space-y-4">
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
              className={`p-4 rounded-xl border ${
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
