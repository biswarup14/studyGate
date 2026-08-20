import { QuestionDetailContent } from "./QuestionDetailContent";

type Props = { params: Promise<{ id: string }> };

export default async function QuestionDetailPage({ params }: Props) {
  await params;
  return <QuestionDetailContent />;
}
