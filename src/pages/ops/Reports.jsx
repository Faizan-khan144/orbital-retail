import { useMemo } from 'react'
import { Activity, BarChart3, Boxes, Percent, TrendingUp, Wallet } from 'lucide-react'
import { useStore } from '../../lib/store.jsx'
import Sparkline from '../../components/Sparkline.jsx'
import { StatusPill } from '../../components/StatusPill.jsx'
import { categoryIcon } from '../../lib/categoryIcons.jsx'
import { compact, currency, num, pct } from '../../lib/format.js'

export default function Reports() {
  const { products, channels, kpis, revenueSeries } = useStore()

  const byChannel = useMemo(() => {
    const max = Math.max(1, ...channels.map((c) => c.revenue24h))
    return channels
      .map((c) => ({ ...c, share: (c.revenue24h / max) * 100 }))
      .sort((a, b) => b.revenue24h - a.revenue24h)
  }, [channels])

  const topSellers = useMemo(() => {
    const sorted = [...products].sort((a, b) => b.velocity - a.velocity).slice(0, 7)
    const max = Math.max(1, ...sorted.map((p) => p.velocity))
    return sorted.map((p) => ({ ...p, bar: (p.velocity / max) * 100 }))
  }, [products])

  const byCategory = useMemo(() => {
    const map = new Map()
    for (const p of products) {
      const cur = map.get(p.category) ?? { units: 0, cost: 0, retail: 0, count: 0 }
      cur.units += p.stock
      cur.cost += p.stock * p.cost
      cur.retail += p.stock * p.price
      cur.count += 1
      map.set(p.category, cur)
    }
    const rows = [...map.entries()].map(([category, v]) => ({ category, ...v }))
    const max = Math.max(1, ...rows.map((r) => r.cost))
    return rows.sort((a, b) => b.cost - a.cost).map((r) => ({ ...r, bar: (r.cost / max) * 100 }))
  }, [products])

  const margin = kpis.retailValue ? ((kpis.retailValue - kpis.inventoryValue) / kpis.retailValue) * 100 : 0
  const growth = revenueSeries[0] ? ((revenueSeries[revenueSeries.length - 1] / revenueSeries[0] - 1) * 100) : 0

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="mt-1 text-sm text-muted">Revenue, sell-through and inventory health across the whole operation.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={TrendingUp} label="Revenue · 24h" value={currency(kpis.revenue24h, 0)} sub={`${compact(kpis.orders24h)} orders`} />
        <Kpi icon={Wallet} label="Inventory value" value={currency(kpis.inventoryValue, 0)} sub={`${num(kpis.units)} units on hand`} />
        <Kpi icon={Percent} label="Gross margin" value={pct(margin)} sub={`${currency(kpis.retailValue - kpis.inventoryValue, 0)} potential`} />
        <Kpi icon={Activity} label="Stream growth" value={`${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`} sub="vs window start" tone={growth >= 0 ? 'good' : 'bad'} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Revenue stream</h2>
              <p className="text-xs text-faint">Rolling window, updated every sync tick</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <BarChart3 size={15} /> {currency(revenueSeries[revenueSeries.length - 1] * 24, 0)}
            </span>
          </div>
          <div className="mt-4">
            <Sparkline data={revenueSeries} height={170} width={760} color="var(--color-accent)" className="w-full" />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold">Revenue by channel</h2>
          <p className="text-xs text-faint">Last 24 hours</p>
          <div className="mt-4 space-y-4">
            {byChannel.map((c) => (
              <div key={c.id}>
                <div className="flex items-center justify-between text-sm">
                  <span>{c.name}</span>
                  <span className="font-mono text-xs text-muted">{currency(c.revenue24h / 1000, 0)}k</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-elevate">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent2 to-accent transition-all duration-500" style={{ width: `${c.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold">Top sellers by velocity</h2>
          <p className="text-xs text-faint">Units sold per day, ranked</p>
          <div className="mt-4 space-y-3">
            {topSellers.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm">{p.name}</span>
                    <span className="shrink-0 font-mono text-xs text-muted">{p.velocity.toFixed(1)}/d</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-elevate">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${p.bar}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold">Inventory by category</h2>
          <p className="text-xs text-faint">Value at cost and units on hand</p>
          <div className="mt-4 space-y-4">
            {byCategory.map((c) => {
              const Icon = categoryIcon(c.category)
              return (
                <div key={c.category}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Icon size={15} className="text-accent" /> {c.category}
                    </span>
                    <span className="font-mono text-xs text-muted">{currency(c.cost, 0)} · {num(c.units)}u</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-elevate">
                    <div className="h-full rounded-full bg-gradient-to-r from-good to-accent transition-all duration-500" style={{ width: `${c.bar}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-sm font-semibold">Channel performance</h2>
          <span className="inline-flex items-center gap-1.5 text-xs text-faint"><Boxes size={13} /> {num(kpis.units)} units synced</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-faint">
                <th className="px-5 py-3 font-medium">Channel</th>
                <th className="px-5 py-3 text-right font-medium">Orders</th>
                <th className="px-5 py-3 text-right font-medium">Revenue</th>
                <th className="px-5 py-3 text-right font-medium">Latency</th>
                <th className="px-5 py-3 text-right font-medium">Uptime</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0 transition hover:bg-surface2">
                  <td className="px-5 py-3 font-medium">{c.name}</td>
                  <td className="px-5 py-3 text-right font-mono text-xs">{num(c.orders24h)}</td>
                  <td className="px-5 py-3 text-right font-semibold">{currency(c.revenue24h, 0)}</td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-muted">{Math.round(c.latency)}ms</td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-muted">{c.uptime.toFixed(2)}%</td>
                  <td className="px-5 py-3"><StatusPill status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Kpi({ icon: Icon, label, value, sub, tone }) {
  const color = tone === 'good' ? 'var(--color-good)' : tone === 'bad' ? 'var(--color-bad)' : undefined
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted">{label}</span>
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-elevate text-accent">
          <Icon size={15} />
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight" style={color ? { color } : undefined}>{value}</div>
      {sub && <div className="mt-1 text-xs text-faint">{sub}</div>}
    </div>
  )
}
