"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/ui/lightbox";
import type { ProductCardRow } from "@/lib/cms/types";

export function CaseVisuals({ cards }: { cards: ProductCardRow[] }) {
  const photos = cards
    .filter((card) => card.image_url)
    .map((card) => ({
      src: card.image_url,
      alt: card.description || card.title,
      caption: card.title,
    }));
  const [open, setOpen] = useState<number | null>(null);

  if (!photos.length) return null;

  return (
    <>
      <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <li key={`${photo.src}-${photo.caption}-${index}`}>
            <button
              type="button"
              onClick={() => setOpen(index)}
              className="group relative block w-full overflow-hidden rounded-[1.1rem] border border-border bg-bg-card text-left"
            >
              <span className="relative block aspect-[4/3]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </span>
              <span className="block px-3 py-2 text-xs text-muted">{photo.caption}</span>
            </button>
          </li>
        ))}
      </ul>
      {open !== null ? (
        <Lightbox
          photos={photos}
          index={open}
          onClose={() => setOpen(null)}
          onPrev={() => setOpen((value) => (value === null ? 0 : (value - 1 + photos.length) % photos.length))}
          onNext={() => setOpen((value) => (value === null ? 0 : (value + 1) % photos.length))}
        />
      ) : null}
    </>
  );
}
