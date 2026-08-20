"use client";

import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export function AboutContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="About Us"
        subtitle="Our mission to make GATE CS preparation accessible"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      <div className="space-y-8 max-w-3xl">
        <Reveal delay={1}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">What is GATE CS Prep?</h2>
            <p className="text-muted-foreground leading-relaxed">
              GATE CS Prep is a free, open platform designed to help Computer Science students
              prepare for the GATE (Graduate Aptitude Test in Engineering) examination. We provide
              previous year questions (PYQ) from 2000 to 2026, organized by subject, year, and
              marks, along with detailed solutions.
            </p>
          </section>
        </Reveal>

        <Reveal delay={2}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our goal is to make quality GATE preparation materials accessible to every student,
              regardless of their background. We believe that practicing past papers is one of the
              most effective ways to prepare for competitive exams, and we want to remove barriers
              to accessing these resources.
            </p>
          </section>
        </Reveal>

        <Reveal delay={3}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Features</h2>
            <ul className="space-y-2 text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                Browse questions filtered by subject, year, and marks
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                Practice with timed quizzes to simulate exam conditions
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                Track your progress across subjects
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                View detailed solutions with step-by-step explanations
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                Dark mode support for comfortable studying
              </li>
            </ul>
          </section>
        </Reveal>

        <Reveal delay={4}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Sources & Attribution</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions on this platform are sourced from{" "}
              <a
                href="https://gateoverflow.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GATEOverflow
              </a>{" "}
              (licensed under CC BY-SA) and official GATE question papers. We do not claim
              ownership of the original questions. Solutions and explanations are provided for
              educational purposes.
            </p>
          </section>
        </Reveal>

        <Reveal delay={5}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              GATE CS Prep is not affiliated with IITs, IISc, or any GATE organizing body. GATE
              is a registered trademark of the Indian Institutes of Technology and the National
              Coordination Board. This is an independent educational resource.
            </p>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
