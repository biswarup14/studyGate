"use client";
import { useEffect, useRef } from "react";

interface MathBlockProps {
  text: string;
  className?: string;
}

function splitLatex(text: string): Array<{ type: "text" | "math" | "displaymath"; content: string }> {
  const parts: Array<{ type: "text" | "math" | "displaymath"; content: string }> = [];
  let i = 0;

  while (i < text.length) {
    // Display math $$...$$
    if (text[i] === "$" && text[i + 1] === "$") {
      const end = text.indexOf("$$", i + 2);
      if (end !== -1) {
        parts.push({ type: "displaymath", content: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    // Inline math $...$
    if (text[i] === "$") {
      const end = text.indexOf("$", i + 1);
      if (end !== -1) {
        parts.push({ type: "math", content: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    // Text until next $
    let next = text.indexOf("$", i);
    if (next === -1) next = text.length;
    parts.push({ type: "text", content: text.slice(i, next) });
    i = next;
  }

  return parts;
}

export function MathBlock({ text, className }: MathBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return;

    import("katex").then((katex) => {
      if (!ref.current) return;
      const parts = splitLatex(text);
      const html = parts
        .map((part) => {
          if (part.type === "text") {
            return part.content
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/\n/g, "<br/>");
          }
          try {
            const displayMode = part.type === "displaymath";
            return katex.default.renderToString(part.content, {
              throwOnError: false,
              displayMode,
            });
          } catch {
            return `<span class="text-error">${part.content}</span>`;
          }
        })
        .join("");
      ref.current.innerHTML = html;
    });
  }, [text]);

  return <div ref={ref} className={className} />;
}
