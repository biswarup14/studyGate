import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/components/SessionProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GATE CS Prep — Previous Year Questions & Solutions",
    template: "%s | GATE CS Prep",
  },
  description:
    "3,200+ GATE Computer Science previous year questions (2000–2026) with interactive quizzes, subject-wise browsing, and progress tracking.",
  keywords: ["GATE", "Computer Science", "CSE", "previous year questions", "PYQ", "preparation", "GATE 2026", "GATE CSE"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "GATE CS Prep",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "GATE CS Prep — Previous Year Questions & Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gate-cs-prep.vercel.app"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
