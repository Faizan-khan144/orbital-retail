import { AlertTriangle, ArrowDownToLine, Boxes, Radio, ShoppingBag, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../lib/store.jsx'
import Sparkline from '../../components/Sparkline.jsx'
import ProductGlyph from '../../components/ProductGlyph.jsx'
import { StatusPill, LiveDot } from '../../components/StatusPill.jsx'
import { compact, currency, num, pct, timeAgo } from '../../lib/format.js'

const KIND_ICON = {
  sale: ShoppingBag,
  shipment: ArrowDownToLine,
  transfer: Boxes,
  sync: Radio,
  alert: AlertTriangle,
}

const LEVEL_COLOR = {
  info: "var(--color-accent)",
  good: "var(--color-good)",
  warn: "var(--color-warn)",
  bad: "var(--color-bad)",
}

function Kpi({ label, value, sub, spark, sparkColor, live }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted">{label}</span>
        {live && <LiveDot label="" />}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-xs text-faint">{sub}</div>}
      {spark && <Sparkline data={spark} color={sparkColor} height={34} width={220} className="mt-3 w-full" />}
    </div>
  )
}

export default function Dashboard() {
  const { kpis, channels, events, products, bins, revenueSeries } = useStore()
  const lowStock = [...products].filter((p) => p.stock <= p.reorder).sort((a, b) => a.stock / a.reorder - b.stock / b.reorder).slice(0, 6)
  const unitsSeries = revenueSeries.map((v) => v / 90)

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operations dashboard</h1>
          <p className="mt-1 text-sm text-muted">Live state of the inventory automation pipeline across all channels.</p>
        </div>
        <LiveDot label="Pipeline streaming" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Revenue · 24h" value={currency(kpis.revenue24h, 0)} sub={`${compact(kpis.orders24h)} orders across ${channels.length} channels`} spark={revenueSeries} sparkColor="var(--color-accent)" live />
        <Kpi label="Inventory value" value={currency(kpis.inventoryValue, 0)} sub={`${num(kpis.units)} units on hand`} spark={unitsSeries} sparkColor="var(--color-accent2)" />
        <Kpi label="Sync health" value={pct(kpis.syncHealth)} sub={`${channels.filter((c) => c.status === 'synced').length}/${channels.length} channels synced · ${Math.round(kpis.avgLatency)}ms avg`} />
        <Kpi label="Fulfilment rate" value={`${kpis.fulfilment.toFixed(1)}%`} sub={`${kpis.openPOs} open purchase orders`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Revenue stream</h2>
              <p className="text-xs text-faint">Rolling window, updated every sync tick</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{currency(revenueSeries[revenueSeries.length - 1] * 24, 0)}</div>
              <div className="text-xs text-good">+{pct(((revenueSeries[revenueSeries.length - 1] / revenueSeries[0] - 1) * 100))} vs start</div>
            </div>
          </div>
          <div className="mt-4">
            <Sparkline data={revenueSeries} height={150} width={720} color="var(--color-accent)" className="w-full" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {channels.map((c) => (
              <div key={c.id} className="rounded-xl border border-line bg-surface2 p-3">
                <div className="truncate text-xs text-muted">{c.name}</div>
                <div className="mt-1 text-sm font-semibold">{currency(c.revenue24h / 1000, 0)}k</div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Live activity</h2>
            <LiveDot label="stream" />
          </div>
          <div className="mt-3 -mr-2 max-h-[430px] flex-1 space-y-1 overflow-y-auto pr-2">
            {events.map((e) => {
              const Icon = KIND_ICON[e.kind] ?? Radio
              const color = LEVEL_COLOR[e.level] ?? LEVEL_COLOR.info
              return (
                <div key={e.id} className="animate-in flex items-start gap-3 rounded-xl px-2 py-2 hover:bg-surface2">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg" style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, color }}>
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{e.message}</div>
                    <div className="text-[11px] text-faint">{timeAgo(e.ts)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Reorder watch</h2>
            <Link to="/ops/inventory" className="text-xs font-medium text-accent">View inventory</Link>
          </div>
          <div className="mt-4 space-y-3">
            {lowStock.map((p) => {
              const ratio = Math.min(1, p.stock / Math.max(1, p.reorder))
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <ProductGlyph product={p} size={16} boxed />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm">{p.name}</span>
                      <span className="shrink-0 font-mono text-xs text-warn">{p.stock} / {p.reorder}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-elevate">
                      <div className="h-full rounded-full" style={{ width: `${ratio * 100}%`, background: ratio < 0.5 ? "var(--color-bad)" : "var(--color-warn)" }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Warehouse utilisation</h2>
            <span className="text-xs text-faint">{pct(kpis.warehouseFill)} of {num(kpis.binCap)} u</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {bins.map((b) => {
              const fill = b.used / b.capacity
              const color = fill > 0.9 ? "var(--color-bad)" : fill > 0.75 ? "var(--color-warn)" : "var(--color-good)"
              return (
                <div key={b.id} className="rounded-xl border border-line bg-surface2 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold">{b.id}</span>
                    <span className="text-xs" style={{ color }}>{Math.round(fill * 100)}%</span>
                  </div>
                  <div className="mt-1 text-[11px] text-faint">{b.zone}</div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-elevate">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${fill * 100}%`, background: color }} />
                  </div>
                  <div className="mt-1.5 text-[11px] text-faint">{num(b.used)} / {num(b.capacity)}</div>
                </div>
              )
            })}
          </div>
          <div className="mt-5 border-t border-line pt-4">
            <div className="mb-2 text-xs font-medium text-muted">Channel status</div>
            <div className="flex flex-wrap gap-2">
              {channels.map((c) => (
                <div key={c.id} className="flex items-center gap-2 rounded-lg border border-line bg-surface2 px-2.5 py-1.5">
                  <span className="text-xs">{c.name}</span>
                  <StatusPill status={c.status} className="!px-2 !py-0.5 !text-[10px]" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
