"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useProgress } from "./useProgress";
import { Question, SUBJECT_COLORS, SUBJECT_ICONS } from "@/lib/types";

export function RecentActivity() {
  const { progress, mounted } = useProgress();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const recentIds = useMemo(() => {
    if (!mounted) return [];
    return Object.entries(progress)
      .filter(([, p]) => p.attempts > 0)
      .sort((a, b) => new Date(b[1].lastSeen).getTime() - new Date(a[1].lastSeen).getTime())
      .slice(0, 5)
      .map(([id]) => id);
  }, [progress, mounted]);

  useEffect(() => {
    if (recentIds.length === 0) {
      setLoading(false);
      return;
    }
    Promise.all(
      Array.from({ length: 27 }, (_, i) =>
        fetch(`/data/questions-${2000 + i}.json`)
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => [])
      )
    ).then((results) => {
      const all = results.flat();
      setQuestions(all.filter((q: Question) => recentIds.includes(q.id)));
      setLoading(false);
    });
  }, [recentIds]);

  const stats = useMemo(() => {
    if (!mounted) return { attempted: 0, correct: 0, streak: 0 };
    const entries = Object.values(progress).filter((p) => p.attempts > 0);
    const attempted = entries.length;
    const correct = entries.filter((p) => p.correct > 0).length;

    let streak = 0;
    const sorted = entries
      .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());
    for (const entry of sorted) {
      if (entry.correct > 0) streak++;
      else break;
    }

    return { attempted, correct, streak };
  }, [progress, mounted]);

  if (!mounted) return null;

  if (stats.attempted === 0) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 text-center">
        <div className="text-3xl mb-3">📊</div>
        <h2 className="text-xl font-bold mb-2">Your Progress</h2>
        <p className="text-muted-foreground text-sm mb-4">
          You haven&apos;t attempted any questions yet. Start practicing to track your progress here!
        </p>
        <Link
          href="/questions"
          className="inline-flex px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Browse Questions →
        </Link>
      </section>
    );
  }

  const questionMap = new Map(questions.map((q) => [q.id, q]));

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Recent Activity</h2>
        <Link href="/questions" className="text-sm text-primary hover:underline">View all →</Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.attempted}</div>
          <div className="text-xs text-muted-foreground mt-1">Questions Attempted</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-success">
            {stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">Accuracy</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-amber-500">{stats.streak}</div>
          <div className="text-xs text-muted-foreground mt-1">Correct Streak</div>
        </div>
      </div>

      {/* Recent questions */}
      {recentIds.length > 0 && (
        <div className="space-y-2">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : (
            recentIds.map((id) => {
              const q = questionMap.get(id);
              const p = progress[id];
              if (!q || !p) return null;

              const accuracy = p.attempts > 0 ? Math.round((p.correct / p.attempts) * 100) : 0;
              const timeAgo = getTimeAgo(p.lastSeen);

              return (
                <Link
                  key={id}
                  href={`/questions/${id}`}
                  className="flex items-center gap-4 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all"
                >
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${SUBJECT_COLORS[q.subject] || "from-gray-500 to-gray-600"} text-white text-xs font-bold flex-shrink-0`}
                  >
                    {SUBJECT_ICONS[q.subject] || q.subject.slice(0, 3)}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{q.text.slice(0, 80)}{q.text.length > 80 ? "…" : ""}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{q.year}</span>
                      <span>·</span>
                      <span>{q.subject}</span>
                      <span>·</span>
                      <span>{timeAgo}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{p.attempts} attempt{p.attempts !== 1 ? "s" : ""}</div>
                      <div className={`text-xs font-medium ${accuracy >= 70 ? "text-success" : accuracy >= 40 ? "text-amber-500" : "text-error"}`}>
                        {accuracy}% acc
                      </div>
                    </div>
                    <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
