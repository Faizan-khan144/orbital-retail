const MAP = {
  synced: { label: "Synced", color: "var(--color-good)" },
  syncing: { label: "Syncing", color: "var(--color-accent)" },
  degraded: { label: "Degraded", color: "var(--color-warn)" },
  error: { label: "Error", color: "var(--color-bad)" },
  allocated: { label: "Allocated", color: "var(--color-good)" },
}

export function StatusPill({ status, className = "" }) {
  const s = MAP[status] || { label: status, color: "var(--color-muted)" }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}
      style={{ borderColor: `color-mix(in srgb, ${s.color} 40%, transparent)`, color: s.color, background: `color-mix(in srgb, ${s.color} 12%, transparent)` }}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${status === "syncing" ? "pulse-dot" : ""}`} style={{ background: s.color }} />
      {s.label}
    </span>
  )
}

export function LiveDot({ color = "var(--color-good)", label, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-medium text-muted ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full opacity-60 pulse-dot" style={{ background: color }} />
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: color }} />
      </span>
      {label}
    </span>
  )
}
