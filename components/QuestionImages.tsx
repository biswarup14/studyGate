import type { QuestionImage } from "@/lib/types";
import { resolveImageSrc } from "@/lib/images";

export function QuestionImages({ images }: { images: QuestionImage[] }) {
  if (images.length === 0) return null;
  return (
    <div className="my-4 space-y-3">
      {images.map((img, i) => (
        /* eslint-disable-next-line @next/next/no-img-element -- dynamic remote/local images, unknown dimensions */
        <img
          key={i}
          src={resolveImageSrc(img.src, img.kind)}
          alt=""
          loading="lazy"
          className="q-img !my-0 max-h-80"
        />
      ))}
    </div>
  );
}
