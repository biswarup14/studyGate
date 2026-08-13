"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Question, SUBJECT_COLORS, SUBJECT_ICONS, SUBTOPIC_COLORS } from "@/lib/types";
import { MathBlock } from "@/components/MathBlock";
import { useProgress } from "@/components/useProgress";
import { useSession } from "next-auth/react";

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const { recordAttempt, mounted } = useProgress();
  const { data: session } = useSession();

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
    if (mounted && session?.user) {
      const isCorrect =
        question.correctAnswer &&
        question.type === "mcq"
          ? selected[0] === question.correctAnswer[0]
          : question.correctAnswer &&
            question.correctAnswer.length === selected.length &&
            question.correctAnswer.every((a) => selected.includes(a));
      recordAttempt(question.id, !!isCorrect);
    }
  }, [question, selected, mounted, session, recordAttempt]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <div className="skeleton h-5 w-48 mb-6" />
        <div className="flex flex-wrap gap-2 mb-5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="skeleton h-6 w-20" />
          ))}
        </div>
        <div className="skeleton h-40 mb-6" />
        <div className="space-y-2.5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="skeleton h-14" />
          ))}
        </div>
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
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">
        <span className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${SUBJECT_COLORS[question.subject] || "from-gray-500 to-gray-600"} text-white text-xs font-bold shadow-sm`}>
          {SUBJECT_ICONS[question.subject]} {question.subject}
        </span>
        {question.subtopic && (
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${SUBTOPIC_COLORS[question.subtopic] || "bg-muted text-muted-foreground"}`}>
            {question.subtopic}
          </span>
        )}
        <span className="text-sm text-muted-foreground">
          {question.year}{question.set ? ` Set ${question.set}` : ""}
        </span>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
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
          <span className={`text-xs inline-flex items-center gap-1.5 capitalize ${
            question.difficulty === "easy" ? "text-success" :
            question.difficulty === "hard" ? "text-error" : "text-muted-foreground"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              question.difficulty === "easy" ? "bg-success" :
              question.difficulty === "hard" ? "bg-error" : "bg-warning"
            }`} />
            {question.difficulty}
          </span>
        )}
      </div>

      {/* Question text */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6 card-surface animate-slide-up">
        <div className="text-base leading-relaxed">
          <MathBlock text={question.text} />
        </div>
      </div>

      {/* Options */}
      {question.options.length > 0 && (
        <div className="space-y-2.5 mb-6">
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
                className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all text-sm hover-lift flex items-start gap-3 ${
                  correct
                    ? "border-success bg-success/10 ring-2 ring-success/30"
                    : wrong
                    ? "border-error bg-error/10 ring-2 ring-error/30"
                    : isSelected
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm"
                    : "border-border hover:border-primary/30 hover:bg-muted"
                }`}
              >
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold shrink-0 mt-0.5 ${
                  correct ? "bg-success text-white" :
                  wrong ? "bg-error text-white" :
                  isSelected ? "bg-primary text-white" :
                  "bg-muted text-muted-foreground"
                }`}>{letter}</span>
                <span className="flex-1 leading-relaxed">
                  <MathBlock text={opt} />
                </span>
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
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={() => { setShowAnswer(false); setSelected([]); }}
            className="px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted hover:border-primary/30 transition-all"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Answer reveal */}
      {showAnswer && question.correctAnswer && (
        <div className="rounded-xl border border-success/30 bg-success/5 p-6 mb-6 animate-slide-up">
          <h3 className="font-bold text-success mb-3 flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Correct Answer
          </h3>
          <div className="space-y-1.5">
            {question.correctAnswer.map((a) => (
              <p key={a} className="text-sm font-semibold">{a}</p>
            ))}
          </div>
        </div>
      )}

      {showAnswer && question.explanation && (
        <div className="rounded-xl border border-border bg-card p-6 mb-6 card-surface animate-slide-up">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Explanation
          </h3>
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
