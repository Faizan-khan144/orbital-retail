import { useEffect, useState } from 'react'
import { RefreshCw, Zap } from 'lucide-react'
import { useStore } from '../../lib/store.jsx'
import { StatusPill, LiveDot } from '../../components/StatusPill.jsx'
import { compact, currency, timeAgo } from '../../lib/format.js'

export default function Channels() {
  const { channels, events, syncChannel, kpis } = useStore()
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const totalRev = channels.reduce((a, c) => a + c.revenue24h, 0)

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales channels</h1>
          <p className="mt-1 text-sm text-muted">Every channel reads and writes to the same inventory source of truth.</p>
        </div>
        <LiveDot label="Auto-sync enabled" />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Mini label="Channels" value={channels.length} />
        <Mini label="Sync health" value={`${kpis.syncHealth.toFixed(0)}%`} color={kpis.syncHealth > 80 ? "var(--color-good)" : "var(--color-warn)"} />
        <Mini label="Avg latency" value={`${Math.round(kpis.avgLatency)}ms`} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {channels.map((c) => {
          const perMin = (c.orders24h / (24 * 60)).toFixed(2)
          return (
            <div key={c.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{c.name}</span>
                    <span className="rounded-md border border-line bg-surface2 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-faint">{c.type}</span>
                  </div>
                  <div className="mt-1 text-xs text-faint">
                    Last sync {timeAgo(c.lastSync)} {c.status === 'syncing' && '· in progress'}
                  </div>
                </div>
                <StatusPill status={c.status} />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <Cell label="24h orders" value={compact(c.orders24h)} />
                <Cell label="24h revenue" value={currency(c.revenue24h, 0)} />
                <Cell label="Latency" value={`${c.latency}ms`} />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Revenue share</span>
                  <span>{((c.revenue24h / totalRev) * 100).toFixed(1)}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-elevate">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent2 to-accent transition-all duration-500" style={{ width: `${(c.revenue24h / totalRev) * 100}%` }} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <div className="flex items-center gap-2 text-xs text-faint">
                  <Zap size={13} className="text-accent" /> {perMin} orders/min · {c.uptime.toFixed(2)}% uptime
                </div>
                <button
                  onClick={() => syncChannel(c.id)}
                  disabled={c.status === 'syncing'}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line2 bg-elevate px-3 py-1.5 text-xs font-medium transition hover:border-accent hover:text-accent disabled:opacity-50"
                >
                  <RefreshCw size={13} className={c.status === 'syncing' ? 'animate-spin' : ''} /> Force sync
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-sm font-semibold">Channel event log</h2>
        <div className="mt-3 divide-y divide-line">
          {events.filter((e) => e.channelId).slice(0, 8).map((e) => {
            const c = channels.find((x) => x.id === e.channelId)
            return (
              <div key={e.id} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: e.level === 'warn' ? 'var(--color-warn)' : e.level === 'good' ? 'var(--color-good)' : 'var(--color-accent)' }} />
                <span className="w-28 shrink-0 truncate text-muted">{c?.name}</span>
                <span className="min-w-0 flex-1 truncate">{e.message}</span>
                <span className="shrink-0 font-mono text-xs text-faint">{timeAgo(e.ts)}</span>
                <span className="hidden shrink-0 font-mono text-xs text-faint sm:block">{new Date(now).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function Mini({ label, value, color }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-xl font-semibold" style={color ? { color } : undefined}>{value}</div>
    </div>
  )
}

function Cell({ label, value }) {
  return (
    <div className="rounded-xl border border-line bg-surface2 p-3">
      <div className="text-sm font-semibold">{value}</div>
      <div className="mt-0.5 text-[11px] text-faint">{label}</div>
    </div>
  )
}
