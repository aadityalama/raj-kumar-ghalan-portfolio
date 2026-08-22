const nodes = [
  { label: "Career", ring: 1, angle: 18 },
  { label: "Technology", ring: 2, angle: 128 },
  { label: "Finance", ring: 3, angle: 232 },
  { label: "Creativity", ring: 2, angle: 312 },
] as const;

export function HeroOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden="true">
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,var(--accent-glow),transparent_62%)] opacity-80" />
      <div className="absolute inset-[38%] rounded-full border border-accent/25 bg-bg-card/40 backdrop-blur-sm" />
      <div className="absolute inset-[42%] grid place-items-center rounded-full border border-border">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">Build</span>
      </div>

      {[78, 58, 38].map((inset, index) => (
        <div
          key={inset}
          className={[
            "absolute rounded-full border border-border",
            index === 0 ? "orbit-spin-slow" : index === 1 ? "orbit-spin" : "orbit-spin-fast",
          ].join(" ")}
          style={{ inset: `${inset * 0.12}%` }}
        />
      ))}

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" className="text-[var(--border)]" strokeWidth="0.2" />
        <circle cx="50" cy="50" r="27" fill="none" stroke="currentColor" className="text-[var(--border)]" strokeWidth="0.2" />
        <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" className="text-[var(--border)]" strokeWidth="0.2" />
        {nodes.map((node) => {
          const radius = node.ring === 1 ? 16 : node.ring === 2 ? 27 : 38;
          const rad = ((node.angle - 90) * Math.PI) / 180;
          const x = 50 + radius * Math.cos(rad);
          const y = 50 + radius * Math.sin(rad);
          return (
            <g key={node.label}>
              <circle cx={x} cy={y} r="1.15" fill="var(--accent)" />
            </g>
          );
        })}
      </svg>

      {nodes.map((node) => {
        const radius = node.ring === 1 ? 16 : node.ring === 2 ? 27 : 38;
        const rad = ((node.angle - 90) * Math.PI) / 180;
        const left = 50 + radius * Math.cos(rad);
        const top = 50 + radius * Math.sin(rad);
        return (
          <span
            key={node.label}
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-border bg-bg-card/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted backdrop-blur-md"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            {node.label}
          </span>
        );
      })}
    </div>
  );
}
