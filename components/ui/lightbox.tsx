"use client";

import { useEffect } from "react";
import Image from "next/image";

export type LightboxPhoto = {
  src: string;
  alt: string;
  caption?: string;
};

export function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: readonly LightboxPhoto[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[index];

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onNext, onPrev]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption || photo.alt}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/88 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-[calc(1rem+var(--safe-top))] right-4 min-h-11 min-w-11 rounded-full border border-white/20 text-white"
        aria-label="Close photo"
      >
        ×
      </button>
      {photos.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onPrev();
            }}
            className="absolute left-3 min-h-11 min-w-11 rounded-full border border-white/20 text-white sm:left-6"
            aria-label="Previous photo"
          >
            ←
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
            className="absolute right-3 min-h-11 min-w-11 rounded-full border border-white/20 text-white sm:right-6"
            aria-label="Next photo"
          >
            →
          </button>
        </>
      ) : null}
      <figure
        className="relative max-h-[82dvh] w-full max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative mx-auto aspect-[4/3] max-h-[72dvh] w-full">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 1024px"
            priority
          />
        </div>
        {photo.caption ? (
          <figcaption className="mt-4 text-center text-sm text-white/75">
            {photo.caption}
          </figcaption>
        ) : null}
      </figure>
    </div>
  );
}
