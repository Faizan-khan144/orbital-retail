import { Link } from 'react-router-dom'
import { ArrowRight, Award, Gauge, Globe, Leaf, ShieldCheck, Truck, Warehouse, Zap } from 'lucide-react'
import { useStore } from '../../lib/store.jsx'
import { compact, currency, num } from '../../lib/format.js'

const VALUES = [
  { icon: Gauge, title: 'Engineered precision', body: 'Every SKU is spec-checked and tolerance-tested before it earns a place in the catalog.' },
  { icon: ShieldCheck, title: 'No-surprise warranty', body: 'Two-year coverage and 30-day returns, handled centrally with zero friction.' },
  { icon: Leaf, title: 'Built to last', body: 'Repairable parts and recycled packaging, because gear shouldn’t be disposable.' },
  { icon: Award, title: 'Honest pricing', body: 'Direct-from-supplier sourcing keeps margins fair on both sides of the sale.' },
]

const PIPELINE = [
  { icon: Truck, step: '01', title: 'Supplier network', body: 'Six vetted manufacturers feed components, parts and finished goods into predictable inbound lanes.' },
  { icon: Warehouse, step: '02', title: 'Warehouse bins', body: 'Stock is tracked bin-by-bin and reorder points fire purchase orders the moment inventory dips.' },
  { icon: Globe, step: '03', title: 'Sales channels', body: 'Storefront, marketplaces and B2B all read one source of truth, so nothing oversells.' },
]

export default function About() {
  const { kpis, products, channels } = useStore()

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 grid-bg radial-fade opacity-60" />
        <div
          className="absolute -top-40 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(closest-side, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent)' }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-24">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
            <Zap size={13} className="text-accent" /> Our story
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            We build the gear — and the machine that ships it.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted sm:text-lg">
            Orbital started as a simple question: why is a great product ruined by a broken supply chain? So we built both sides
            of the shelf. A curated storefront for people who care about their desk, wired directly into an automation
            pipeline that keeps every channel honest.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent2 to-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
              Explore the catalog <ArrowRight size={16} />
            </Link>
            <Link to="/ops" className="inline-flex items-center gap-2 rounded-xl border border-line2 bg-surface px-5 py-3 text-sm font-semibold transition hover:border-accent">
              See the ops console
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-[88rem] grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
          <Figure value={num(products.length)} label="Products engineered" />
          <Figure value={compact(kpis.units)} label="Units under management" />
          <Figure value={currency(kpis.retailValue, 0)} label="Catalog retail value" />
          <Figure value={num(channels.length)} label="Live sales channels" />
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What we stand for</h2>
          <p className="mt-2 text-sm text-muted">Four principles that shape every product and every purchase order.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-line bg-surface p-5 transition hover:border-line2">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-elevate text-accent">
                <v.icon size={18} />
              </div>
              <div className="mt-4 text-sm font-semibold">{v.title}</div>
              <p className="mt-1.5 text-sm text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Inside the operation</h2>
            <p className="mt-2 text-sm text-muted">One pipeline, three stages — visible in real time from the storefront to the console.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {PIPELINE.map((p) => (
              <div key={p.step} className="relative rounded-2xl border border-line bg-bg p-6">
                <span className="font-mono text-xs font-semibold text-faint">{p.step}</span>
                <div className="mt-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-accent2 to-accent text-white">
                  <p.icon size={20} />
                </div>
                <div className="mt-4 font-semibold">{p.title}</div>
                <p className="mt-1.5 text-sm text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-line bg-gradient-to-br from-surface to-bg p-10 text-center shadow-[0_30px_80px_-40px_rgba(20,20,60,0.35)]">
          <h2 className="max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">Hardware that keeps its own promises.</h2>
          <p className="max-w-lg text-sm text-muted">Browse the catalog, then watch the pipeline allocate every order in the ops console.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent2 to-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
              Shop all products <ArrowRight size={16} />
            </Link>
            <Link to="/support" className="inline-flex items-center gap-2 rounded-xl border border-line2 bg-surface px-5 py-3 text-sm font-semibold transition hover:border-accent">
              Visit support
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function Figure({ value, label }) {
  return (
    <div className="text-center sm:text-left">
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="mt-0.5 text-xs text-faint">{label}</div>
    </div>
  )
}
