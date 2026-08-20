"use client";

import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export function TermsContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using GATE CS Prep"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />

      <div className="space-y-8 max-w-3xl">
        <Reveal delay={1}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using GATE CS Prep, you agree to be bound by these Terms &
              Conditions. If you do not agree with any part of these terms, please do not use
              the platform.
            </p>
          </section>
        </Reveal>

        <Reveal delay={2}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Use of the Platform</h2>
            <p className="text-muted-foreground leading-relaxed">
              GATE CS Prep is provided for educational purposes. You may use the platform to:
            </p>
            <ul className="mt-3 space-y-2 text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                Browse and practice previous year GATE questions
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                Take timed quizzes to assess your preparation
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                Track your learning progress over time
              </li>
            </ul>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              You agree not to misuse the platform, attempt to gain unauthorized access, or
              interfere with its operation.
            </p>
          </section>
        </Reveal>

        <Reveal delay={3}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The platform design, code, UI components, and explanations are the intellectual
              property of GATE CS Prep. Questions sourced from GATEOverflow are used under the
              CC BY-SA license. Official GATE questions belong to their respective owners (IITs
              and the GATE organizing body).
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              You may not copy, redistribute, or commercially exploit the platform&apos;s content
              without prior written permission.
            </p>
          </section>
        </Reveal>

        <Reveal delay={4}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you create an account, you are responsible for maintaining the confidentiality
              of your credentials and for all activities that occur under your account. You agree
              to notify us immediately of any unauthorized use.
            </p>
          </section>
        </Reveal>

        <Reveal delay={5}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              GATE CS Prep is provided &quot;as is&quot; without warranties of any kind. We do not
              guarantee the accuracy, completeness, or timeliness of the content. We shall not
              be liable for any indirect, incidental, or consequential damages arising from your
              use of the platform.
            </p>
          </section>
        </Reveal>

        <Reveal delay={6}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Platform Availability</h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to keep the platform available at all times, but we do not guarantee
              uninterrupted access. We may perform maintenance or updates that temporarily
              affect availability. We reserve the right to modify or discontinue the platform at
              any time.
            </p>
          </section>
        </Reveal>

        <Reveal delay={6}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to update these terms at any time. Changes will be effective
              immediately upon posting. Your continued use of the platform after changes are
              posted constitutes acceptance of the revised terms.
            </p>
          </section>
        </Reveal>

        <Reveal delay={6}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these terms, please contact us at{" "}
              <a href="mailto:biswarup_b@outlook.com" className="text-primary hover:underline">
                biswarup_b@outlook.com
              </a>.
            </p>
          </section>
        </Reveal>

        <Reveal delay={6}>
          <p className="text-sm text-muted-foreground">
            Last updated: August 2026
          </p>
        </Reveal>
      </div>
    </div>
  );
}
