import type { Metadata } from "next";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { YearDetailContent } from "./YearDetailContent";

type Props = { params: Promise<{ year: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;

  return buildMetadata({
    title: `GATE ${year} — GATE CS Prep`,
    description: `GATE Computer Science ${year} previous year questions with solutions. Browse all questions from the ${year} paper.`,
    path: `/years/${year}`,
  });
}

export default async function YearDetailPage({ params }: Props) {
  const { year } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Questions", item: `${SITE_URL}/questions` },
      { "@type": "ListItem", position: 3, name: `GATE ${year}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <YearDetailContent />
    </>
  );
}
