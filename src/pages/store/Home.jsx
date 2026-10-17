import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Boxes, Radio, Truck, Zap, ShieldCheck, PackageCheck, Globe,
  Headphones, RefreshCw, Sparkles, Quote, Check, ChevronDown, Cpu,
} from 'lucide-react'
import { useStore } from '../../lib/store.jsx'
import ProductCard from '../../components/ProductCard.jsx'
import Sparkline from '../../components/Sparkline.jsx'
import { LiveDot, StatusPill } from '../../components/StatusPill.jsx'
import { categoryIcon } from '../../lib/categoryIcons.jsx'
import { compact, currency, timeAgo } from '../../lib/format.js'

function HeroPanel() {
  const { revenueSeries, channels, events } = useStore()
  const latest = events.slice(0, 4)
  return (
    <div className="relative rounded-2xl border border-line bg-surface p-5 shadow-[0_30px_80px_-40px_rgba(20,20,60,0.35)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted">Live revenue · rolling window</span>
        <LiveDot label="syncing" />
      </div>
      <div className="mt-1 flex items-end justify-between">
        <div className="text-3xl font-semibold tracking-tight">{currency(revenueSeries[revenueSeries.length - 1] * 24, 0)}</div>
        <Sparkline data={revenueSeries} height={44} width={140} color="var(--color-accent)" />
      </div>

      <div className="mt-5 space-y-2">
        {channels.slice(0, 4).map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border border-line bg-surface2 px-3 py-2">
            <span className="text-sm">{c.name}</span>
            <StatusPill status={c.status} />
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2 border-t border-line pt-4">
        {latest.map((e) => (
          <div key={e.id} className="flex items-center gap-2 text-xs">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: e.level === "warn" ? "var(--color-warn)" : e.level === "good" ? "var(--color-good)" : "var(--color-accent)" }} />
            <span className="truncate text-muted">{e.message}</span>
            <span className="ml-auto shrink-0 font-mono text-faint">{timeAgo(e.ts)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const { products, kpis } = useStore()
  const featured = [...products].sort((a, b) => b.velocity - a.velocity).slice(0, 8)

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 grid-bg radial-fade opacity-60" />
        <div
          className="absolute -top-40 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full blur-3xl drift"
          style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--color-accent2) 28%, transparent), transparent)" }}
        />
        <div
          className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full blur-3xl float-slow opacity-70"
          style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--color-accent) 24%, transparent), transparent)" }}
        />
        <div
          className="absolute right-[-6rem] top-1/3 h-64 w-64 rounded-full blur-3xl float-med opacity-60"
          style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--color-accent2) 20%, transparent), transparent)" }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 opacity-[0.35] spin-slow">
          <div className="grid h-full w-full place-items-center">
            <div className="h-56 w-56 rounded-full border-2 border-dashed border-accent/40" />
          </div>
        </div>
        <div className="relative mx-auto grid max-w-[88rem] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-32">
          <div className="flex flex-col justify-center stagger">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-muted">
              <Zap size={14} className="text-accent" /> Storefront + real-time inventory automation
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.03] tracking-tight sm:text-6xl lg:text-7xl">
              Hardware that runs on its <span className="text-gradient">own supply chain</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
              Orbital is a high-performance storefront wired to an automation pipeline that syncs suppliers, warehouse bins and every sales channel — so what shoppers see is always what's in stock.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/shop" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent2 to-accent px-6 py-3.5 text-base font-semibold text-white transition hover:opacity-90 hover-lift sheen">
                Shop all products <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/ops" className="inline-flex items-center gap-2 rounded-xl border border-line2 bg-surface px-6 py-3.5 text-base font-semibold transition hover:border-accent hover-glow">
                Open Ops console
              </Link>
            </div>
            <div className="mt-12 grid max-w-lg grid-cols-3 gap-5 border-t border-line pt-7">
              <Stat label="Units on hand" value={compact(kpis.units)} />
              <Stat label="Inventory value" value={currency(kpis.inventoryValue, 0)} />
              <Stat label="24h orders" value={compact(kpis.orders24h)} />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-full float-fast">
              <HeroPanel />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6">
        <div className="grid gap-5 stagger sm:grid-cols-2 lg:grid-cols-4">
          <Feature icon={Boxes} title="Warehouse-aware catalog" body="Product pages read live bin stock, so sold-out items can't oversell." />
          <Feature icon={Truck} title="Supplier sync" body="Inbound POs auto-trigger when items cross their reorder point." />
          <Feature icon={Radio} title="Channel consistency" body="Amazon, Shopify, TikTok and B2B stay in lockstep with one source of truth." />
          <Feature icon={Zap} title="Real-time by default" body="Every sale, shipment and transfer streams into the ops console instantly." />
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-4 pb-24 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Trending now</h2>
            <p className="mt-1.5 text-base text-muted">Ranked by sell-through velocity this week.</p>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-1 text-base font-medium text-accent hover:gap-2 transition-all sweep-underline">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 stagger lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <BrandStrip />

      <section className="mx-auto max-w-[88rem] px-4 py-20 sm:px-6">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Shop by category</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Every category, always in stock</h2>
          <p className="mt-3 text-base text-muted">Twelve product lines wired to live warehouse bins across three continents.</p>
        </div>
        <div className="grid grid-cols-2 gap-5 stagger sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.name} {...c} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-line bg-surface2/60">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative mx-auto max-w-[88rem] px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">How it works</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">From cart to doorstep, automated</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-muted">Four moving parts, one synchronized pipeline. No spreadsheets, no overselling, no guesswork.</p>
          </div>
          <div className="grid gap-6 stagger md:grid-cols-2 lg:grid-cols-4">
            <Step n="01" icon={PackageCheck} title="Order lands" body="A shopper checks out and the order streams into the ops console in real time." />
            <Step n="02" icon={Cpu} title="Engine allocates" body="The allocation engine reserves the perfect warehouse bin and flags low stock automatically." />
            <Step n="03" icon={Truck} title="Supplier syncs" body="When units cross the reorder point, an inbound PO is drafted and sent to the supplier." />
            <Step n="04" icon={Globe} title="Channels update" body="Amazon, Shopify, TikTok and B2B are refreshed from a single source of truth." />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Why Orbital</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Built for teams that hate stockouts</h2>
            <p className="mt-4 text-base text-muted">
              Orbital unifies the storefront and the warehouse into one living system. Every product page, procurement decision and channel listing reads from the same real-time inventory graph.
            </p>
            <div className="mt-8 space-y-4">
              <Point icon={ShieldCheck} title="Zero oversell guarantee" body="Sold-out items are hidden the instant a bin empties." />
              <Point icon={RefreshCw} title="Self-healing POs" body="Reorders trigger themselves before you run dry." />
              <Point icon={Headphones} title="Human support, 24/7" body="Real people on chat, email and phone — always." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 stagger">
            <BigStat value={compact(kpis.units)} label="Live units tracked" sub="across 3 warehouses" />
            <BigStat value="99.98%" label="Inventory accuracy" sub="rolling 30 days" />
            <BigStat value={`${kpis.orders24h}`} label="Orders last 24h" sub="auto-allocated" />
            <BigStat value="<400ms" label="Channel sync" sub="median latency" />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-[88rem] px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Loved by operators</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">The calmest inventory team in the building</h2>
          </div>
          <div className="grid gap-6 stagger md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Testimonial key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">FAQ</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Answers before you ask</h2>
            <p className="mt-4 text-base text-muted">Everything you need to know about fulfillment, returns and the automation engine.</p>
            <Link to="/support" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent sweep-underline">
              Still stuck? Visit support <ArrowRight size={15} />
            </Link>
          </div>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <Faq key={f.q} {...f} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-accent2/10 via-surface to-accent/10 p-10 text-center sm:p-16">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl float-slow" />
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-accent2/20 blur-3xl float-med" />
          <div className="relative">
            <Sparkles className="mx-auto text-accent" size={30} />
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Join the Orbital dispatch</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-muted">New drops, restocks and automation tips — once a week, no noise.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                placeholder="you@company.com"
                className="h-12 flex-1 rounded-xl border border-line bg-surface px-4 text-sm outline-none transition focus:border-accent"
              />
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent2 to-accent px-6 text-sm font-semibold text-white transition hover:opacity-90 hover-lift">
                Subscribe <ArrowRight size={16} />
              </button>
            </form>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-faint">
              <span className="inline-flex items-center gap-1.5"><Check size={13} /> No spam, ever</span>
              <span className="inline-flex items-center gap-1.5"><Check size={13} /> Unsubscribe anytime</span>
              <span className="inline-flex items-center gap-1.5"><Check size={13} /> 12,400+ subscribers</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-sm text-faint">{label}</div>
    </div>
  )
}

