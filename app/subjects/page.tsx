import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SubjectsPageContent } from "./SubjectsPageContent";

export const metadata: Metadata = buildMetadata({
  title: "All Subjects — GATE CS Prep",
  description:
    "Browse all 13 GATE Computer Science subjects including Data Structures, Algorithms, Operating Systems, Databases, Computer Networks, and more.",
  path: "/subjects",
});

export default function SubjectsPage() {
  return <SubjectsPageContent />;
}
