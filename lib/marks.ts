import type { Question } from "./types";

export const SUBJECT_BAR_COLORS: Record<string, string> = {
  "General Aptitude": "#3b82f6",
  "Engineering Mathematics": "#8b5cf6",
  "Discrete Mathematics": "#ec4899",
  "Digital Logic": "#06b6d4",
  "Computer Organization": "#14b8a6",
  "Programming in C": "#22c55e",
  "Data Structures": "#f97316",
  "Algorithms": "#ef4444",
  "Theory of Computation": "#6366f1",
  "Compiler Design": "#a855f7",
  "Operating Systems": "#10b981",
  "Databases (DBMS)": "#f59e0b",
  "Computer Networks": "#f43f5e",
};

export interface SubtopicMarks {
  name: string;
  count: number;
  marks: number | null;
}

export interface SubjectMarks {
  name: string;
  count: number;
  marks: number | null;
  subtopics: SubtopicMarks[];
}

export interface SetMarks {
  set: string | null;
  label: string;
  count: number;
  marks: number | null;
  marksAvailable: boolean;
  subjects: SubjectMarks[];
}

export interface YearMarks {
  year: number;
  sets: SetMarks[];
}

export function isCseQuestion(q: Question): boolean {
  return !q.branch || q.branch === "CSE";
}

function buildSubjects(
  bySubject: Map<string, Map<string, { count: number; marks: number | null }>>
): SubjectMarks[] {
  return [...bySubject.entries()]
    .map(([name, bySub]) => {
      const subtopics = [...bySub.entries()]
        .map(([n, v]) => ({ name: n, count: v.count, marks: v.marks }))
        .sort(
          (a, b) =>
            (b.marks ?? 0) - (a.marks ?? 0) ||
            b.count - a.count
        );
      return {
        name,
        count: subtopics.reduce((n, s) => n + s.count, 0),
        marks: subtopics.some((s) => s.marks != null)
          ? subtopics.reduce((n, s) => n + (s.marks ?? 0), 0)
          : null,
        subtopics,
      };
    })
    .sort(
      (a, b) =>
        (b.marks ?? b.count) - (a.marks ?? a.count) ||
        a.name.localeCompare(b.name)
    );
}

/**
 * Group GATE CSE questions by year, then by set. For each year+set, break
 * questions down by subject and subtopic. Marks are only reported when the
 * source data actually carries them (2018 onwards); earlier papers report
 * question counts only.
 */
export function aggregateByYearAndSet(questions: Question[]): YearMarks[] {
  const byYear = new Map<number, Map<string | null, Map<string, Map<string, { count: number; marks: number | null }>>>>();

  for (const q of questions) {
    if (!isCseQuestion(q)) continue;

    if (!byYear.has(q.year)) byYear.set(q.year, new Map());
    const bySet = byYear.get(q.year)!;

    if (!bySet.has(q.set)) bySet.set(q.set, new Map());
    const bySubject = bySet.get(q.set)!;

    if (!bySubject.has(q.subject)) bySubject.set(q.subject, new Map());
    const bySub = bySubject.get(q.subject)!;

    const name = q.subtopic || "General";
    const rec = bySub.get(name) || { count: 0, marks: null as number | null };
    rec.count++;
    if (q.marks != null) rec.marks = (rec.marks ?? 0) + q.marks;
    bySub.set(name, rec);
  }

  return [...byYear.entries()]
    .map(([year, bySet]) => ({
      year,
      sets: [...bySet.entries()]
        .map(([set, bySubject]) => {
          const subjects = buildSubjects(bySubject);
          const marksAvailable = subjects.some(
            (s) => s.marks != null
          );
          const marks = marksAvailable
            ? subjects.reduce((n, s) => n + (s.marks ?? 0), 0)
            : null;
          return {
            set,
            label: set ? `Set ${set}` : "Paper",
            count: subjects.reduce((n, s) => n + s.count, 0),
            marks,
            marksAvailable,
            subjects,
          };
        })
        .sort((a, b) => {
          if (a.set === null) return -1;
          if (b.set === null) return 1;
          return Number(a.set) - Number(b.set);
        }),
    }))
    .sort((a, b) => a.year - b.year);
}

export function getAllYears(questions: Question[]): number[] {
  return [...new Set(questions.map((q) => q.year))].sort((a, b) => a - b);
}
