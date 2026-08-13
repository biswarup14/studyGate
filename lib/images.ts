import type { QuestionImage } from "./types";

const IMG_REGEX = /\[IMAGE:\d+\]/g;

/** Number of [IMAGE:n] placeholders in a string. */
export function placeholderCount(input: string): number {
  if (!input.includes("[IMAGE")) return 0;
  return input.match(IMG_REGEX)?.length || 0;
}

/** Replace [IMAGE:n] placeholders (in order) with <img> HTML, starting at images[offset]. */
export function resolveImagePlaceholders(
  input: string,
  images?: QuestionImage[],
  offset = 0
): string {
  if (!images || images.length === 0 || !input.includes("[IMAGE")) {
    return input;
  }
  let idx = 0;
  return input.replace(IMG_REGEX, () => {
    const img = images[offset + idx];
    idx++;
    return img ? imageTagHtml(img) : "";
  });
}

/** Remove all [IMAGE:n] placeholders (used for card previews). */
export function stripImagePlaceholders(input: string): string {
  return input.replace(IMG_REGEX, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");
}

/** Point a remote blob URL at the local legacy store; serve local files directly. */
export function resolveImageSrc(src: string, kind: QuestionImage["kind"]): string {
  if (kind === "local") return src;
  const m = src.match(/qa_blobid=(\d+)/);
  if (m) return `/api/images/${m[1]}?url=${encodeURIComponent(src)}`;
  return src;
}

function imageTagHtml(img: QuestionImage): string {
  return `<img src="${escapeAttr(resolveImageSrc(img.src, img.kind))}" alt="" loading="lazy" class="q-img" />`;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
