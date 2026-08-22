"use client";

import { useState } from "react";
import Image from "next/image";
import { gallery } from "@/config/site";
import { Section } from "@/components/ui/section";
import { Lightbox } from "@/components/ui/lightbox";
import { Stagger, StaggerItem } from "@/components/ui/reveal";

export function LifeGallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section
      id="life"
      eyebrow="Life & Journey"
      title="Moments from the path"
      description="A small set of real photographs — portrait and the work of building digital products."
    >
      <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {gallery.map((photo, index) => (
          <StaggerItem key={photo.src} className={index === 0 ? "col-span-2 md:col-span-2" : ""}>
            <button
              type="button"
              onClick={() => setOpen(index)}
              className="group relative block w-full overflow-hidden rounded-[1.2rem] border border-border bg-bg-card text-left"
            >
              <span className={index === 0 ? "relative block aspect-[4/3]" : "relative block aspect-square"}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                />
              </span>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-3 text-xs text-white">
                {photo.caption}
              </span>
            </button>
          </StaggerItem>
        ))}
      </Stagger>
      {open !== null ? (
        <Lightbox
          photos={gallery}
          index={open}
          onClose={() => setOpen(null)}
          onPrev={() => setOpen((value) => (value === null ? 0 : (value - 1 + gallery.length) % gallery.length))}
          onNext={() => setOpen((value) => (value === null ? 0 : (value + 1) % gallery.length))}
        />
      ) : null}
    </Section>
  );
}
