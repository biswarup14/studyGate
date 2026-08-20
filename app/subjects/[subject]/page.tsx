import type { Metadata } from "next";
import { SubjectDetailContent } from "./SubjectDetailContent";
import { subjectFromSlug } from "@/lib/types";

type Props = { params: Promise<{ subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: slug } = await params;
  const subjectName = subjectFromSlug(slug);
  const title = `${subjectName} PYQ GATE – Previous Year Questions with Solutions`;
  const description = `Practice ${subjectName} previous year questions (PYQ) for GATE CSE on StudyGate. Solve real GATE questions with detailed solutions and explanations.`;

  return {
    title,
    description,
    openGraph: {
      title: `${subjectName} PYQ GATE | StudyGate`,
      description,
      url: `/subjects/${slug}`,
    },
    alternates: {
      canonical: `/subjects/${slug}`,
    },
  };
}

export default async function SubjectDetailPage({ params }: Props) {
  await params;
  return <SubjectDetailContent />;
}
