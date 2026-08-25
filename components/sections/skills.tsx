"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export function Skills({
  groups,
  eyebrow = "06 / Capabilities",
  title = "What I Work With",
  description = "A working set of product, technology, markets, AI, and content skills — used to ship real things, not a logo wall.",
}: {
  groups: Record<string, string[]>;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const categories = Object.keys(groups);
  const [active, setActive] = useState(categories[0] || "");
  const reduce = useReducedMotion();

  if (!categories.length) return null;

  return (
    <Section id="skills" eyebrow={eyebrow} title={title} description={description}>
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0" role="tablist" aria-label="Skill categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active === category}
              className={cn(
                "min-h-11 shrink-0 rounded-full border px-4 text-left text-sm transition-colors",
                active === category
                  ? "border-accent/40 bg-accent-soft text-text"
                  : "border-border text-muted hover:text-text",
              )}
              onClick={() => setActive(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="min-h-[220px] rounded-[1.4rem] border border-border bg-bg-card p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.ul
              key={active}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="grid gap-3 sm:grid-cols-2"
            >
              {(groups[active] || []).map((item, index) => (
                <li
                  key={item}
                  className="flex items-center gap-3 border-b border-border py-3 last:border-b-0 sm:last:border-b"
                >
                  <span className="font-mono text-[11px] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base tracking-[-0.02em]">{item}</span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
