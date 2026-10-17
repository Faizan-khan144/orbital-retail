import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Plus } from 'lucide-react'
import ProductTile from './ProductTile.jsx'
import ProductQuickView from './ProductQuickView.jsx'
import { currency } from '../lib/format.js'
import { useStore } from '../lib/store.jsx'

function StockTag({ product }) {
  const low = product.stock <= product.reorder
  const out = product.stock === 0
  const color = out ? "var(--color-bad)" : low ? "var(--color-warn)" : "var(--color-good)"
  const label = out ? "Sold out" : low ? `Low · ${product.stock}` : "In stock"
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ color, background: `color-mix(in srgb, ${color} 14%, transparent)` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}

export default function ProductCard({ product }) {
  const { addToCart } = useStore()
  const [quickView, setQuickView] = useState(false)
  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-line2 hover:bg-surface2 hover-lift">
        <button
          type="button"
          onClick={() => setQuickView(true)}
          className="relative block cursor-pointer p-3 text-left"
          aria-label={`Quick view ${product.name}`}
        >
          <ProductTile product={product} className="aspect-[5/4] w-full" showImage={false} />
          <span className="pointer-events-none absolute inset-3 flex items-center justify-center rounded-2xl bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/25 group-hover:opacity-100">
            <span className="inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-ink shadow-lg transition-transform duration-300 group-hover:translate-y-0">
              <Eye size={15} /> Quick view
            </span>
          </span>
        </button>
        <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link to={`/product/${product.id}`} className="block truncate text-[15px] font-semibold hover:text-accent">
                {product.name}
              </Link>
              <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-faint">{product.category}</div>
            </div>
            <StockTag product={product} />
          </div>
          <div className="mt-auto flex items-center justify-between pt-1">
            <span className="text-lg font-semibold">{currency(product.price)}</span>
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              aria-label={`Add ${product.name} to cart`}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line2 bg-elevate px-3 text-sm font-medium transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={15} /> Add
            </button>
          </div>
        </div>
      </div>

      {quickView && <ProductQuickView product={product} onClose={() => setQuickView(false)} />}
    </>
  )
}
