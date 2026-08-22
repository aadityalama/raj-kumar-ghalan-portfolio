import { cn } from "@/lib/utils";

type Accent = "emerald" | "rose" | "amber";

const accents: Record<Accent, string> = {
  emerald: "from-emerald-500/25 via-transparent to-transparent",
  rose: "from-rose-400/25 via-transparent to-transparent",
  amber: "from-amber-400/25 via-transparent to-transparent",
};

export function ProjectPreview({
  name,
  accent,
  modules,
}: {
  name: string;
  accent: Accent;
  modules: readonly string[];
}) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-[1.15rem] border border-border bg-bg-soft",
        "transition-transform duration-700 group-hover:scale-[1.02]",
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", accents[accent])} />
      <div className="absolute inset-0 grid-field opacity-60" />
      <div className="absolute inset-4 rounded-xl border border-border bg-bg-card/70 p-4 backdrop-blur-md sm:inset-5 sm:p-5">
        <div className="mb-4 flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-accent/80" />
          <span className="size-1.5 rounded-full bg-border-strong" />
          <span className="size-1.5 rounded-full bg-border-strong" />
          <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
            {name}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {modules.slice(0, 6).map((module) => (
            <div
              key={module}
              className="rounded-lg border border-border bg-bg/50 px-2.5 py-3"
            >
              <p className="text-[11px] leading-snug text-muted">{module}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
