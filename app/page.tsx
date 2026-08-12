"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SubjectCard } from "@/components/SubjectCard";
import { RecentActivity } from "@/components/RecentActivity";
import { IndexData } from "@/lib/types";

export default function HomePage() {
  const [index, setIndex] = useState<IndexData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/index.json")
      .then((r) => r.json())
      .then((d) => { setIndex(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !index) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const years = Object.entries(index.years)
    .map(([y, c]) => ({ year: parseInt(y), count: c }))
    .sort((a, b) => b.year - a.year);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
          GATE CS <span className="text-primary">Previous Year Questions</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
          Master GATE Computer Science with {index.total.toLocaleString()} questions from 2000–2026, complete with solutions, interactive quizzes, and progress tracking.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/questions"
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Browse Questions →
          </Link>
          <Link
            href="/quiz"
            className="px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors"
          >
            Start Quiz
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Total Questions", value: index.total.toLocaleString(), icon: "📝" },
          { label: "Subjects", value: index.subjects.length.toString(), icon: "📚" },
          { label: "Years Covered", value: `${Math.min(...Object.keys(index.years).map(Number))}–${Math.max(...Object.keys(index.years).map(Number))}`, icon: "📅" },
          { label: "With Solutions", value: `${Math.round(((index.total - 71) / index.total) * 100)}%`, icon: "✅" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border p-4 bg-card text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Recent Activity */}
      <section className="mb-12">
        <RecentActivity />
      </section>

      {/* Subjects */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Subjects</h2>
          <Link href="/subjects" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {index.subjects.map((s) => (
            <SubjectCard key={s.name} name={s.name} count={s.count} />
          ))}
        </div>
      </section>

      {/* Year picker */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Browse by Year</h2>
          <Link href="/questions" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {years.map(({ year, count }) => (
            <Link
              key={year}
              href={`/years/${year}`}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-muted transition-all text-center"
            >
              <span className="font-bold text-lg">{year}</span>
              <span className="text-xs text-muted-foreground">{count} Qs</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick quiz */}
      <section className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Ready to Practice?</h2>
            <p className="text-muted-foreground text-sm">
              Start a timed quiz with random questions from any subject or year range.
            </p>
          </div>
          <Link
            href="/quiz"
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 whitespace-nowrap"
          >
            Start Quiz →
          </Link>
        </div>
      </section>
    </div>
  );
}
