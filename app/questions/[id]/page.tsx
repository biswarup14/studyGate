"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Question, SUBJECT_COLORS, SUBJECT_ICONS } from "@/lib/types";
import { MathBlock } from "@/components/MathBlock";
import { useProgress } from "@/components/useProgress";

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const { recordAttempt, mounted } = useProgress();

  useEffect(() => {
    Promise.all(
      Array.from({ length: 27 }, (_, i) =>
        fetch(`/data/questions-${2000 + i}.json`)
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => [])
      )
    ).then((results) => {
      const all = results.flat();
      const q = all.find((item: Question) => item.id === id);
      setQuestion(q || null);
      setLoading(false);
    });
  }, [id]);

  const checkAnswer = useCallback(() => {
    if (!question) return;
    setShowAnswer(true);
    if (mounted) {
      const isCorrect =
        question.correctAnswer &&
        question.type === "mcq"
          ? selected[0] === question.correctAnswer[0]
          : question.correctAnswer &&
            question.correctAnswer.length === selected.length &&
            question.correctAnswer.every((a) => selected.includes(a));
      recordAttempt(question.id, !!isCorrect);
    }
  }, [question, selected, mounted, recordAttempt]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">Question not found.</p>
        <Link href="/questions" className="text-primary hover:underline">Browse all questions →</Link>
      </div>
    );
  }

  const letterOf = (i: number) => String.fromCharCode(65 + i);
  const isCorrectAnswer = (letter: string) =>
    question.correctAnswer && question.correctAnswer.includes(letter);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/questions" className="hover:text-primary">Questions</Link>
        <span>/</span>
        <span className="text-foreground">{question.id}</span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg bg-gradient-to-r ${SUBJECT_COLORS[question.subject] || "from-gray-500 to-gray-600"} text-white text-xs font-bold`}>
          {SUBJECT_ICONS[question.subject]} {question.subject}
        </span>
        <span className="text-sm text-muted-foreground">
          {question.year}{question.set ? ` Set ${question.set}` : ""}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
          question.type === "mcq" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
          question.type === "msq" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
        }`}>
          {question.type.toUpperCase()}
        </span>
        {question.marks && (
          <span className="text-xs text-muted-foreground">{question.marks} mark{question.marks > 1 ? "s" : ""}</span>
        )}
        {question.difficulty && (
          <span className={`text-xs ${
            question.difficulty === "easy" ? "text-success" :
            question.difficulty === "hard" ? "text-error" : "text-muted-foreground"
          }`}>
            {question.difficulty}
          </span>
        )}
      </div>

      {/* Question text */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <div className="text-base leading-relaxed">
          <MathBlock text={question.text} />
        </div>
      </div>

      {/* Options */}
      {question.options.length > 0 && (
        <div className="space-y-2 mb-6">
          {question.options.map((opt, i) => {
            const letter = letterOf(i);
            const isSelected = selected.includes(letter);
            const correct = showAnswer && isCorrectAnswer(letter);
            const wrong = showAnswer && isSelected && !isCorrectAnswer(letter);

            return (
              <button
                key={letter}
                onClick={() => {
                  if (showAnswer) return;
                  setSelected((prev) =>
                    question.type === "msq"
                      ? prev.includes(letter) ? prev.filter((l) => l !== letter) : [...prev, letter]
                      : [letter]
                  );
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${
                  correct
                    ? "border-success bg-success/10 ring-2 ring-success/30"
                    : wrong
                    ? "border-error bg-error/10 ring-2 ring-error/30"
                    : isSelected
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/30 hover:bg-muted"
                }`}
              >
                <span className="font-medium mr-3">{letter}.</span>
                <MathBlock text={opt} />
              </button>
            );
          })}
        </div>
      )}

      {/* NAT input */}
      {question.type === "nat" && !showAnswer && (
        <div className="mb-6">
          <input
            type="text"
            value={selected[0] || ""}
            onChange={(e) => setSelected([e.target.value])}
            placeholder="Enter your answer"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mb-8">
        {!showAnswer ? (
          <button
            onClick={checkAnswer}
            disabled={selected.length === 0}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 hover:bg-primary/90"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={() => { setShowAnswer(false); setSelected([]); }}
            className="px-6 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Answer reveal */}
      {showAnswer && question.correctAnswer && (
        <div className="rounded-xl border border-success/30 bg-success/5 p-6 mb-6">
          <h3 className="font-bold text-success mb-2">Correct Answer</h3>
          <div className="space-y-1">
            {question.correctAnswer.map((a) => (
              <p key={a} className="text-sm font-medium">{a}</p>
            ))}
          </div>
        </div>
      )}

      {showAnswer && question.explanation && (
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <h3 className="font-bold mb-2">Explanation</h3>
          <div className="text-sm text-foreground/80">
            <MathBlock text={question.explanation} />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Link href="/questions" className="text-sm text-primary hover:underline">← All Questions</Link>
        <div className="flex gap-3">
          {question.year > 2000 && (
            <Link href={`/years/${question.year}`} className="text-sm text-primary hover:underline">
              More from {question.year}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
