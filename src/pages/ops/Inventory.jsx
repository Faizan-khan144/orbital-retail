import { useMemo, useState } from 'react'
import { Search, PackagePlus } from 'lucide-react'
import { useStore } from '../../lib/store.jsx'
import { CATEGORIES } from '../../data/seed'
import ProductGlyph from '../../components/ProductGlyph.jsx'
import { currency, num } from '../../lib/format.js'

function statusOf(p) {
  if (p.stock === 0) return { label: "Out of stock", color: "var(--color-bad)" }
  if (p.stock <= p.reorder) return { label: "Reorder", color: "var(--color-warn)" }
  if (p.stock <= p.reorder * 1.5) return { label: "Watch", color: "var(--color-accent)" }
  return { label: "Healthy", color: "var(--color-good)" }
}

export default function Inventory() {
  const { products, supplierById, bins, raisePO } = useStore()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [only, setOnly] = useState('all')
  const [sort, setSort] = useState('risk')

  const list = useMemo(() => {
    let out = products.filter((p) => {
      const mq = !q || (p.name + p.sku + p.category).toLowerCase().includes(q.toLowerCase())
      const mc = cat === 'All' || p.category === cat
      const s = statusOf(p).label
      const mo = only === 'all' || (only === 'low' && (s === 'Reorder' || s === 'Out of stock')) || (only === 'healthy' && s === 'Healthy')
      return mq && mc && mo
    })
    out = [...out].sort((a, b) => {
      if (sort === 'stock') return a.stock - b.stock
      if (sort === 'value') return b.stock * b.cost - a.stock * a.cost
      if (sort === 'name') return a.name.localeCompare(b.name)
      return a.stock / a.reorder - b.stock / b.reorder
    })
    return out
  }, [products, q, cat, only, sort])

  const low = products.filter((p) => p.stock <= p.reorder).length

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
      <p className="mt-1 text-sm text-muted">Single source of truth for warehouse stock across every channel.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <Mini label="Active SKUs" value={num(products.length)} />
        <Mini label="Below reorder" value={num(low)} color="var(--color-warn)" />
        <Mini label="Total units" value={num(products.reduce((a, p) => a + p.stock, 0))} />
        <Mini label="Stock value" value={currency(products.reduce((a, p) => a + p.stock * p.cost, 0), 0)} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2">
          <Search size={15} className="text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search SKU or product…" className="w-full bg-transparent text-sm outline-none placeholder:text-faint" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent">
          {['All', ...CATEGORIES].map((c) => <option key={c} value={c} className="bg-surface">{c}</option>)}
        </select>
        <select value={only} onChange={(e) => setOnly(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent">
          <option value="all" className="bg-surface">All stock</option>
          <option value="low" className="bg-surface">Needs reorder</option>
          <option value="healthy" className="bg-surface">Healthy only</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent">
          <option value="risk" className="bg-surface">Sort: reorder risk</option>
          <option value="stock" className="bg-surface">Sort: lowest stock</option>
          <option value="value" className="bg-surface">Sort: stock value</option>
          <option value="name" className="bg-surface">Sort: name</option>
        </select>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-faint">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Bin</th>
                <th className="px-4 py-3 font-medium">Supplier</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Reorder</th>
                <th className="px-4 py-3 font-medium">Daily</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => {
                const st = statusOf(p)
                const sup = supplierById(p.supplierId)
                const bin = bins.find((b) => b.id === p.bin)
                const ratio = Math.min(1, p.stock / Math.max(1, p.reorder * 2))
                return (
                  <tr key={p.id} className="border-b border-line/70 last:border-0 hover:bg-surface2">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProductGlyph product={p} size={16} boxed />
                        <div className="min-w-0">
                          <div className="truncate font-medium">{p.name}</div>
                          <div className="font-mono text-[11px] text-faint">{p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-mono">{p.bin}</div>
                      <div className="text-[11px] text-faint">{bin?.zone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="truncate">{sup?.name}</div>
                      <div className="text-[11px] text-faint">{sup?.leadTime}d lead</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-12 font-mono">{num(p.stock)}</span>
                        <span className="h-1.5 w-20 overflow-hidden rounded-full bg-elevate">
                          <span className="block h-full rounded-full transition-all duration-500" style={{ width: `${ratio * 100}%`, background: st.color }} />
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-muted">{p.reorder}</td>
                    <td className="px-4 py-3 font-mono text-muted">{p.velocity}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ color: st.color, background: `color-mix(in srgb, ${st.color} 14%, transparent)` }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.color }} />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => raisePO(p.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line2 bg-elevate px-2.5 py-1.5 text-xs font-medium transition hover:border-accent hover:text-accent"
                      >
                        <PackagePlus size={13} /> Raise PO
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {list.length === 0 && <div className="py-16 text-center text-sm text-muted">No SKUs match these filters.</div>}
      </div>
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
