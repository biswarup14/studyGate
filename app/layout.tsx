import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/components/SessionProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gate-cs-prep.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "StudyGate – GATE CS Previous Year Questions | PYQ Solutions 2000–2026",
    template: "%s | StudyGate – GATE CS Prep",
  },
  description:
    "StudyGate is the ultimate GATE Computer Science preparation platform. Access 3,200+ GATE PYQ (Previous Year Questions) from 2000–2026 with detailed solutions, interactive quizzes, and progress tracking. Cover all CSE subjects – DBMS, OS, COA, DSA, CN, DM, C Programming, and more.",
  keywords: [
    "StudyGate",
    "gate exam",
    "gate pyq",
    "gate pyq cse",
    "gate 2027 syllabus cse",
    "gate 2026 result",
    "gate 2027",
    "gate 2027 registration last date",
    "gate exam date 2026",
    "dbms pyq gate",
    "os pyq gate",
    "coa pyq gate",
    "dm pyq gate",
    "dsa pyq gate",
    "cn pyq gate",
    "c programming gate",
    "gate computer science",
    "gate cse previous year questions",
    "gate preparation",
    "gate cse questions with solutions",
  ],
  authors: [{ name: "StudyGate" }],
  creator: "StudyGate",
  publisher: "StudyGate",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "StudyGate – GATE CS Prep",
    title: "StudyGate – GATE CS Previous Year Questions | PYQ Solutions 2000–2026",
    description:
      "Master GATE Computer Science with 3,200+ previous year questions from 2000–2026. Complete solutions, interactive quizzes, and progress tracking for all CSE subjects.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StudyGate – GATE CS Previous Year Questions Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyGate – GATE CS Previous Year Questions | PYQ Solutions 2000–2026",
    description:
      "Master GATE Computer Science with 3,200+ previous year questions from 2000–2026. Complete solutions, interactive quizzes, and progress tracking.",
    images: ["/og-image.png"],
    creator: "@StudyGate",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {},
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "StudyGate",
    alternateName: "GATE CS Prep",
    url: SITE_URL,
    description:
      "StudyGate is the ultimate GATE Computer Science preparation platform with 3,200+ previous year questions from 2000–2026, complete solutions, interactive quizzes, and progress tracking.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    author: {
      "@type": "Organization",
      name: "StudyGate",
      url: SITE_URL,
    },
    datePublished: "2025-01-01",
    dateModified: "2026-08-21",
    inLanguage: "en",
    keywords: "StudyGate, GATE exam, GATE PYQ, GATE CSE, previous year questions, GATE preparation",
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1 pb-14 md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
            <ScrollToTop />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
