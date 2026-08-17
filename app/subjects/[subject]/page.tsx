import type { Metadata } from "next";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { SubjectDetailContent } from "./SubjectDetailContent";

type Props = { params: Promise<{ subject: string }> };

function slugToName(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: slug } = await params;
  const name = slugToName(slug);

  return buildMetadata({
    title: `${name} — GATE CS Prep`,
    description: `GATE Computer Science ${name} previous year questions with solutions. Browse by topic, difficulty, and year.`,
    path: `/subjects/${slug}`,
  });
}

export default async function SubjectDetailPage({ params }: Props) {
  const { subject: slug } = await params;
  const name = slugToName(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Subjects", item: `${SITE_URL}/subjects` },
      { "@type": "ListItem", position: 3, name },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SubjectDetailContent />
    </>
  );
}
