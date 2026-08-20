import type { Metadata } from "next";
import { LoginPageContent } from "./LoginPageContent";

export const metadata: Metadata = {
  title: "Login – Track Your GATE Prep Progress",
  description:
    "Sign in to StudyGate to track your GATE CS preparation progress across subjects and questions. Save your quiz scores and monitor improvement.",
  openGraph: {
    title: "Login | StudyGate – GATE CS Prep",
    description: "Sign in to track your GATE CS preparation progress.",
    url: "/login",
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return <LoginPageContent />;
}
