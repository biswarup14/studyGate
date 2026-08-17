import { readFileSync } from "fs";
import { join } from "path";
import type { MetadataRoute } from "next";
import type { IndexData } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gate-cs-prep.vercel.app";

function getIndex(): IndexData | null {
  try {
    const raw = readFileSync(join(process.cwd(), "public", "data", "index.json"), "utf-8");
    return JSON.parse(raw) as IndexData;
  } catch {
    return null;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const index = getIndex();
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/questions`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/subjects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/quiz`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/marks`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Subject pages
  const subjectPages: MetadataRoute.Sitemap = (index?.subjects || []).map((s) => ({
    url: `${SITE_URL}/subjects/${s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Year pages
  const yearPages: MetadataRoute.Sitemap = Object.keys(index?.years || {}).map((y) => ({
    url: `${SITE_URL}/years/${y}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Question pages — read from subject-index to avoid loading the full 12MB file
  let questionPages: MetadataRoute.Sitemap = [];
  try {
    const raw = readFileSync(join(process.cwd(), "public", "data", "question-subjects.json"), "utf-8");
    const questionSubjects = JSON.parse(raw) as Record<string, string>;
    questionPages = Object.keys(questionSubjects).map((id) => ({
      url: `${SITE_URL}/questions/${id}`,
      lastModified: now,
      changeFrequency: "never" as const,
      priority: 0.5,
    }));
  } catch {
    // If the file doesn't exist, just skip question pages
  }

  return [...staticPages, ...subjectPages, ...yearPages, ...questionPages];
}
