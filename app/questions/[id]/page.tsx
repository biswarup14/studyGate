import type { Metadata } from "next";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { QuestionDetailContent } from "./QuestionDetailContent";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return buildMetadata({
    title: `Question ${id} — GATE CS Prep`,
    description: `GATE Computer Science previous year question with solution. View the question, options, and detailed explanation.`,
    path: `/questions/${id}`,
  });
}

export default async function QuestionDetailPage({ params }: Props) {
  const { id } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Questions", item: `${SITE_URL}/questions` },
      { "@type": "ListItem", position: 3, name: `Question ${id}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QuestionDetailContent />
    </>
  );
}
