import type { Metadata } from "next";
import { PrivacyPolicyContent } from "./PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy – GATE CS Prep",
  description:
    "Privacy policy for GATE CS Prep. Learn how we handle your data, cookies, and personal information.",
  openGraph: {
    title: "Privacy Policy | GATE CS Prep",
    description:
      "Privacy policy for GATE CS Prep. Learn how we handle your data, cookies, and personal information.",
    url: "/privacy-policy",
  },
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
