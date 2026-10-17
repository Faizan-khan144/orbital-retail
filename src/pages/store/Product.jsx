import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Minus, Plus, RefreshCw, ShieldCheck, Star, Truck, Warehouse } from 'lucide-react'
import { useStore } from '../../lib/store.jsx'
import ProductTile from '../../components/ProductTile.jsx'
import ProductCard from '../../components/ProductCard.jsx'
import { currency } from '../../lib/format.js'

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, supplierById, bins, addToCart } = useStore()
  const product = products.find((p) => p.id === id)
  const [qty, setQty] = useState(1)

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-muted">Product not found.</p>
        <Link to="/shop" className="mt-3 inline-block text-accent">Back to shop</Link>
      </div>
    )
  }

  const supplier = supplierById(product.supplierId)
  const bin = bins.find((b) => b.id === product.bin)
  const low = product.stock <= product.reorder
  const out = product.stock === 0
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="mx-auto max-w-[88rem] px-4 py-8 sm:px-6">
      <nav className="flex items-center gap-1.5 text-sm text-faint">
        <Link to="/" className="hover:text-ink">Home</Link>
        <ChevronRight size={14} />
        <Link to="/shop" className="hover:text-ink">Shop</Link>
        <ChevronRight size={14} />
        <span className="text-muted">{product.category}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <ProductTile product={product} className="aspect-square w-full" imgClass="object-contain p-8" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <ProductTile key={i} image={product.image} category={product.category} className="aspect-square w-full" rounded="rounded-xl" imgClass="object-contain p-2" />
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-muted">{product.category}</span>
            {product.tag && <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">{product.tag}</span>}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-warn">
              <Star size={15} fill="currentColor" /> {product.rating}
            </span>
            <span className="font-mono text-faint">{product.sku}</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{currency(product.price)}</span>
            {low && !out && <span className="text-sm text-warn">Low stock — {product.stock} left</span>}
            {out && <span className="text-sm text-bad">Sold out</span>}
          </div>

          <p className="mt-5 max-w-prose text-sm leading-relaxed text-muted">{product.desc}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-xl border border-line bg-surface">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center text-muted hover:text-ink" aria-label="Decrease">
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-mono">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))} className="grid h-11 w-11 place-items-center text-muted hover:text-ink" aria-label="Increase">
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={() => addToCart(product, qty)}
              disabled={out}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent2 to-accent px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to cart
            </button>
            <button
              onClick={() => { addToCart(product, qty); navigate('/checkout') }}
              disabled={out}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-line2 bg-surface px-6 text-sm font-semibold transition hover:border-accent disabled:opacity-40"
            >
              Buy now
            </button>
          </div>

          <div className="mt-8 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
            <Info icon={Truck} label="Sourcing" value={`${supplier?.name ?? "—"} · ${supplier?.leadTime ?? "—"}d lead`} />
            <Info icon={Warehouse} label="Warehouse bin" value={bin ? `${bin.id} · ${bin.zone}` : product.bin} />
            <Info icon={ShieldCheck} label="Fulfilment" value="Same-day dispatch" />
            <Info icon={Star} label="Sell-through" value={`${product.velocity}/day`} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold tracking-tight">More in {product.category}</h2>
          <div className="mt-5 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Specifications</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface">
            {[
              ['SKU', product.sku],
              ['Category', product.category],
              ['Warehouse bin', bin ? `${bin.id} · ${bin.zone}` : product.bin],
              ['Supplier', supplier?.name ?? '—'],
              ['Lead time', supplier ? `${supplier.leadTime} days` : '—'],
              ['Sell-through', `${product.velocity}/day`],
              ['Rating', `${product.rating} / 5`],
            ].map(([k, v], i, arr) => (
              <div
                key={k}
                className={`flex items-center justify-between gap-4 px-5 py-3.5 text-sm ${i < arr.length - 1 ? 'border-b border-line' : ''}`}
              >
                <span className="text-muted">{k}</span>
                <span className="text-right font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight">Shipping & returns</h2>
          <div className="mt-5 space-y-4">
            <Info icon={Truck} label="Delivery" value="Same-day dispatch · tracked" />
            <Info icon={ShieldCheck} label="Warranty" value="2-year coverage included" />
            <Info icon={RefreshCw} label="Returns" value="30 days, prepaid label" />
            <Info icon={Warehouse} label="Fulfilment" value="Picked from live warehouse bins" />
          </div>
          <div className="mt-6 rounded-2xl border border-line bg-surface2 p-5 text-sm text-muted">
            Need this in bulk? We offer tiered B2B pricing and net terms on every line. Reach out and a sourcing specialist will match you with the right supplier.
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-bold tracking-tight">Customer reviews</h2>
          <span className="flex items-center gap-1 text-sm text-warn">
            <Star size={15} fill="currentColor" /> {product.rating} · {42} reviews
          </span>
        </div>
        <div className="mt-5 grid gap-5 stagger md:grid-cols-3">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-2xl border border-line bg-surface p-6 transition hover:border-line2 hover-lift">
              <div className="flex items-center gap-1 text-warn">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill={i < r.stars ? 'currentColor' : 'none'} />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">“{r.body}”</p>
              <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent2 to-accent text-xs font-semibold text-white">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-xs text-faint">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const REVIEWS = [
  { name: 'Daniel O.', role: 'Verified buyer', stars: 5, body: 'Arrived next day, packaging was flawless, and it matched the listing exactly. Would buy again without thinking.' },
  { name: 'Sofia R.', role: 'Verified buyer', stars: 4, body: 'Great build quality for the price. Took a day to get used to, but it has become part of my daily setup.' },
  { name: 'Ken M.', role: 'Verified buyer', stars: 5, body: 'The fact that stock is actually accurate is what sold me. Ordered three more for the team the same week.' },
]

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
      <Icon size={17} className="text-accent" />
      <div>
        <div className="text-[11px] uppercase tracking-wide text-faint">{label}</div>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  )
}
