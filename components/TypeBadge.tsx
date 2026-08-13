import type { Question } from "@/lib/types";

const TYPE_STYLES: Record<Question["type"], { label: string; cls: string }> = {
  mcq: { label: "MCQ", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  msq: { label: "MSQ", cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  nat: { label: "NAT", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
};

export function TypeBadge({ type }: { type: Question["type"] }) {
  const { label, cls } = TYPE_STYLES[type];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}
