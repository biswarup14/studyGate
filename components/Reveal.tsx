"use client";
import { type ReactNode } from "react";
import { useInView } from "@/lib/useInView";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  as?: "div" | "section" | "span";
}

const DELAY_CLASSES: Record<number, string> = {
  0: "",
  1: " reveal-delay-1",
  2: " reveal-delay-2",
  3: " reveal-delay-3",
  4: " reveal-delay-4",
  5: " reveal-delay-5",
  6: " reveal-delay-6",
};

export function Reveal({ children, className = "", delay = 0, as = "div" }: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const Tag = as as "div";
  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? " reveal-visible" : ""}${DELAY_CLASSES[delay]} ${className}`}
    >
      {children}
    </Tag>
  );
}
