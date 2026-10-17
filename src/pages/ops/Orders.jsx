import { Link } from 'react-router-dom'
import { ArrowRight, CircleDollarSign, PackageCheck, ShoppingBag, Truck } from 'lucide-react'
import { useStore } from '../../lib/store.jsx'
import ProductGlyph from '../../components/ProductGlyph.jsx'
import { LiveDot } from '../../components/StatusPill.jsx'
import { currency, num, timeAgo } from '../../lib/format.js'

const STATUS = {
  allocated: { label: 'Allocated', color: 'var(--color-good)' },
  picking: { label: 'Picking', color: 'var(--color-accent)' },
  shipped: { label: 'Shipped', color: 'var(--color-accent2)' },
  delivered: { label: 'Delivered', color: 'var(--color-muted)' },
}

function OrderStatus({ status }) {
  const s = STATUS[status] ?? { label: status, color: 'var(--color-muted)' }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
      style={{ borderColor: `color-mix(in srgb, ${s.color} 40%, transparent)`, color: s.color, background: `color-mix(in srgb, ${s.color} 12%, transparent)` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  )
}

export default function Orders() {
  const { orders, channelById, kpis } = useStore()
  const units = orders.reduce((a, o) => a + o.lines.reduce((b, l) => b + l.qty, 0), 0)
  const revenue = orders.reduce((a, o) => a + o.total, 0)
  const aov = orders.length ? revenue / orders.length : 0

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-muted">Every order captured across channels, allocated to the warehouse in real time.</p>
        </div>
        <LiveDot label="Ingesting orders" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Mini icon={ShoppingBag} label="Orders in view" value={num(orders.length)} sub={`${num(units)} units`} />
        <Mini icon={CircleDollarSign} label="Order value" value={currency(revenue, 0)} sub="Across all listed orders" />
        <Mini icon={PackageCheck} label="Avg order value" value={currency(aov, 0)} sub="Per captured order" />
        <Mini icon={Truck} label="Fulfilment rate" value={`${kpis.fulfilment.toFixed(1)}%`} sub={`${kpis.openPOs} open purchase orders`} />
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-sm font-semibold">Recent orders</h2>
          <Link to="/ops/reports" className="inline-flex items-center gap-1 text-xs font-medium text-accent">
            View reports <ArrowRight size={13} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-faint">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Channel</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 text-right font-medium">Units</th>
                <th className="px-5 py-3 text-right font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Placed</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const ch = channelById(o.channelId)
                const oUnits = o.lines.reduce((a, l) => a + l.qty, 0)
                return (
                  <tr key={o.id} className="border-b border-line last:border-0 transition hover:bg-surface2">
                    <td className="px-5 py-3 font-mono text-xs font-semibold">{o.id}</td>
                    <td className="px-5 py-3 text-muted">{ch?.name ?? '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {o.lines.slice(0, 3).map((l) => (
                            <ProductGlyph key={l.id} product={l} size={12} boxed className="ring-2 ring-surface" />
                          ))}
                        </div>
                        <span className="truncate text-xs text-muted" title={o.lines.map((l) => l.name).join(', ')}>
                          {o.lines[0]?.name}
                          {o.lines.length > 1 ? ` +${o.lines.length - 1} more` : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-xs">{oUnits}</td>
                    <td className="px-5 py-3 text-right font-semibold">{currency(o.total, 0)}</td>
                    <td className="px-5 py-3 text-xs text-faint">{timeAgo(o.ts)}</td>
                    <td className="px-5 py-3"><OrderStatus status={o.status} /></td>
                  </tr>
                )
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted">No orders yet. Place one from the storefront to see it flow in.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Mini({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted">{label}</span>
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-elevate text-accent">
          <Icon size={15} />
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-xs text-faint">{sub}</div>}
    </div>
  )
}
