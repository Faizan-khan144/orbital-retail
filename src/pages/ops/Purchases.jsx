import { Link } from 'react-router-dom'
import { ArrowRight, Clock, FileText, PackagePlus, Wallet } from 'lucide-react'
import { useStore } from '../../lib/store.jsx'
import ProductGlyph from '../../components/ProductGlyph.jsx'
import { currency, num } from '../../lib/format.js'

const STATUS = {
  'In transit': { color: 'var(--color-accent2)' },
  Approved: { color: 'var(--color-accent)' },
  Draft: { color: 'var(--color-warn)' },
}

function PoStatus({ status }) {
  const color = STATUS[status]?.color ?? 'var(--color-muted)'
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
      style={{ borderColor: `color-mix(in srgb, ${color} 40%, transparent)`, color, background: `color-mix(in srgb, ${color} 12%, transparent)` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {status}
    </span>
  )
}

const eta = (days) =>
  new Date(Date.now() + days * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default function Purchases() {
  const { products, supplierById, raisePO } = useStore()

  const lowStock = [...products]
    .filter((p) => p.stock <= p.reorder)
    .sort((a, b) => a.stock / a.reorder - b.stock / b.reorder)

  const pos = lowStock.map((p, i) => {
    const supplier = supplierById(p.supplierId)
    const qty = p.reorder * 2
    const status = supplier?.openPOs > 0 && i % 2 === 0 ? 'In transit' : i % 3 === 0 ? 'Draft' : 'Approved'
    return { id: `PO-${7300 + i}`, product: p, supplier, qty, value: qty * p.cost, status, etaDays: supplier?.leadTime ?? 7 }
  })

  const inboundUnits = pos.reduce((a, po) => a + po.qty, 0)
  const committed = pos.reduce((a, po) => a + po.value, 0)
  const avgLead = pos.length ? pos.reduce((a, po) => a + po.etaDays, 0) / pos.length : 0

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Purchases</h1>
          <p className="mt-1 text-sm text-muted">Replenishment orders suggested automatically when items cross their reorder point.</p>
        </div>
        <Link to="/ops/suppliers" className="inline-flex items-center gap-1 text-sm font-medium text-accent">
          Supplier performance <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Mini icon={FileText} label="Open purchase orders" value={num(pos.length)} sub="Auto-generated from reorder points" />
        <Mini icon={PackagePlus} label="Units inbound" value={num(inboundUnits)} sub="Across all pending POs" />
        <Mini icon={Wallet} label="Committed value" value={currency(committed, 0)} sub="At supplier cost" />
        <Mini icon={Clock} label="Avg lead time" value={`${avgLead.toFixed(0)}d`} sub="Weighted by open POs" />
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="border-b border-line px-5 py-4">
          <h2 className="text-sm font-semibold">Replenishment queue</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-faint">
                <th className="px-5 py-3 font-medium">PO</th>
                <th className="px-5 py-3 font-medium">Supplier</th>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 text-right font-medium">Qty</th>
                <th className="px-5 py-3 text-right font-medium">Value</th>
                <th className="px-5 py-3 font-medium">ETA</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {pos.map((po) => (
                <tr key={po.id} className="border-b border-line last:border-0 transition hover:bg-surface2">
                  <td className="px-5 py-3 font-mono text-xs font-semibold">{po.id}</td>
                  <td className="px-5 py-3 text-muted">{po.supplier?.name ?? '—'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <ProductGlyph product={po.product} size={13} boxed />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{po.product.name}</div>
                        <div className="font-mono text-[11px] text-faint">{po.product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-xs">{num(po.qty)}</td>
                  <td className="px-5 py-3 text-right font-semibold">{currency(po.value, 0)}</td>
                  <td className="px-5 py-3 text-xs text-faint">{eta(po.etaDays)}</td>
                  <td className="px-5 py-3"><PoStatus status={po.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => raisePO(po.product.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line2 bg-elevate px-3 py-1.5 text-xs font-semibold transition hover:border-accent hover:text-accent"
                    >
                      <PackagePlus size={13} /> Raise
                    </button>
                  </td>
                </tr>
              ))}
              {pos.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-muted">All products are above their reorder points. Nothing to replenish.</td>
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
