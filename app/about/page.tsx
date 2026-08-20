import type { Metadata } from "next";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us – GATE CS Prep",
  description:
    "Learn about GATE CS Prep – a free platform for practicing GATE Computer Science previous year questions with detailed solutions.",
  openGraph: {
    title: "About Us | GATE CS Prep",
    description:
      "Learn about GATE CS Prep – a free platform for practicing GATE Computer Science previous year questions with detailed solutions.",
    url: "/about",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
