"use client";

import { useState } from "react";
import Image from "next/image";
import { experience } from "@/config/site";
import { Lightbox } from "@/components/ui/lightbox";

export function ExperiencePhotos() {
  const photos = experience.photos;
  const [open, setOpen] = useState<number | null>(null);

  if (!photos.length) return null;

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
      {photos.map((photo, index) => (
        <button
          key={photo.src}
          type="button"
          onClick={() => setOpen(index)}
          className="group relative overflow-hidden rounded-[1.1rem] border border-border"
        >
          <span className="relative block aspect-[4/3]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </span>
        </button>
      ))}
      {open !== null ? (
        <Lightbox
          photos={photos}
          index={open}
          onClose={() => setOpen(null)}
          onPrev={() => setOpen((value) => (value === null ? 0 : (value - 1 + photos.length) % photos.length))}
          onNext={() => setOpen((value) => (value === null ? 0 : (value + 1) % photos.length))}
        />
      ) : null}
    </div>
  );
}
