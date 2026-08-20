import { YearDetailContent } from "./YearDetailContent";

type Props = { params: Promise<{ year: string }> };

export default async function YearDetailPage({ params }: Props) {
  const { year } = await params;
  return <YearDetailContent />;
}
