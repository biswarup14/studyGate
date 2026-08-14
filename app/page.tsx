"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Reveal } from "@/components/Reveal";
import { useSubjectProgress } from "@/components/useSubjectProgress";
import { IndexData, SUBJECT_COLORS, SUBJECT_ICONS } from "@/lib/types";

const CountdownTimer = dynamic(
  () => import("@/components/CountdownTimer").then((m) => m.CountdownTimer),
  { ssr: false }
);

interface HotTopicsData {
  hotTopics: TopicStat[];
  hotSubjects: SubjectStat[];
}

interface TopicStat {
  subject: string;
  topic: string;
  count: number;
}

interface SubjectStat {
  subject: string;
  count: number;
}

export default function HomePage() {
  const [index, setIndex] = useState<IndexData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hotData, setHotData] = useState<HotTopicsData | null>(null);
  const { subjectProgress, mounted } = useSubjectProgress();

  useEffect(() => {
    Promise.all([
      fetch("/data/index.json").then((r) => r.json()),
      fetch("/data/hot-topics.json").then((r) => r.json()).catch(() => null),
    ]).then(([idx, hot]) => {
      setIndex(idx);
      setHotData(hot);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const hotTopics = hotData?.hotTopics ?? [];
  const hotSubjects = hotData?.hotSubjects ?? [];

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
      <Reveal as="section" className="text-center mb-14">
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
            className="btn-press px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            Browse Questions →
          </Link>
          <Link
            href="/quiz"
            className="btn-press px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted hover:border-primary/30 transition-all"
          >
            Start Quiz
          </Link>
        </div>
      </Reveal>

      {/* GATE 2027 countdown */}
      <Reveal className="mb-14" delay={1}>
        <CountdownTimer />
      </Reveal>

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
        ].map((stat, i) => (
          <Reveal key={stat.label} delay={Math.min(i + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6}>
            <div className="rounded-xl border border-border p-4 bg-card text-center card-surface hover-lift btn-press">
              <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-2.5 ${stat.bg}`}>{stat.icon}</div>
              <div className="text-2xl font-bold leading-tight">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Subjects */}
      <Reveal as="section" className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Subjects</h2>
          <Link href="/subjects" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="card-surface overflow-hidden divide-y divide-border">
          {index.subjects.map((s, i) => {
            const attempted = mounted ? subjectProgress[s.name]?.attempted : undefined;
            const pct = s.count > 0 && attempted ? Math.min(100, Math.round((attempted / s.count) * 100)) : 0;
            return (
              <Reveal key={s.name} delay={((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6}>
                <Link
                  href={`/subjects/${s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                  className="group flex items-center gap-4 px-5 py-3.5 hover:bg-muted/60 transition-colors duration-150 relative overflow-hidden"
                >
                  {/* Accent bar on hover */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 group-hover:h-8 bg-primary rounded-r-full transition-all duration-300" />

                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${SUBJECT_COLORS[s.name] || "from-gray-500 to-gray-600"} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                  >
                    {SUBJECT_ICONS[s.name] || s.name.slice(0, 2)}
                  </div>

                  {/* Name + count */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                        {s.name}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
                        {s.count.toLocaleString()} q
                      </span>
                    </div>
                    {/* Progress bar */}
                    {attempted != null && attempted > 0 && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${SUBJECT_COLORS[s.name] || "from-gray-500 to-gray-600"} transition-all duration-700 ease-out`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] tabular-nums text-muted-foreground flex-shrink-0">
                          {attempted}/{s.count}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Chevron */}
                  <svg
                    className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Reveal>

      {/* Year picker */}
      <Reveal as="section" className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Browse by Year</h2>
          <Link href="/questions" className="text-sm text-primary hover:underline">View all →</Link>
        </div>

        <div className="card-surface relative overflow-hidden p-5 sm:p-7">
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

          {/* Detailed statistics: last 10 years */}
          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            {/* Hot topics to study */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Hot Topics to Study
                </h3>
                <span className="text-[11px] text-muted-foreground">2017–2026</span>
              </div>
              {hotTopics.length === 0 ? (
                <div className="space-y-2">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="skeleton h-7" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {hotTopics.map((t, i) => {
                    const pct = (t.count / hotTopics[0].count) * 100;
                    return (
                      <li key={`${t.subject}-${t.topic}`} className="group relative">
                        <Link
                          href={`/subjects/${t.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-")}?subtopic=${encodeURIComponent(t.topic)}`}
                          className="block"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs mb-1">
                            <span className="flex items-center gap-2 min-w-0">
                              <span className="w-4 text-right shrink-0 tabular-nums text-muted-foreground/70">{i + 1}</span>
                              <span className="truncate font-medium">{t.topic}</span>
                              <span className="hidden sm:inline text-muted-foreground truncate">· {t.subject}</span>
                            </span>
                            <span className="shrink-0 tabular-nums font-semibold">{t.count}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400 animate-grow-bar"
                              style={{ width: `${pct}%`, animationDelay: `${i * 40}ms` }}
                            />
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Most asked subjects (excl. GA) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Most Asked Subjects
                </h3>
                <span className="text-[11px] text-muted-foreground">excl. General Aptitude</span>
              </div>
              {hotSubjects.length === 0 ? (
                <div className="space-y-2">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="skeleton h-7" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {hotSubjects.slice(0, 10).map((s, i) => {
                    const pct = (s.count / hotSubjects[0].count) * 100;
                    return (
                      <li key={s.subject} className="group relative">
                        <Link
                          href={`/subjects/${s.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                          className="block"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs mb-1">
                            <span className="flex items-center gap-2 min-w-0">
                              <span className="w-4 text-right shrink-0 tabular-nums text-muted-foreground/70">{i + 1}</span>
                              <span className="truncate font-medium">{s.subject}</span>
                            </span>
                            <span className="shrink-0 tabular-nums font-semibold">{s.count} q</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-400 animate-grow-bar"
                              style={{ width: `${pct}%`, animationDelay: `${i * 40}ms` }}
                            />
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Quick quiz */}
      <Reveal
        as="section"
        className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-6 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Ready to Practice?</h2>
            <p className="text-muted-foreground text-sm">
              Start a timed quiz with random questions from any subject or year range.
            </p>
          </div>
          <Link
            href="/quiz"
            className="btn-press px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all whitespace-nowrap"
          >
            Start Quiz →
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
