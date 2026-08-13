import { Question } from "@/lib/types";

function questionNumber(id: string): number {
  const match = id.match(/(\d+)\D*$/);
  return match ? parseInt(match[1], 10) : 0;
}

export function sortNewestFirst(a: Question, b: Question): number {
  if (a.year !== b.year) return b.year - a.year;
  return questionNumber(b.id) - questionNumber(a.id);
}
