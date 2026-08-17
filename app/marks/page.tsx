import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { MarksPageContent } from "./MarksPageContent";

export const metadata: Metadata = buildMetadata({
  title: "Marks Distribution — GATE CS Prep",
  description:
    "Subject-wise and set-wise marks distribution for GATE Computer Science papers. Analyze marking patterns across years and subjects.",
  path: "/marks",
});

export default function MarksPage() {
  return <MarksPageContent />;
}
