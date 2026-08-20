import type { Metadata } from "next";
import { QuestionDetailContent } from "./QuestionDetailContent";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = `GATE Question ${id} – Solution & Explanation`;
  const description = `View the detailed solution and explanation for GATE question ${id} on StudyGate. Practice GATE CS previous year questions with step-by-step solutions.`;

  return {
    title,
    description,
    openGraph: {
      title: `GATE Question ${id} | StudyGate`,
      description,
      url: `/questions/${id}`,
    },
    alternates: {
      canonical: `/questions/${id}`,
    },
  };
}

export default async function QuestionDetailPage({ params }: Props) {
  await params;
  return <QuestionDetailContent />;
}
