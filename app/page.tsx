import type { Metadata } from "next";
import { HomeContent } from "./HomeContent";
import { SeoContent } from "./SeoContent";
import { FaqSection } from "./FaqSection";

export const metadata: Metadata = {
  title: "StudyGate – GATE CS Previous Year Questions | Free PYQ with Solutions",
  description:
    "StudyGate offers 3,200+ GATE Computer Science previous year questions (2000–2026) with detailed solutions, interactive quizzes, and progress tracking. Prepare for GATE 2027 with PYQ for DBMS, OS, COA, DSA, CN, DM, C Programming, and all CSE subjects.",
  keywords: [
    "StudyGate",
    "gate exam",
    "gate pyq",
    "gate pyq cse",
    "dbms pyq gate",
    "os pyq gate",
    "coa pyq gate",
    "dm pyq gate",
    "dsa pyq gate",
    "cn pyq gate",
    "c programming gate",
    "gate 2027 syllabus cse",
    "gate 2026 result",
    "gate 2027",
    "gate 2027 registration last date",
    "gate exam date 2026",
    "gate computer science preparation",
    "gate cse previous year questions",
    "gate previous year papers",
    "gate cse pyq with solutions",
  ],
  openGraph: {
    title: "StudyGate – GATE CS Previous Year Questions | Free PYQ with Solutions",
    description:
      "Master GATE Computer Science with 3,200+ previous year questions from 2000–2026. Complete solutions, interactive quizzes, and progress tracking for all CSE subjects.",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StudyGate – GATE CS Previous Year Questions Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyGate – GATE CS Previous Year Questions | Free PYQ with Solutions",
    description:
      "Master GATE Computer Science with 3,200+ previous year questions from 2000–2026. Complete solutions, interactive quizzes, and progress tracking.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <HomeContent />
      <SeoContent />
      <FaqSection />
    </>
  );
}
