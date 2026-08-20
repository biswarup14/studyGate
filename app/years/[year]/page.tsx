import type { Metadata } from "next";
import { YearDetailContent } from "./YearDetailContent";

type Props = { params: Promise<{ year: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const title = `GATE ${year} CSE Questions – Previous Year Paper Solutions`;
  const description = `Solve all GATE ${year} Computer Science previous year questions on StudyGate. Complete solutions with explanations for all shifts of GATE ${year} CSE paper.`;

  return {
    title,
    description,
    openGraph: {
      title: `GATE ${year} CSE Questions | StudyGate`,
      description,
      url: `/years/${year}`,
    },
    alternates: {
      canonical: `/years/${year}`,
    },
  };
}

export default async function YearDetailPage({ params }: Props) {
  await params;
  return <YearDetailContent />;
}
