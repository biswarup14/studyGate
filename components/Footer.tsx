import Link from "next/link";
import { FAQ_DATA } from "@/app/FaqSection";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50 mt-auto">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* FAQ Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <h2 className="text-lg font-bold mb-5">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FAQ_DATA.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-border bg-card overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-3 px-5 py-3.5 cursor-pointer text-sm font-semibold select-none hover:bg-muted/60 transition-colors list-none [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <svg
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50">
                <p className="pt-3">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="border-t border-border" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-blue-600 text-primary-foreground text-xs font-black">
                G
              </span>
              GATE CS Prep
            </h3>
            <p className="text-sm text-muted-foreground">
              Previous year questions with solutions for GATE Computer Science preparation. 2000–2026 coverage.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/questions" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Browse Questions</Link>
              <Link href="/subjects" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Subjects</Link>
              <Link href="/quiz" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Practice Quiz</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Legal</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              <Link href="/privacy-policy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Terms &amp; Conditions</Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Sources</h3>
            <p className="text-sm text-muted-foreground">
              Questions sourced from <a href="https://gateoverflow.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GATEOverflow</a> (CC BY-SA) and official IIT Guwahati GATE 2026 papers.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          © 2026 GATE CS Prep. Not affiliated with IITs or GATE organizing bodies.
        </div>
      </div>
    </footer>
  );
}
