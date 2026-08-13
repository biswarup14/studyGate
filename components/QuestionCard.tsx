"use client";
import Link from "next/link";
import { Question, SUBJECT_COLORS, SUBJECT_ICONS, SUBTOPIC_COLORS } from "@/lib/types";
import { MathBlock } from "./MathBlock";
import { TypeBadge } from "./TypeBadge";

export function QuestionCard({ question }: { question: Question }) {
  const hasAnswer = question.correctAnswer && question.correctAnswer.length > 0;

  const diffColor = {
    easy: "bg-success",
    medium: "bg-warning",
    hard: "bg-error",
  }[question.difficulty || "medium"];

  return (
    <Link
      href={`/questions/${question.id}`}
      className="block p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all bg-card group hover-lift"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${SUBJECT_COLORS[question.subject] || "from-gray-500 to-gray-600"} text-white`}>
            {SUBJECT_ICONS[question.subject] || question.subject.slice(0, 3)}
          </span>
          <TypeBadge type={question.type} />
          {question.branch && question.branch !== "CSE" && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-500/15 text-slate-700 dark:text-slate-300">
              {question.branch}
            </span>
          )}
          {question.subtopic && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SUBTOPIC_COLORS[question.subtopic] || "bg-muted text-muted-foreground"}`}>
              {question.subtopic}
            </span>
          )}
          {question.marks && (
            <span className="text-xs text-muted-foreground">
              {question.marks} mark{question.marks > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {question.year}
          {question.set && ` S${question.set}`}
        </div>
      </div>

      <div className="text-sm text-foreground/90 line-clamp-3 mb-2">
        <MathBlock text={question.text} />
      </div>

      {question.options.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {question.options.slice(0, 4).map((opt, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
            >
              {String.fromCharCode(65 + i)}. {opt.length > 30 ? opt.slice(0, 30) + "…" : opt}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
        <span className={`w-2 h-2 rounded-full ${hasAnswer ? "bg-success" : "bg-warning"}`} />
        <span>{hasAnswer ? "Answer available" : "Answer pending"}</span>
        {question.difficulty && (
          <span className="ml-auto inline-flex items-center gap-1.5 capitalize">
            <span className={`w-1.5 h-1.5 rounded-full ${diffColor}`} />
            {question.difficulty}
          </span>
        )}
      </div>
    </Link>
  );
}
