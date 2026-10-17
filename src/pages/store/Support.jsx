import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, CreditCard, Headphones, HelpCircle, Mail, MapPin, PackageCheck, Phone, RotateCcw, Search, Truck } from 'lucide-react'

const FAQS = [
  { q: 'How long does shipping take?', a: 'In-stock items dispatch same-day from Zone A and typically arrive in 2–4 business days. Orders over $99 ship free; everything else is a flat $6.' },
  { q: 'Can I return something I don’t like?', a: 'Yes. You have 30 days from delivery for a no-questions-asked return. We email a prepaid label the moment you start the request — no restocking fees.' },
  { q: 'Do you offer a warranty?', a: 'Every Orbital product carries a two-year warranty against defects. If something fails under normal use, we replace or repair it free of charge.' },
  { q: 'Is my payment information secure?', a: 'All checkouts run over encrypted connections with tokenised card data. We never store raw card numbers on our servers.' },
  { q: 'Do you ship internationally?', a: 'We currently ship across North America, the UK and the EU. Duties are calculated transparently at checkout so there are no surprises on delivery.' },
  { q: 'How do I track my order?', a: 'You will receive a tracking link by email as soon as your parcel is allocated in the warehouse. Live allocation status is also visible in the ops console.' },
  { q: 'Can I change or cancel an order?', a: 'Orders can be edited or cancelled free of charge until they reach the picking stage. After that, use the returns flow once it arrives.' },
  { q: 'Do you offer bulk or B2B pricing?', a: 'Yes. Our Wholesale channel supports tiered pricing and purchase orders. Reach out to the sales desk and we will set you up.' },
]

const CHANNELS = [
  { icon: Headphones, title: 'Customer care', body: 'Mon–Fri, 8am–8pm', detail: 'hello.lueniastudio@gmail.com', action: 'Email us', to: 'mailto:hello.lueniastudio@gmail.com' },
  { icon: Phone, title: 'Call the desk', body: 'Priority for warranty claims', detail: '+92 307 0120536', action: 'Call now', to: 'tel:+923070120536' },
  { icon: PackageCheck, title: 'B2B & wholesale', body: 'Tiered pricing & POs', detail: 'hello.lueniastudio@gmail.com', action: 'Talk to sales', to: 'mailto:hello.lueniastudio@gmail.com' },
]

const TOPICS = [
  { icon: Truck, label: 'Shipping & delivery' },
  { icon: RotateCcw, label: 'Returns & exchanges' },
  { icon: CreditCard, label: 'Payments & billing' },
  { icon: MapPin, label: 'Order tracking' },
]

export default function Support() {
  const [open, setOpen] = useState(0)
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()
  const faqs = query ? FAQS.filter((f) => (f.q + ' ' + f.a).toLowerCase().includes(query)) : FAQS

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
          <HelpCircle size={13} className="text-accent" /> Help center
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">How can we help?</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
          Answers to the questions we get most, plus a direct line to a human when you need one.
        </p>
        <label className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 shadow-sm focus-within:border-accent">
          <Search size={16} className="text-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search help articles…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
          />
        </label>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TOPICS.map((t) => (
          <div key={t.label} className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-4 transition hover:border-accent">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-elevate text-accent">
              <t.icon size={16} />
            </span>
            <span className="text-sm font-medium">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <section>
          <h2 className="text-lg font-bold tracking-tight">Frequently asked</h2>
          <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {faqs.length === 0 && <div className="px-5 py-6 text-sm text-muted">No articles match “{q}”.</div>}
            {faqs.map((f) => {
              const i = FAQS.indexOf(f)
              const isOpen = open === i
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-surface2"
                  >
                    <span className="flex-1 text-sm font-medium">{f.q}</span>
                    <ChevronRight size={16} className={`shrink-0 text-faint transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {isOpen && <p className="px-5 pb-5 text-sm text-muted">{f.a}</p>}
                </div>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold tracking-tight">Still need a hand?</h2>
          <div className="mt-4 space-y-3">
            {CHANNELS.map((c) => (
              <div key={c.title} className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-elevate text-accent">
                    <c.icon size={16} />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{c.title}</div>
                    <div className="text-xs text-faint">{c.body}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted">{c.detail}</div>
                <a
                  href={c.to}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-line2 bg-elevate px-3 py-2 text-xs font-semibold transition hover:border-accent hover:text-accent"
                >
                  <Mail size={13} /> {c.action}
                </a>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-line bg-surface2 p-5">
            <div className="text-sm font-semibold">Order not right yet?</div>
            <p className="mt-1.5 text-sm text-muted">Start a return or track a shipment in a few clicks.</p>
            <Link to="/shop" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
              Back to shop <ChevronRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
