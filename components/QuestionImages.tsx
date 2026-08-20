import type { QuestionImage } from "@/lib/types";
import { resolveImageSrc } from "@/lib/images";
import Image from "next/image";

export function QuestionImages({ images }: { images: QuestionImage[] }) {
  if (images.length === 0) return null;
  return (
    <div className="my-4 space-y-3">
      {images.map((img, i) => (
        <div key={i} className="relative w-full max-h-80">
          <Image
            src={resolveImageSrc(img.src, img.kind)}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain rounded-lg border border-border"
          />
        </div>
      ))}
    </div>
  );
}
