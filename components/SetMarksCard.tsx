"use client";
import { useState } from "react";
import { SUBJECT_BAR_COLORS } from "@/lib/marks";
import type { SetMarks, SubjectMarks } from "@/lib/marks";

function subjectColor(name: string): string {
  return SUBJECT_BAR_COLORS[name] || "#64748b";
}

function SubjectRow({ sub, setMarks }: { sub: SubjectMarks; setMarks: SetMarks }) {
  const [open, setOpen] = useState(false);
  const total = setMarks.marksAvailable ? (setMarks.marks ?? 0) : setMarks.count;
  const value = setMarks.marksAvailable ? (sub.marks ?? 0) : sub.count;
  const pct = total > 0 ? (value / total) * 100 : 0;

  return (
    <>
      <tr
        onClick={() => setOpen(!open)}
        className={`cursor-pointer transition-colors ${open ? "bg-primary/5" : "hover:bg-muted/60"}`}
      >
        <td className="py-2 pl-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: subjectColor(sub.name) }} />
            <span className="truncate font-medium text-foreground/90">{sub.name}</span>
            {sub.subtopics.length > 1 && (
              <svg
                className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        </td>
        <td className="py-2 text-right tabular-nums text-muted-foreground">{sub.count}</td>
        <td className="py-2 text-right tabular-nums font-semibold">
          {setMarks.marksAvailable ? sub.marks : "—"}
        </td>
        <td className="py-2 pr-3 text-right tabular-nums text-muted-foreground">{pct.toFixed(1)}%</td>
      </tr>
      {open && sub.subtopics.length > 1 && (
        <tr>
          <td colSpan={4} className="pb-2 pr-3">
            <div className="ml-7 mr-3 rounded-lg bg-muted/50 p-2.5 space-y-1">
              {sub.subtopics.map((st) => (
                <div key={st.name} className="flex items-center gap-2 text-xs">
                  <span className="truncate text-foreground/70">{st.name}</span>
                  <span className="ml-auto shrink-0 tabular-nums text-muted-foreground">
                    {st.count} q{setMarks.marksAvailable ? ` · ${st.marks} m` : ""}
                  </span>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function SetMarksCard({ setMarks }: { setMarks: SetMarks }) {
  const total = setMarks.marksAvailable ? (setMarks.marks ?? 0) : setMarks.count;
  const subtitle = `${setMarks.count} question${setMarks.count !== 1 ? "s" : ""} · ${setMarks.subjects.length} subject${setMarks.subjects.length !== 1 ? "s" : ""}`;

  return (
    <div className="rounded-xl border border-border bg-card p-5 card-surface animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary text-sm font-black shrink-0">
            {setMarks.set ? `S${setMarks.set}` : "P"}
          </span>
          <div className="min-w-0">
            <h3 className="font-bold text-sm">{setMarks.label}</h3>
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          {setMarks.marksAvailable ? (
            <span className="text-xl font-black tabular-nums text-primary">
              {setMarks.marks}
              <span className="ml-1 text-xs font-medium text-muted-foreground">marks</span>
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                marks not recorded
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Stacked bar by subject */}
      <div
        className="h-2.5 rounded-full overflow-hidden flex bg-muted mb-4"
        title={setMarks.subjects.map((s) => `${s.name}: ${setMarks.marksAvailable ? `${s.marks} marks` : `${s.count} questions`}`).join(" · ")}
      >
        {setMarks.subjects.map((s) => (
          <div
            key={s.name}
            className="h-full"
            style={{
              width: `${((setMarks.marksAvailable ? (s.marks ?? 0) : s.count) / total) * 100}%`,
              backgroundColor: subjectColor(s.name),
            }}
            title={`${s.name} · ${setMarks.marksAvailable ? `${s.marks} marks` : `${s.count} questions`}`}
          />
        ))}
      </div>

      {/* Subject table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground border-b border-border">
            <th className="py-1.5 pl-3 text-left font-medium">Subject</th>
            <th className="py-1.5 text-right font-medium">Q</th>
            <th className="py-1.5 text-right font-medium">Marks</th>
            <th className="py-1.5 pr-3 text-right font-medium">{setMarks.marksAvailable ? "% marks" : "% q"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {setMarks.subjects.map((s) => (
            <SubjectRow key={s.name} sub={s} setMarks={setMarks} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
