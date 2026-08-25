"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/ui/lightbox";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import type { GalleryRow } from "@/lib/cms/types";

function photoAlt(photo: GalleryRow) {
  return photo.description?.trim() || photo.title?.trim() || `${photo.category} photograph`;
}

export function PhotoGallery({ photos }: { photos: GalleryRow[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const lightboxPhotos = photos.map((photo) => ({
    src: photo.image_url,
    alt: photoAlt(photo),
    caption: photo.title,
  }));

  if (!photos.length) {
    return (
      <p className="max-w-xl text-base leading-relaxed text-muted">
        Photos will appear here as they are published from the admin gallery.
      </p>
    );
  }

  return (
    <>
      <Stagger className="columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3 lg:gap-6">
        {photos.map((photo, index) => (
          <StaggerItem key={photo.id} className="mb-4 break-inside-avoid sm:mb-5 lg:mb-6">
            <button
              type="button"
              onClick={() => setOpen(index)}
              className="group relative block w-full overflow-hidden rounded-[1.2rem] border border-border bg-bg-card text-left transition-[border-color,transform] duration-500 hover:border-accent/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <Image
                src={photo.image_url}
                alt={photoAlt(photo)}
                width={1600}
                height={1200}
                loading="lazy"
                className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02] group-active:scale-[0.995]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 py-4 opacity-100 transition-opacity duration-500 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
                  {photo.category}
                </span>
                <span className="mt-1 block text-sm text-white">{photo.title}</span>
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
          onPrev={() =>
            setOpen((value) =>
              value === null ? 0 : (value - 1 + photos.length) % photos.length,
            )
          }
          onNext={() =>
            setOpen((value) => (value === null ? 0 : (value + 1) % photos.length))
          }
        />
      ) : null}
    </>
  );
}
