import type { Metadata } from "next";
import { QuestionsPageContent } from "./QuestionsPageContent";

export const metadata: Metadata = {
  title: "Browse All GATE CS Previous Year Questions",
  description:
    "Browse and filter 3,200+ GATE Computer Science previous year questions from 2000–2026. Filter by subject, year, question type (MCQ/MSQ/NAT), and difficulty. StudyGate PYQ with solutions.",
  openGraph: {
    title: "Browse All GATE CS Previous Year Questions | StudyGate",
    description:
      "Browse and filter 3,200+ GATE Computer Science previous year questions from 2000–2026 with solutions.",
    url: "/questions",
  },
  alternates: {
    canonical: "/questions",
  },
};

export default function QuestionsPage() {
  return <QuestionsPageContent />;
}
