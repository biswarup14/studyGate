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
  subtopic: string | null;
  branch: string | null;
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

export interface SubtopicInfo {
  name: string;
  count: number;
}

export interface IndexData {
  total: number;
  years: Record<string, number>;
  subjects: SubjectInfo[];
  subtopics: Record<string, SubtopicInfo[]>;
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

/** Generate a URL-safe slug from a subject name. */
export function subjectSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Reverse lookup: slug → subject name. Returns the original slug if no match. */
export function subjectFromSlug(slug: string): string {
  return SUBJECT_SLUG_MAP[slug] || slug;
}

const SUBJECT_SLUG_MAP: Record<string, string> = Object.fromEntries(
  Object.keys(SUBJECT_COLORS).map((name) => [subjectSlug(name), name])
);

export const SUBTOPIC_COLORS: Record<string, string> = {
  // Engineering Mathematics
  "Linear Algebra": "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  "Calculus": "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300",
  "Probability & Statistics": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "Numerical Methods": "bg-slate-500/15 text-slate-700 dark:text-slate-300",
  // General Aptitude
  "Verbal Aptitude": "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  "Quantitative Aptitude": "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "Logical & Analytical Reasoning": "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "Spatial Aptitude": "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  // Discrete Mathematics
  "Set Theory & Relations": "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  "Mathematical Logic": "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  "Combinatorics": "bg-pink-500/15 text-pink-700 dark:text-pink-300",
  "Graph Theory": "bg-lime-500/15 text-lime-700 dark:text-lime-300",
  "Group Theory & Algebra": "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  "Number Theory": "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
  "Lattice & Partial Order": "bg-stone-500/15 text-stone-700 dark:text-stone-300",
  // Digital Logic
  "Boolean Algebra": "bg-red-500/15 text-red-700 dark:text-red-300",
  "K-Map & Minimization": "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  "Number Systems & Representation": "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  "Combinational Circuits": "bg-green-500/15 text-green-700 dark:text-green-300",
  "Sequential Circuits": "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
  "Logic Gates & Circuit Output": "bg-gray-500/15 text-gray-700 dark:text-gray-300",
  // Computer Organization
  "Memory Hierarchy & Cache": "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  "Pipelining": "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  "Instruction Set & Addressing": "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "Data Path & Control Unit": "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  "I/O & Interrupts": "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "Arithmetic & Data Representation": "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  "Architecture": "bg-lime-500/15 text-lime-700 dark:text-lime-300",
  // Programming in C
  "Functions & Recursion": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "Pointers & Memory": "bg-red-500/15 text-red-700 dark:text-red-300",
  "Control Flow": "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "Expressions & Evaluation": "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "Structures": "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  "Strings": "bg-pink-500/15 text-pink-700 dark:text-pink-300",
  // Data Structures
  "Trees": "bg-green-500/15 text-green-700 dark:text-green-300",
  "Hashing": "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  "Stacks & Queues": "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  "Linked Lists": "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  "Heaps": "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
  "Arrays": "bg-gray-500/15 text-gray-700 dark:text-gray-300",
  "Graphs": "bg-lime-500/15 text-lime-700 dark:text-lime-300",
  "Union-Find": "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  // Algorithms
  "Complexity Analysis": "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  "Sorting & Searching": "bg-pink-500/15 text-pink-700 dark:text-pink-300",
  "Graph Algorithms": "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  "Dynamic Programming": "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300",
  "Greedy Algorithms": "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "Recurrences & Divide & Conquer": "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  "Algorithm Design": "bg-slate-500/15 text-slate-700 dark:text-slate-300",
  // Theory of Computation
  "Regular Languages & Automata": "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  "Context-Free Languages & PDA": "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  "Turing Machines & Recursive Languages": "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "Decidability & Reductions": "bg-red-500/15 text-red-700 dark:text-red-300",
  // Compiler Design
  "Lexical Analysis": "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "Parsing": "bg-green-500/15 text-green-700 dark:text-green-300",
  "Syntax-Directed Translation": "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  "Intermediate Code": "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "Runtime Environments": "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  "Code Optimization": "bg-pink-500/15 text-pink-700 dark:text-pink-300",
  "Assemblers, Linkers & Tools": "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
  "Compilation Phases": "bg-gray-500/15 text-gray-700 dark:text-gray-300",
  // Operating Systems
  "Processes & Threads": "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  "CPU Scheduling": "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  "Synchronization & Concurrency": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "Deadlock": "bg-red-500/15 text-red-700 dark:text-red-300",
  "Memory Management": "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  "File Systems & Storage": "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  "System Calls": "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  "Security & Protection": "bg-gray-500/15 text-gray-700 dark:text-gray-300",
  // Databases (DBMS)
  "ER & Relational Model": "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  "Relational Algebra & Calculus": "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  "SQL": "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  "Normalization": "bg-pink-500/15 text-pink-700 dark:text-pink-300",
  "Integrity & Constraints": "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
  "Transactions & Concurrency": "bg-red-500/15 text-red-700 dark:text-red-300",
  "Indexing": "bg-green-500/15 text-green-700 dark:text-green-300",
  // Computer Networks
  "Network Architecture": "bg-slate-500/15 text-slate-700 dark:text-slate-300",
  "Data Link Layer": "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "Network Layer": "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  "Transport Layer": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "Application Layer": "bg-violet-500/15 text-violet-700 dark:text-violet-300",
};
