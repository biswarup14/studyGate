import Link from "next/link";
import { SUBJECT_COLORS, SUBJECT_ICONS } from "@/lib/types";

interface SubjectCardProps {
  name: string;
  count: number;
  attempted?: number;
}

export function SubjectCard({ name, count, attempted = 0 }: SubjectCardProps) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const percent = count > 0 ? Math.min(100, Math.round((attempted / count) * 100)) : 0;

  return (
    <Link
      href={`/subjects/${slug}`}
      className="relative overflow-hidden rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all bg-card group p-4 flex flex-col hover-lift btn-press"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${SUBJECT_COLORS[name] || "from-gray-500 to-gray-600"} opacity-5 group-hover:opacity-10 transition-opacity`} />

      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${SUBJECT_COLORS[name] || "from-gray-500 to-gray-600"} text-white text-sm font-bold mb-3 shadow-md transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3`}>
        {SUBJECT_ICONS[name] || name.slice(0, 3)}
      </div>

      <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{name}</h3>
      <p className="text-[13px] text-muted-foreground">
        {count} question{count !== 1 ? "s" : ""}
      </p>

      {attempted > 0 ? (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">
              {attempted}/{count} attempted
            </span>
            <span className={`font-semibold ${percent >= 70 ? "text-success" : percent >= 30 ? "text-amber-500" : "text-muted-foreground"}`}>
              {percent}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${SUBJECT_COLORS[name] || "from-gray-500 to-gray-600"} transition-all duration-700 ease-out`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground mt-3 border border-dashed border-border rounded-md px-2 py-1 inline-block w-fit">
          Not started
        </p>
      )}

      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0">
        <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
