import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Lock } from 'lucide-react'
import { useStore } from '../../lib/store.jsx'
import ProductTile from '../../components/ProductTile.jsx'
import { currency } from '../../lib/format.js'

export default function Checkout() {
  const { cart, cartSubtotal, placeOrder } = useStore()
  const [placed, setPlaced] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '', card: '' })

  const shipping = cartSubtotal > 0 && cartSubtotal < 99 ? 9 : 0
  const total = cartSubtotal + shipping

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const id = placeOrder('ch_storefront')
    if (id) setPlaced({ id, total })
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-good/15 text-good">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="mt-5 text-2xl font-bold">Order {placed.id} confirmed</h1>
        <p className="mt-2 text-sm text-muted">
          {currency(placed.total)} · Stock has been allocated from the warehouse and the sale is now visible in the ops console pipeline.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link to="/ops" className="rounded-xl bg-gradient-to-r from-accent2 to-accent px-5 py-3 text-sm font-semibold text-white">Watch it in Ops</Link>
          <Link to="/shop" className="rounded-xl border border-line2 bg-surface px-5 py-3 text-sm font-semibold hover:border-accent">Keep shopping</Link>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted">Add a few products and come back to check out.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white">Browse products</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={submit} className="space-y-6">
          <Fieldset title="Contact">
            <Input label="Full name" value={form.name} onChange={set('name')} required placeholder="Ada Lovelace" />
            <Input label="Email" type="email" value={form.email} onChange={set('email')} required placeholder="ada@orbit.al" />
          </Fieldset>
          <Fieldset title="Shipping">
            <Input label="Address" value={form.address} onChange={set('address')} required placeholder="1 Orbital Way" className="sm:col-span-2" />
            <Input label="City" value={form.city} onChange={set('city')} required placeholder="Rotterdam" />
            <Input label="ZIP / Postal" value={form.zip} onChange={set('zip')} required placeholder="3011" />
          </Fieldset>
          <Fieldset title="Payment">
            <Input label="Card number" value={form.card} onChange={set('card')} required placeholder="4242 4242 4242 4242" className="sm:col-span-2" />
          </Fieldset>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent2 to-accent px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90">
            <Lock size={15} /> Pay {currency(total)}
          </button>
          <p className="text-center text-xs text-faint">Demo checkout — no payment is processed.</p>
        </form>

        <aside className="h-fit rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold">Order summary</h2>
          <div className="mt-4 space-y-3">
            {cart.map((l) => (
              <div key={l.id} className="flex items-center gap-3">
                <ProductTile image={l.image} hue={l.hue} category={l.category} className="h-12 w-12 shrink-0" rounded="rounded-lg" imgClass="object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{l.name}</div>
                  <div className="font-mono text-[11px] text-faint">×{l.qty}</div>
                </div>
                <div className="text-sm font-medium">{currency(l.price * l.qty)}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-line pt-4 text-sm text-muted">
            <Row label="Subtotal" value={currency(cartSubtotal)} />
            <Row label="Shipping" value={shipping === 0 ? 'Free' : currency(shipping)} />
            <div className="flex justify-between border-t border-line pt-3 text-base font-semibold text-ink">
              <span>Total</span>
              <span>{currency(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Fieldset({ title, children }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  )
}

function Input({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-line bg-surface2 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-faint focus:border-accent"
      />
    </label>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  )
}
