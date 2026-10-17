import { Link, useNavigate } from 'react-router-dom'
import { Minus, Package, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useStore } from '../lib/store.jsx'
import ProductTile from './ProductTile.jsx'
import { currency } from '../lib/format.js'

export default function CartDrawer({ open, onClose }) {
  const { cart, setQty, removeFromCart, cartSubtotal } = useStore()
  const navigate = useNavigate()
  const shipping = cartSubtotal > 0 && cartSubtotal < 99 ? 9 : 0

  const checkout = () => {
    onClose()
    navigate('/checkout')
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-line bg-surface transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShoppingBag size={17} className="text-accent" /> Your cart
            <span className="text-faint">({cart.length})</span>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-muted hover:bg-elevate hover:text-ink" aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-elevate text-muted">
              <Package size={22} />
            </div>
            <p className="text-sm text-muted">Your cart is empty. Every order here decrements live warehouse stock.</p>
            <Link to="/shop" onClick={onClose} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {cart.map((l) => (
                <div key={l.id} className="flex gap-3 border-b border-line py-3 last:border-0">
                  <ProductTile image={l.image} hue={l.hue} category={l.category} className="h-16 w-16 shrink-0" rounded="rounded-xl" imgClass="object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{l.name}</div>
                        <div className="font-mono text-[11px] text-faint">{l.sku}</div>
                      </div>
                      <button onClick={() => removeFromCart(l.id)} className="rounded-md p-1 text-faint hover:text-bad" aria-label="Remove">
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="inline-flex items-center rounded-lg border border-line">
                        <button onClick={() => setQty(l.id, l.qty - 1)} className="grid h-7 w-7 place-items-center text-muted hover:text-ink" aria-label="Decrease">
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center font-mono text-sm">{l.qty}</span>
                        <button onClick={() => setQty(l.id, l.qty + 1)} className="grid h-7 w-7 place-items-center text-muted hover:text-ink" aria-label="Increase">
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">{currency(l.price * l.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line px-5 py-4">
              <div className="flex justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span className="text-ink">{currency(cartSubtotal)}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm text-muted">
                <span>Shipping</span>
                <span className="text-ink">{shipping === 0 ? "Free" : currency(shipping)}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-line pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{currency(cartSubtotal + shipping)}</span>
              </div>
              <button
                onClick={checkout}
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-accent2 to-accent px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Checkout
              </button>
              <p className="mt-2 text-center text-[11px] text-faint">Orders allocate from live stock and appear in the Ops console.</p>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
