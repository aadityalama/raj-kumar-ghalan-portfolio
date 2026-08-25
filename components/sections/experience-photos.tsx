"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/ui/lightbox";
import type { ExperiencePhotoRow } from "@/lib/cms/types";

export function ExperiencePhotos({ photos }: { photos: ExperiencePhotoRow[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const visible = photos.filter((photo) => photo.visible && photo.image_url);

  if (!visible.length) return null;

  const lightboxPhotos = visible.map((photo) => ({
    src: photo.image_url,
    alt: photo.alt || photo.caption,
    caption: photo.caption,
  }));

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
      {visible.map((photo, index) => (
        <button
          key={photo.id}
          type="button"
          onClick={() => setOpen(index)}
          className="group relative overflow-hidden rounded-[1.1rem] border border-border"
        >
          <span className="relative block aspect-[4/3]">
            <Image
              src={photo.image_url}
              alt={photo.alt || photo.caption}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </span>
        </button>
      ))}
      {open !== null ? (
        <Lightbox
          photos={lightboxPhotos}
          index={open}
          onClose={() => setOpen(null)}
          onPrev={() =>
            setOpen((value) => (value === null ? 0 : (value - 1 + visible.length) % visible.length))
          }
          onNext={() => setOpen((value) => (value === null ? 0 : (value + 1) % visible.length))}
        />
      ) : null}
    </div>
  );
}
