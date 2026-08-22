"use client";

import { useState } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { Lightbox } from "@/components/ui/lightbox";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import type { GalleryRow } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

export function LifeGallery({ photos }: { photos: GalleryRow[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const lightboxPhotos = photos.map((photo) => ({
    src: photo.image_url,
    alt: photo.description || photo.title,
    caption: photo.title,
  }));

  return (
    <Section
      id="gallery"
      eyebrow="Photo Gallery"
      title="Real photographs from the work"
      description="Personal, work, and project photographs — no stock imagery. Click any image to open it."
    >
      <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {photos.map((photo, index) => (
          <StaggerItem
            key={photo.id}
            className={index === 0 ? "col-span-2" : ""}
          >
            <button
              type="button"
              onClick={() => setOpen(index)}
              className="group relative block w-full overflow-hidden rounded-[1.2rem] border border-border bg-bg-card text-left"
            >
              <span
                className={cn(
                  "relative block",
                  index === 0 ? "aspect-[16/10]" : "aspect-[4/3]",
                )}
              >
                <Image
                  src={photo.image_url}
                  alt={photo.description || photo.title}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-700 group-hover:scale-[1.04]",
                    (photo.category === "Projects" || photo.category === "FIRE Nepal") && "object-top",
                  )}
                  sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                />
              </span>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 py-3">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
                  {photo.category}
                </span>
                <span className="mt-1 block text-xs text-white">{photo.title}</span>
              </span>
            </button>
          </StaggerItem>
        ))}
      </Stagger>
      {open !== null ? (
        <Lightbox
          photos={lightboxPhotos}
          index={open}
          onClose={() => setOpen(null)}
          onPrev={() => setOpen((value) => (value === null ? 0 : (value - 1 + photos.length) % photos.length))}
          onNext={() => setOpen((value) => (value === null ? 0 : (value + 1) % photos.length))}
        />
      ) : null}
    </Section>
  );
}
