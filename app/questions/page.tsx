"use client";
import { Suspense } from "react";
import { QuestionsContent } from "./QuestionsContent";

export default function QuestionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <QuestionsContent />
    </Suspense>
  );
}