function Feature({ icon: Icon, title, body }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 transition hover:border-line2 hover-lift sheen">
      <div className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-elevate text-accent transition-transform duration-300 group-hover:scale-110">
        <Icon size={21} />
      </div>
      <div className="mt-5 text-base font-semibold">{title}</div>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  )
}

const BRANDS = ['NOVA', 'Kestrel', 'AXIOM', 'Lumen', 'Forge', 'Halcyon', 'Vireo', 'Orbit Labs', 'Cobalt', 'Nimbus']

function BrandStrip() {
  return (
    <section className="border-y border-line bg-surface2/50 py-8">
      <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.25em] text-faint">
        Powering supply chains for
      </p>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="marquee flex w-max items-center gap-14 pr-14">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className="text-xl font-bold tracking-tight text-faint/80 transition-colors hover:text-ink">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

const CATEGORIES = [
  { name: 'Lighting', hue: 45, blurb: 'Ambient + task' },
  { name: 'Peripherals', hue: 265, blurb: 'Keyboards & mice' },
  { name: 'Displays', hue: 210, blurb: '4K & ultrawide' },
  { name: 'Accessories', hue: 160, blurb: 'Cables & hubs' },
  { name: 'Audio', hue: 330, blurb: 'Headsets & mics' },
  { name: 'Storage', hue: 195, blurb: 'SSDs & drives' },
  { name: 'Power', hue: 20, blurb: 'Chargers & banks' },
  { name: 'Furniture', hue: 275, blurb: 'Desks & chairs' },
]

function CategoryCard({ name, hue, blurb }) {
  const Icon = categoryIcon(name)
  return (
    <Link
      to="/shop"
      className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 transition hover:border-line2 hover-lift"
      style={{ '--h': hue }}
    >
      <div
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-2xl transition-transform duration-500 group-hover:scale-125"
        style={{ background: `hsl(${hue} 80% 70%)` }}
      />
      <div
        className="relative grid h-14 w-14 place-items-center rounded-2xl border border-line bg-surface2 transition-transform duration-300 group-hover:-translate-y-1"
        style={{ color: `hsl(${hue} 45% 42%)` }}
      >
        <Icon size={24} strokeWidth={1.4} />
      </div>
      <div className="relative mt-5 text-base font-semibold">{name}</div>
      <div className="relative mt-0.5 text-sm text-faint">{blurb}</div>
      <div className="relative mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-all duration-300 group-hover:gap-2 group-hover:opacity-100">
        Browse <ArrowRight size={14} />
      </div>
    </Link>
  )
}

function Step({ n, icon: Icon, title, body }) {
  return (
    <div className="group relative rounded-2xl border border-line bg-surface p-6 transition hover:border-line2 hover-lift">
      <div className="flex items-center justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-accent2/15 to-accent/15 text-accent">
          <Icon size={22} />
        </div>
        <span className="font-mono text-3xl font-bold text-line2">{n}</span>
      </div>
      <div className="mt-5 text-lg font-semibold">{title}</div>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  )
}

function Point({ icon: Icon, title, body }) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-accent">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <p className="mt-0.5 text-sm text-muted">{body}</p>
      </div>
    </div>
  )
}

