import type { Metadata } from "next";
import { QuizPageContent } from "./QuizPageContent";

export const metadata: Metadata = {
  title: "GATE CS Practice Quiz – Timed Mock Tests with PYQ",
  description:
    "Take timed practice quizzes with real GATE previous year questions. Filter by subject, year, and question type. Get instant feedback, detailed solutions, and score analysis on StudyGate.",
  openGraph: {
    title: "GATE CS Practice Quiz | StudyGate",
    description:
      "Take timed practice quizzes with real GATE previous year questions. Filter by subject and year.",
    url: "/quiz",
  },
  alternates: {
    canonical: "/quiz",
  },
};

export default function QuizPage() {
  return <QuizPageContent />;
}
