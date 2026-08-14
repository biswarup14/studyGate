"use client";
import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Select } from "@/components/Select";
import { SetMarksCard } from "@/components/SetMarksCard";
import { Reveal } from "@/components/Reveal";
import { SUBJECT_BAR_COLORS } from "@/lib/marks";
import type { YearMarks } from "@/lib/marks";

export default function MarksPage() {
  const [yearMarks, setYearMarks] = useState<YearMarks[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/marks-distribution.json")
      .then((r) => r.json())
      .then((data) => {
        const parsed: YearMarks[] = Object.entries(data.years)
          .map(([y, sets]) => ({ year: parseInt(y), sets: sets as YearMarks["sets"] }))
          .sort((a, b) => a.year - b.year);
        setYearMarks(parsed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const years = useMemo(() => yearMarks.map((y) => y.year), [yearMarks]);

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const active = yearMarks.find((ym) => ym.year === selectedYear);
  const detail = active ?? yearMarks[yearMarks.length - 1];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Marks Distribution"
        subtitle="Subject and set-wise marks for each GATE CSE paper"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h18M3 17h18M5 21V9l7-4 7 4v12M8 17V9m8 8V9" />
          </svg>
        }
        right={
          loading || years.length === 0 ? (
            <div className="skeleton h-10 w-32" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Paper</span>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-32"
                aria-label="Select year"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </Select>
            </div>
          )
        }
      />

      {loading || yearMarks.length === 0 ? (
        <div className="space-y-4">
          <div className="skeleton h-14 mb-6" />
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="skeleton h-64" />
          ))}
        </div>
      ) : (
        <>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-8">
            {Object.entries(SUBJECT_BAR_COLORS).map(([name, color]) => (
              <span key={name} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                {name}
              </span>
            ))}
          </div>

          {detail && (
            <>
              {/* Set-wise cards for the selected year */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="font-bold text-lg">{detail.year}</h2>
                <div className="flex flex-wrap gap-2">
                  {detail.sets.map((s) => (
                    <span
                      key={s.label}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-xs"
                    >
                      <span className="font-bold text-primary">{s.label}</span>
                      <span className="text-muted-foreground tabular-nums">{s.count} q</span>
                      {s.marksAvailable && (
                        <span className="text-muted-foreground tabular-nums">{s.marks} m</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`grid gap-4 ${detail.sets.length > 1 ? "lg:grid-cols-2" : ""}`}>
                {detail.sets.map((setMarks, i) => (
                  <Reveal key={setMarks.label} delay={i === 0 ? 1 : 2}>
                    <SetMarksCard setMarks={setMarks} />
                  </Reveal>
                ))}
              </div>
            </>
          )}

          {detail && !detail.sets.every((s) => s.marksAvailable) && (
            <p className="text-sm text-muted-foreground mt-8">
              Marks are not recorded in the source for papers before 2018; those sets show question-count distribution instead.
            </p>
          )}
        </>
      )}
    </div>
  );
}
