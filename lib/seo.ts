import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gate-cs-prep.vercel.app";
const SITE_NAME = "GATE CS Prep";
const DEFAULT_DESCRIPTION =
  "3,200+ GATE Computer Science previous year questions (2000–2026) with interactive quizzes, subject-wise browsing, and progress tracking.";

export { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION };

export function buildMetadata(opts: {
  title: string;
  description?: string;
  path?: string;
  noindex?: boolean;
}): Metadata {
  const description = opts.description || DEFAULT_DESCRIPTION;
  const url = opts.path ? `${SITE_URL}${opts.path}` : SITE_URL;

  return {
    title: opts.title,
    description,
    robots: opts.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: opts.title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}
