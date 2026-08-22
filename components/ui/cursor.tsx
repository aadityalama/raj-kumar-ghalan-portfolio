"use client";

import { useEffect, useSyncExternalStore } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

function subscribePointer(onStoreChange: () => void) {
  const media = window.matchMedia("(pointer: fine)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

export function Cursor() {
  const reduce = useReducedMotion();
  const finePointer = useSyncExternalStore(
    subscribePointer,
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );
  const enabled = Boolean(finePointer && !reduce);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 180, damping: 22, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 180, damping: 22, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;
    const move = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden lg:block" aria-hidden="true">
      <motion.div
        className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ left: x, top: y }}
      />
      <motion.div
        className="absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/35"
        style={{ left: ringX, top: ringY }}
      />
    </div>
  );
}
