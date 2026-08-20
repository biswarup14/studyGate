import type { Metadata } from "next";
import { SubjectsPageContent } from "./SubjectsPageContent";

export const metadata: Metadata = {
  title: "GATE CS Subjects – DBMS, OS, COA, DSA, CN, DM & More",
  description:
    "Explore all GATE Computer Science subjects on StudyGate. Practice PYQ for DBMS, Operating Systems, Computer Architecture, Data Structures, Algorithms, Computer Networks, Discrete Mathematics, and more.",
  openGraph: {
    title: "GATE CS Subjects | StudyGate – PYQ by Subject",
    description:
      "Explore and practice GATE PYQ organized by all CSE subjects including DBMS, OS, COA, DSA, CN, DM, and more.",
    url: "/subjects",
  },
  alternates: {
    canonical: "/subjects",
  },
};

export default function SubjectsPage() {
  return <SubjectsPageContent />;
}
