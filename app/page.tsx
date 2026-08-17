import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import type { IndexData } from "@/lib/types";
import { HomeContent } from "./HomeContent";

function getIndexData(): IndexData | null {
  try {
    const raw = readFileSync(join(process.cwd(), "public", "data", "index.json"), "utf-8");
    return JSON.parse(raw) as IndexData;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const index = getIndexData();
  const count = index?.total ?? 3200;

  return buildMetadata({
    title: "GATE CS Prep — Previous Year Questions & Solutions",
    description: `${count.toLocaleString()} GATE Computer Science previous year questions (2000–2026) with solutions, interactive quizzes, and progress tracking.`,
    path: "/",
  });
}

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GATE CS Prep",
    url: SITE_URL,
    description: "3,200+ GATE Computer Science previous year questions with solutions and quizzes.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/questions?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent />
    </>
  );
}
