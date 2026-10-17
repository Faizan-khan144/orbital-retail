import { Globe, PackageCheck, Truck } from 'lucide-react'
import { useStore } from '../../lib/store.jsx'
import ProductGlyph from '../../components/ProductGlyph.jsx'
import { num, pct } from '../../lib/format.js'

export default function Suppliers() {
  const { suppliers, products } = useStore()

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold tracking-tight">Suppliers</h1>
      <p className="mt-1 text-sm text-muted">Vendor performance and the SKUs each one feeds into the pipeline.</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {suppliers.map((s) => {
          const skus = products.filter((p) => p.supplierId === s.id)
          const units = skus.reduce((a, p) => a + p.stock, 0)
          const value = skus.reduce((a, p) => a + p.stock * p.cost, 0)
          const lowCount = skus.filter((p) => p.stock <= p.reorder).length
          return (
            <div key={s.id} className="flex flex-col rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-elevate text-accent">
                    <Truck size={18} />
                  </span>
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="flex items-center gap-1 text-xs text-faint">
                      <Globe size={11} /> {s.region}
                    </div>
                  </div>
                </div>
                {s.openPOs > 0 ? (
                  <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">{s.openPOs} open PO{s.openPOs > 1 ? 's' : ''}</span>
                ) : (
                  <span className="rounded-full bg-good/15 px-2.5 py-1 text-xs font-medium text-good">No open POs</span>
                )}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <Metric label="Lead time" value={`${s.leadTime}d`} />
                <Metric label="On-time" value={pct(s.onTime)} />
                <Metric label="Reliability" value={pct(s.reliability)} />
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>On-time performance</span>
                  <span>{pct(s.onTime)}</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-elevate">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent2 to-accent transition-all duration-500" style={{ width: `${s.onTime}%` }} />
                </div>
              </div>

              <div className="mt-5 border-t border-line pt-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted"><PackageCheck size={13} /> Supplies {skus.length} SKU{skus.length === 1 ? '' : 's'}</span>
                  {lowCount > 0 && <span className="text-warn">{lowCount} need reorder</span>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skus.slice(0, 6).map((p) => (
                    <span key={p.id} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface2 px-2 py-1 text-[11px]">
                      <ProductGlyph product={p} size={12} /> {p.name}
                    </span>
                  ))}
                  {skus.length > 6 && <span className="rounded-lg border border-line bg-surface2 px-2 py-1 text-[11px] text-faint">+{skus.length - 6} more</span>}
                </div>
                <div className="mt-3 text-xs text-faint">{num(units)} units in stock</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-line bg-surface2 py-3">
      <div className="text-sm font-semibold">{value}</div>
      <div className="mt-0.5 text-[11px] text-faint">{label}</div>
    </div>
  )
}
