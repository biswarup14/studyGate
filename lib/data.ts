import { Question, IndexData } from "./types";

let _index: IndexData | null = null;
const _yearCache: Map<number, Question[]> = new Map();
const _allQuestions: Question[] = [];

export async function getIndex(): Promise<IndexData> {
  if (_index) return _index;
  const res = await fetch("/data/index.json");
  _index = (await res.json()) as IndexData;
  return _index!;
}

export async function getYearQuestions(year: number): Promise<Question[]> {
  if (_yearCache.has(year)) return _yearCache.get(year)!;
  const res = await fetch(`/data/questions-${year}.json`);
  if (!res.ok) return [];
  const data: Question[] = await res.json();
  _yearCache.set(year, data);
  return data;
}

export async function getAllQuestions(): Promise<Question[]> {
  if (_allQuestions.length > 0) return _allQuestions;
  const idx = await getIndex();
  const years = Object.keys(idx.years).map(Number).sort((a, b) => a - b);
  for (const y of years) {
    const qs = await getYearQuestions(y);
    _allQuestions.push(...qs);
  }
  return _allQuestions;
}

export async function getQuestionById(id: string): Promise<Question | undefined> {
  const all = await getAllQuestions();
  return all.find((q) => q.id === id);
}

export async function getQuestionsBySubject(subject: string): Promise<Question[]> {
  const all = await getAllQuestions();
  return all.filter((q) => q.subject === subject);
}

export async function getQuestionsByYear(year: number): Promise<Question[]> {
  return getYearQuestions(year);
}

export async function searchQuestions(query: string): Promise<Question[]> {
  const all = await getAllQuestions();
  const low = query.toLowerCase();
  return all.filter(
    (q) =>
      q.text.toLowerCase().includes(low) ||
      q.subject.toLowerCase().includes(low) ||
      q.options.some((o) => o.toLowerCase().includes(low))
  );
}

export async function getRandomQuestions(
  count: number,
  filters?: {
    subject?: string;
    yearStart?: number;
    yearEnd?: number;
    type?: string;
  }
): Promise<Question[]> {
  const all = await getAllQuestions();
  let pool = all;

  if (filters?.subject) {
    pool = pool.filter((q) => q.subject === filters.subject);
  }
  if (filters?.yearStart) {
    pool = pool.filter((q) => q.year >= filters.yearStart!);
  }
  if (filters?.yearEnd) {
    pool = pool.filter((q) => q.year <= filters.yearEnd!);
  }
  if (filters?.type) {
    pool = pool.filter((q) => q.type === filters.type);
  }

  // Filter out questions without answers for quiz
  pool = pool.filter((q) => q.correctAnswer && q.correctAnswer.length > 0 && (q.type === "mcq" || q.type === "msq"));

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Server-side data loading for static generation
export function loadYearData(year: number): Question[] {
  try {
    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(process.cwd(), "data", `questions-${year}.json`);
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

export function loadIndex(): IndexData {
  try {
    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(process.cwd(), "data", "index.json");
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return { total: 0, years: {}, subjects: [], types: {}, updatedAt: "" };
  }
}
