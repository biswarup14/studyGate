import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-sm mb-3">GATE CS Prep</h3>
            <p className="text-sm text-muted-foreground">
              Previous year questions with solutions for GATE Computer Science preparation. 2000–2026 coverage.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/questions" className="block text-sm text-muted-foreground hover:text-primary">Browse Questions</Link>
              <Link href="/subjects" className="block text-sm text-muted-foreground hover:text-primary">Subjects</Link>
              <Link href="/quiz" className="block text-sm text-muted-foreground hover:text-primary">Practice Quiz</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Sources</h3>
            <p className="text-sm text-muted-foreground">
              Questions sourced from <a href="https://gateoverflow.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary">GATEOverflow</a> (CC BY-SA) and official IIT Guwahati GATE 2026 papers.
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
