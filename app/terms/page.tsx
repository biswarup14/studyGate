import type { Metadata } from "next";
import { TermsContent } from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms & Conditions – GATE CS Prep",
  description:
    "Terms and conditions for using GATE CS Prep. Read about acceptable use, intellectual property, and liability.",
  openGraph: {
    title: "Terms & Conditions | GATE CS Prep",
    description:
      "Terms and conditions for using GATE CS Prep. Read about acceptable use, intellectual property, and liability.",
    url: "/terms",
  },
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return <TermsContent />;
}
