import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LoginPageContent } from "./LoginPageContent";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Sign In — GATE CS Prep",
    description: "Sign in to track your GATE CS preparation progress.",
    path: "/login",
    noindex: true,
  }),
};

export default function LoginPage() {
  return <LoginPageContent />;
}
