import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Minus, Plus, Star, X } from 'lucide-react'
import ProductTile from './ProductTile.jsx'
import { useStore } from '../lib/store.jsx'
import { currency } from '../lib/format.js'

export default function ProductQuickView({ product, onClose }) {
  const { addToCart, supplierById } = useStore()
  const [qty, setQty] = useState(1)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => { setQty(1) }, [product?.id])

  if (!product) return null
  const out = product.stock === 0
  const low = product.stock <= product.reorder
  const supplier = supplierById?.(product.supplierId)

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm anim-fade sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} quick view`}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-t-3xl border border-line bg-surface shadow-2xl anim-up sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-line bg-surface/90 text-muted backdrop-blur transition hover:text-ink hover-zoom"
        >
          <X size={17} />
        </button>

        <div className="grid gap-0 sm:grid-cols-2">
          <div className="p-5 sm:p-6">
            <ProductTile product={product} className="aspect-square w-full" rounded="rounded-2xl" />
          </div>

          <div className="flex flex-col p-6 sm:p-7">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-line bg-surface2 px-2.5 py-1 text-xs text-muted">{product.category}</span>
              {product.tag && <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">{product.tag}</span>}
            </div>

            <h2 className="mt-3 text-2xl font-bold tracking-tight">{product.name}</h2>

            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-warn">
                <Star size={14} fill="currentColor" /> {product.rating}
              </span>
              <span className="font-mono text-faint">{product.sku}</span>
            </div>

            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">{product.desc}</p>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-semibold">{currency(product.price)}</span>
              {low && !out && <span className="text-sm text-warn">Only {product.stock} left</span>}
              {out && <span className="text-sm text-bad">Sold out</span>}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-xl border border-line bg-surface">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center text-muted hover:text-ink" aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-mono">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))} className="grid h-11 w-11 place-items-center text-muted hover:text-ink" aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, qty)}
                disabled={out}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-accent2 to-accent px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add to cart
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent sweep-underline"
            >
              View full details <ArrowUpRight size={15} />
            </Link>

            {supplier && (
              <div className="mt-5 border-t border-line pt-4 text-xs text-faint">
                Sourced from <span className="text-muted">{supplier.name}</span> · {supplier.leadTime}d lead
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
