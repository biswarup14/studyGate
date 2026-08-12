export type QuestionType = "mcq" | "msq" | "nat";
export type Difficulty = "easy" | "medium" | "hard";

export interface QuestionImage {
  src: string;
  kind: "remote" | "local";
}

export interface Question {
  id: string;
  year: number;
  set: string | null;
  number: number | null;
  section: string;
  type: QuestionType;
  subject: string;
  difficulty: Difficulty;
  marks: number | null;
  text: string;
  options: string[];
  correctAnswer: string[] | null;
  explanation: string | null;
  images: QuestionImage[];
  sourceUrl: string;
  source: "gateoverflow" | "official2026";
}

export interface SubjectInfo {
  name: string;
  count: number;
}

export interface IndexData {
  total: number;
  years: Record<string, number>;
  subjects: SubjectInfo[];
  types: Record<string, number>;
  updatedAt: string;
}

export interface QuizConfig {
  subject?: string;
  yearStart?: number;
  yearEnd?: number;
  count: number;
  type?: QuestionType;
}

export interface QuizQuestion extends Question {
  selectedAnswer: string[] | null;
  isCorrect: boolean | null;
  timeSpent: number;
}

export interface ProgressData {
  [questionId: string]: {
    attempts: number;
    correct: number;
    lastSeen: string;
  };
}

export const SUBJECT_COLORS: Record<string, string> = {
  "General Aptitude": "from-blue-500 to-blue-600",
  "Engineering Mathematics": "from-purple-500 to-purple-600",
  "Discrete Mathematics": "from-pink-500 to-pink-600",
  "Digital Logic": "from-cyan-500 to-cyan-600",
  "Computer Organization": "from-teal-500 to-teal-600",
  "Programming in C": "from-green-500 to-green-600",
  "Data Structures": "from-orange-500 to-orange-600",
  "Algorithms": "from-red-500 to-red-600",
  "Theory of Computation": "from-indigo-500 to-indigo-600",
  "Compiler Design": "from-violet-500 to-violet-600",
  "Operating Systems": "from-emerald-500 to-emerald-600",
  "Databases (DBMS)": "from-amber-500 to-amber-600",
  "Computer Networks": "from-rose-500 to-rose-600",
  "Unclassified": "from-gray-500 to-gray-600",
};

export const SUBJECT_ICONS: Record<string, string> = {
  "General Aptitude": "GA",
  "Engineering Mathematics": "EM",
  "Discrete Mathematics": "DM",
  "Digital Logic": "DL",
  "Computer Organization": "CO",
  "Programming in C": "C",
  "Data Structures": "DS",
  "Algorithms": "AL",
  "Theory of Computation": "TOC",
  "Compiler Design": "CD",
  "Operating Systems": "OS",
  "Databases (DBMS)": "DBMS",
  "Computer Networks": "CN",
};
