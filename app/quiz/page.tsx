import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { QuizPageContent } from "./QuizPageContent";

export const metadata: Metadata = buildMetadata({
  title: "Practice Quiz — GATE CS Prep",
  description:
    "Start a timed practice quiz with random GATE CS questions. Filter by subject, topic, and year. Test your preparation with instant feedback.",
  path: "/quiz",
});

export default function QuizPage() {
  return <QuizPageContent />;
}
