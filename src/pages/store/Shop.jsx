import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { SlidersHorizontal, Truck, RefreshCw, ShieldCheck, Headphones, ArrowRight, Sparkles } from 'lucide-react'
import { useStore } from '../../lib/store.jsx'
import { CATEGORIES } from '../../data/seed'
import ProductCard from '../../components/ProductCard.jsx'

const SORTS = [
  { id: 'velocity', label: 'Trending' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'stock-desc', label: 'Most in stock' },
  { id: 'rating', label: 'Top rated' },
]

export default function Shop() {
  const { products } = useStore()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState('velocity')
  const [inStockOnly, setInStockOnly] = useState(false)

  const list = useMemo(() => {
    let out = products.filter((p) => {
      const matchQ = !q || (p.name + p.category + p.tag + p.desc).toLowerCase().includes(q.toLowerCase())
      const matchC = cat === 'All' || p.category === cat
      const matchStock = !inStockOnly || p.stock > 0
      return matchQ && matchC && matchStock
    })
    out = [...out].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'stock-desc') return b.stock - a.stock
      if (sort === 'rating') return b.rating - a.rating
      return b.velocity - a.velocity
    })
    return out
  }, [products, q, cat, sort, inStockOnly])

  return (
    <div className="mx-auto max-w-[88rem] px-4 py-10 sm:px-6">
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-accent2/10 via-surface to-accent/10 p-8 sm:p-12">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl float-slow" />
        <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-accent2/20 blur-3xl float-med" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
            <Sparkles size={13} className="text-accent" /> {products.length} lines · live warehouse stock
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">The whole catalog, in one place</h1>
          <p className="mt-4 text-base text-muted sm:text-lg">
            Filter by category, sort by what's moving, and shop confidently — every listing reads directly from live warehouse bins.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-2"><Truck size={16} className="text-accent" /> Free shipping over $99</span>
            <span className="inline-flex items-center gap-2"><RefreshCw size={16} className="text-accent" /> 30-day returns</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-accent" /> 2-year warranty</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Browse products</h2>
          <p className="mt-1 text-sm text-muted">
            {list.length} product{list.length === 1 ? '' : 's'}
            {q ? <> matching “<span className="text-ink">{q}</span>”</> : null}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="h-4 w-4 accent-[color:var(--color-accent)]" />
            In stock only
          </label>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none rounded-xl border border-line bg-surface py-2 pl-3 pr-9 text-sm outline-none focus:border-accent"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id} className="bg-surface">
                  {s.label}
                </option>
              ))}
            </select>
            <SlidersHorizontal size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-faint" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {['All', ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              cat === c ? 'border-transparent bg-gradient-to-r from-accent2 to-accent text-white' : 'border-line bg-surface text-muted hover:text-ink'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="mt-20 text-center text-muted">
          No products found. <button onClick={() => { setParams({}); setCat('All'); setInStockOnly(false) }} className="text-accent">Clear filters</button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 stagger lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <section className="mt-20 grid gap-5 stagger border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-4">
        <Perk icon={Truck} title="Fast, tracked delivery" body="Same-day dispatch on orders before 3pm, tracked door to door." />
        <Perk icon={RefreshCw} title="30-day returns" body="Changed your mind? Prepaid label and instant refund on scan." />
        <Perk icon={ShieldCheck} title="2-year warranty" body="Every product line is covered, no registration gymnastics." />
        <Perk icon={Headphones} title="Human support" body="Real operators on chat, email and phone, around the clock." />
      </section>

      <section className="mt-16 flex flex-col items-center justify-between gap-5 rounded-3xl border border-line bg-surface p-8 text-center sm:flex-row sm:text-left">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Can't find what you need?</h3>
          <p className="mt-1 text-sm text-muted">Tell us what you're sourcing and we'll route it to the right supplier.</p>
        </div>
        <Link to="/support" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent2 to-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 hover-lift">
          Talk to us <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}

function Perk({ icon: Icon, title, body }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 transition hover:border-line2 hover-lift">
      <div className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-elevate text-accent">
        <Icon size={19} />
      </div>
      <div className="mt-4 text-sm font-semibold">{title}</div>
      <p className="mt-1.5 text-sm text-muted">{body}</p>
    </div>
  )
}
