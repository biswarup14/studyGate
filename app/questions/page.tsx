import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { QuestionsPageContent } from "./QuestionsPageContent";

export const metadata: Metadata = buildMetadata({
  title: "Browse Questions — GATE CS Prep",
  description:
    "Search and filter 3,200+ GATE Computer Science previous year questions by subject, topic, year, type, and difficulty. 2000–2026 coverage with solutions.",
  path: "/questions",
});

export default function QuestionsPage() {
  return <QuestionsPageContent />;
}
