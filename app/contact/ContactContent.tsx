"use client";

import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export function ContactContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
      />

      <div className="space-y-8 max-w-3xl">
        <Reveal delay={1}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Get in Touch</h2>
            <p className="text-muted-foreground leading-relaxed">
              Have feedback, found a bug, or want to suggest a feature? We appreciate hearing
              from our users. Drop us an email and we&apos;ll get back to you as soon as possible.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:biswarup_b@outlook.com"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                biswarup_b@outlook.com
              </a>
            </div>
          </section>
        </Reveal>

        <Reveal delay={2}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">What to Reach Out About</h2>
            <ul className="space-y-2 text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>Bug reports:</strong> Found an incorrect answer or a broken feature? Let us know.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>Feature requests:</strong> Have an idea that would improve your study experience?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>Content corrections:</strong> Spotted an error in a question or solution?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>General feedback:</strong> Tell us what you like or what could be better.</span>
              </li>
            </ul>
          </section>
        </Reveal>

        <Reveal delay={3}>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-3">Response Time</h2>
            <p className="text-muted-foreground leading-relaxed">
              We are a small team and try to respond within a few days. For urgent issues
              (e.g., incorrect answers on multiple questions), please mention &quot;urgent&quot; in your
              email subject line.
            </p>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
