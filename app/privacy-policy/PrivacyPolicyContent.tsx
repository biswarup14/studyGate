"use client";

import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export function PrivacyPolicyContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your information"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
      />

      <div className="space-y-8 max-w-3xl">
        <Reveal delay={1}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you use GATE CS Prep, we may collect the following information:
            </p>
            <ul className="mt-3 space-y-2 text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>Account information:</strong> If you sign in, we store your name and email address provided by your authentication provider (Google or email/password).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>Usage data:</strong> Questions you attempt, quiz scores, and progress data are stored to provide you with tracking features.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>Technical data:</strong> Standard web server logs including IP address, browser type, and device information.</span>
              </li>
            </ul>
          </section>
        </Reveal>

        <Reveal delay={2}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the collected information for the following purposes:
            </p>
            <ul className="mt-3 space-y-2 text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                To provide and maintain the platform features
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                To track your learning progress and quiz performance
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                To improve the platform and user experience
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                To ensure security and prevent abuse
              </li>
            </ul>
          </section>
        </Reveal>

        <Reveal delay={3}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              GATE CS Prep uses minimal cookies necessary for the platform to function:
            </p>
            <ul className="mt-3 space-y-2 text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>Session cookies:</strong> Required for authentication and keeping you signed in.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>Theme preference:</strong> Stores your light/dark mode preference locally in your browser.</span>
              </li>
            </ul>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We do not use third-party advertising or tracking cookies.
            </p>
          </section>
        </Reveal>

        <Reveal delay={4}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or share your personal information with third parties. Your
              data is only used to provide the services on this platform. We may disclose
              information only if required by law or to protect the rights and safety of our
              users.
            </p>
          </section>
        </Reveal>

        <Reveal delay={5}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement reasonable security measures to protect your personal information.
              However, no method of transmission over the internet is 100% secure. We strive to
              use commercially acceptable means to protect your data but cannot guarantee absolute
              security.
            </p>
          </section>
        </Reveal>

        <Reveal delay={6}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to:
            </p>
            <ul className="mt-3 space-y-2 text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                Access the personal data we hold about you
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                Request deletion of your account and associated data
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                Opt out of non-essential data collection
              </li>
            </ul>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              To exercise these rights, please contact us at{" "}
              <a href="mailto:biswarup_b@outlook.com" className="text-primary hover:underline">
                biswarup_b@outlook.com
              </a>.
            </p>
          </section>
        </Reveal>

        <Reveal delay={6}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this privacy policy from time to time. Any changes will be posted on
              this page with an updated revision date. Continued use of the platform after changes
              constitutes acceptance of the revised policy.
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
