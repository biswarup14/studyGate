import { SubjectDetailContent } from "./SubjectDetailContent";

type Props = { params: Promise<{ subject: string }> };

export default async function SubjectDetailPage({ params }: Props) {
  const { subject: slug } = await params;
  return <SubjectDetailContent />;
}
