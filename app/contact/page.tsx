import type { Metadata } from "next";
import { ContactContent } from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us – GATE CS Prep",
  description:
    "Get in touch with the GATE CS Prep team. Send us your feedback, suggestions, or report issues.",
  openGraph: {
    title: "Contact Us | GATE CS Prep",
    description:
      "Get in touch with the GATE CS Prep team. Send us your feedback, suggestions, or report issues.",
    url: "/contact",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
