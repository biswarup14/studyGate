import Link from "next/link";
import { SUBJECT_COLORS, SUBJECT_ICONS } from "@/lib/types";

interface SubjectCardProps {
  name: string;
  count: number;
}

export function SubjectCard({ name, count }: SubjectCardProps) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <Link
      href={`/subjects/${slug}`}
      className="relative overflow-hidden rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all bg-card group p-4"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${SUBJECT_COLORS[name] || "from-gray-500 to-gray-600"} opacity-5 group-hover:opacity-10 transition-opacity`} />

      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${SUBJECT_COLORS[name] || "from-gray-500 to-gray-600"} text-white text-sm font-bold mb-3`}>
        {SUBJECT_ICONS[name] || name.slice(0, 3)}
      </div>

      <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{name}</h3>
      <p className="text-xs text-muted-foreground">
        {count} question{count !== 1 ? "s" : ""}
      </p>

      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
