import type { Metadata } from "next";
import { MarksPageContent } from "./MarksPageContent";

export const metadata: Metadata = {
  title: "GATE Score Calculator – Estimate Your GATE Rank",
  description:
    "Calculate and estimate your GATE score using StudyGate's marks calculator. Set expected marks per section, analyze your preparation level, and plan your GATE CSE strategy.",
  openGraph: {
    title: "GATE Score Calculator | StudyGate",
    description:
      "Calculate and estimate your GATE score. Set expected marks per section and analyze your preparation.",
    url: "/marks",
  },
  alternates: {
    canonical: "/marks",
  },
};

export default function MarksPage() {
  return <MarksPageContent />;
}
