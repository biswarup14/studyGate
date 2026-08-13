import Link from "next/link";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  iconClass?: string;
  back?: { href: string; label: string };
  right?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  iconClass = "bg-gradient-to-br from-primary to-blue-600",
  back,
  right,
}: PageHeaderProps) {
  return (
    <div className="mb-8 animate-slide-down">
      {back && (
        <Link
          href={back.href}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {back.label}
        </Link>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-4 min-w-0 group">
          {icon && (
            <span
              className={`flex items-center justify-center w-12 h-12 rounded-2xl text-white text-lg font-bold shadow-md shrink-0 transition-transform duration-200 group-hover:scale-110 ${iconClass}`}
            >
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        </div>
        {right && <div className="flex items-center gap-2 flex-wrap shrink-0">{right}</div>}
      </div>
    </div>
  );
}
