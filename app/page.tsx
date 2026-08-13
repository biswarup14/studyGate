"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SubjectCard } from "@/components/SubjectCard";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useSubjectProgress } from "@/components/useSubjectProgress";
import { IndexData } from "@/lib/types";

export default function HomePage() {
  const [index, setIndex] = useState<IndexData | null>(null);
  const [loading, setLoading] = useState(true);
  const { subjectProgress, mounted } = useSubjectProgress();

  useEffect(() => {
    fetch("/data/index.json")
      .then((r) => r.json())
      .then((d) => { setIndex(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !index) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="skeleton h-12 w-3/4 mx-auto mb-4" />
          <div className="skeleton h-5 w-1/2 mx-auto mb-8" />
          <div className="flex justify-center gap-3">
            <div className="skeleton h-12 w-40" />
            <div className="skeleton h-12 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="skeleton h-28" />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="skeleton h-32" />
          ))}
        </div>
      </div>
    );
  }

  const years = Object.entries(index.years)
    .map(([y, c]) => ({ year: parseInt(y), count: c }))
    .sort((a, b) => b.year - a.year);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero */}
      <section className="text-center mb-14 animate-fade-in">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          GATE 2000 – 2026 · All shifts
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
          GATE CS{" "}
          <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
            Previous Year Questions
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
          Master GATE Computer Science with {index.total.toLocaleString()} questions from 2000–2026, complete with solutions, interactive quizzes, and progress tracking.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/questions"
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            Browse Questions →
          </Link>
          <Link
            href="/quiz"
            className="px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted hover:border-primary/30 transition-all"
          >
            Start Quiz
          </Link>
        </div>
      </section>

      {/* GATE 2027 countdown */}
      <section className="mb-14">
        <CountdownTimer />
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {[
          {
            label: "Total Questions",
            value: index.total.toLocaleString(),
            bg: "bg-primary/10 text-primary",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
          },
          {
            label: "Subjects",
            value: index.subjects.length.toString(),
            bg: "bg-purple-500/10 text-purple-500",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            ),
          },
          {
            label: "Years Covered",
            value: `${Math.min(...Object.keys(index.years).map(Number))}–${Math.max(...Object.keys(index.years).map(Number))}`,
            bg: "bg-emerald-500/10 text-emerald-500",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ),
          },
          {
            label: "With Solutions",
            value: `${Math.round(((index.total - 71) / index.total) * 100)}%`,
            bg: "bg-amber-500/10 text-amber-500",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border p-4 bg-card text-center card-surface hover-lift">
            <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-2.5 ${stat.bg}`}>{stat.icon}</div>
            <div className="text-2xl font-bold leading-tight">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Subjects */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Subjects</h2>
          <Link href="/subjects" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {index.subjects.map((s) => (
            <SubjectCard
              key={s.name}
              name={s.name}
              count={s.count}
              attempted={mounted ? subjectProgress[s.name]?.attempted : undefined}
            />
          ))}
        </div>
      </section>

      {/* Year picker */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Browse by Year</h2>
          <Link href="/questions" className="text-sm text-primary hover:underline">View all →</Link>
        </div>

        <div className="animate-stagger card-surface relative overflow-hidden p-5 sm:p-7">
          <span className="pointer-events-none absolute -top-16 right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <span className="pointer-events-none absolute inset-x-6 top-0 h-0.5 rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {(() => {
            const total = years.reduce((n, y) => n + y.count, 0);
            const max = years.reduce((a, y) => (y.count > a.count ? y : a), years[0]);
            const min = years.reduce((a, y) => (y.count < a.count ? y : a), years[0]);
            return (
              <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{years.length} papers</span> ·{" "}
                  <span className="font-semibold text-foreground">{total.toLocaleString()}</span> questions total
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground tabular-nums">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
                    {max.year} · {max.count.toLocaleString()} max
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-muted-foreground/40" />
                    {min.year} · {min.count.toLocaleString()} min
                  </span>
                </div>
              </div>
            );
          })()}

          <div className="overflow-x-auto pb-1 -mx-1 px-1">
            <div
              className="flex items-end gap-[3px] h-44 sm:h-52 min-w-[560px]"
              style={{
                ['--max' as string]: `${Math.max(...years.map((y) => y.count))}`,
              }}
            >
              {years.map(({ year, count }, i) => {
                const pct = (count / Math.max(...years.map((y) => y.count))) * 100;
                return (
                  <Link
                    key={year}
                    href={`/years/${year}`}
                    className="group relative flex h-full flex-1 flex-col justify-end"
                    aria-label={`${year}: ${count} questions`}
                  >
                    <div className="relative flex h-full w-full items-end">
                      <div
                        className="animate-grow-bar w-full rounded-t-md bg-gradient-to-t from-primary/20 via-primary/40 to-primary transition-all duration-200 group-hover:from-primary group-hover:to-primary/70"
                        style={{
                          height: `${pct}%`,
                          animationDelay: `${i * 30}ms`,
                          boxShadow: "0 0 0 rgba(37,99,235,0)",
                        }}
                      />
                      <div className="pointer-events-none absolute inset-x-0 -top-8 z-10 flex justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        <span className="rounded-md bg-foreground px-2 py-1 text-[11px] font-semibold text-background shadow-lg whitespace-nowrap">
                          {year} · {count} Qs
                        </span>
                      </div>
                    </div>
                    <span className="mt-1.5 text-center text-[11px] tabular-nums text-muted-foreground transition-colors group-hover:text-primary">
                      {year}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Quick quiz */}
      <section className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Ready to Practice?</h2>
            <p className="text-muted-foreground text-sm">
              Start a timed quiz with random questions from any subject or year range.
            </p>
          </div>
          <Link
            href="/quiz"
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all whitespace-nowrap"
          >
            Start Quiz →
          </Link>
        </div>
      </section>
    </div>
  );
}