function BigStat({ value, label, sub }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 transition hover:border-line2 hover-lift">
      <div className="text-3xl font-bold tracking-tight text-gradient">{value}</div>
      <div className="mt-2 text-sm font-medium">{label}</div>
      <div className="mt-0.5 text-xs text-faint">{sub}</div>
    </div>
  )
}

const TESTIMONIALS = [
  { name: 'Ayesha K.', role: 'Head of Ops, Lumen Goods', quote: 'We killed three spreadsheets in a week. The reorder engine alone paid for itself before the first quarter closed.' },
  { name: 'Marcus D.', role: 'Founder, Kestrel Audio', quote: 'Channel sync used to be a Monday-morning nightmare. Now Amazon, Shopify and TikTok just agree with each other.' },
  { name: 'Priya N.', role: 'Supply Lead, Forge Labs', quote: 'The storefront finally tells the truth. If it shows in stock, it is in stock. That alone rebuilt customer trust.' },
]

function Testimonial({ name, role, quote }) {
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-surface p-7 transition hover:border-line2 hover-lift">
      <Quote className="text-accent/40" size={28} />
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">“{quote}”</p>
      <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent2 to-accent text-sm font-semibold text-white">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs text-faint">{role}</div>
        </div>
      </div>
    </div>
  )
}

const FAQS = [
  { q: 'How fast is fulfilment?', a: 'Orders received before 3pm ship the same day. Anything later goes out the next business morning, fully tracked.' },
  { q: 'Do you support B2B and bulk orders?', a: 'Absolutely. B2B pricing tiers, net terms and dedicated account managers are available on every product line.' },
  { q: 'What happens when an item sells out?', a: 'It is hidden from every channel instantly, and an inbound purchase order is drafted to your supplier automatically.' },
  { q: 'Can I connect my own warehouse?', a: 'Yes. Orbital connects to major WMS providers and accepts custom bin maps through our API.' },
  { q: 'What is the return window?', a: 'Thirty days, no questions asked. We email a prepaid label and the refund lands as soon as the scan is logged.' },
]

function Faq({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-line2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-muted transition-transform duration-300 ${open ? 'rotate-180 text-accent' : ''}`}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{a}</p>
        </div>
      </div>
    </div>
  )
}
