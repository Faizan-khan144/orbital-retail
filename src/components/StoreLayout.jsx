import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Search, ShoppingBag } from 'lucide-react'
import { useStore } from '../lib/store.jsx'
import CartDrawer from './CartDrawer.jsx'
import { LiveDot } from './StatusPill.jsx'

export function Logo({ to = "/" }) {
  return (
    <Link to={to} className="group flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#0f0f16] shadow-sm">
        <svg viewBox="0 0 32 32" className="h-[21px] w-[21px]" aria-hidden="true">
          <circle
            cx="16"
            cy="16"
            r="9"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="40 14"
            transform="rotate(-38 16 16)"
          />
          <circle cx="22" cy="10" r="2.6" fill="#fff" />
        </svg>
      </span>
      <span className="text-[17px] font-bold tracking-[-0.02em]">
        Orbital<span className="text-accent">.</span>
      </span>
    </Link>
  )
}

const navLink = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? "text-ink" : "text-muted hover:text-ink"}`

export default function StoreLayout() {
  const { cartCount } = useStore()
  const [cartOpen, setCartOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : '/shop')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="overflow-hidden border-b border-line bg-surface">
        <div className="marquee flex w-max gap-10 py-2 text-xs text-faint">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex w-max gap-10">
              <span>Free shipping over $99</span>
              <span>Inventory synced across 5 channels in real time</span>
              <span>Same-day dispatch from Zone A</span>
              <span>30-day returns, no questions asked</span>
              <span>Free shipping over $99</span>
              <span>Inventory synced across 5 channels in real time</span>
              <span>Same-day dispatch from Zone A</span>
              <span>30-day returns, no questions asked</span>
            </div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[88rem] items-center gap-4 px-4 sm:px-6">
          <Logo />
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            <NavLink to="/" className={navLink} end>
              Home
            </NavLink>
            <NavLink to="/shop" className={navLink}>
              Shop
            </NavLink>
            <NavLink to="/about" className={navLink}>
              About
            </NavLink>
            <NavLink to="/support" className={navLink}>
              Support
            </NavLink>
            <Link to="/ops" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:text-accent">
              <LayoutDashboard size={15} /> Ops Console
            </Link>
          </nav>

          <form onSubmit={submit} className="ml-auto hidden max-w-xs flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 sm:flex">
            <Search size={15} className="text-faint" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
            />
          </form>

          <div className="ml-auto flex items-center gap-3 sm:ml-0">
            <LiveDot label="Live" className="hidden lg:flex" />
            <button
              onClick={() => setCartOpen(true)}
              className="relative inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-medium transition hover:border-accent"
            >
              <ShoppingBag size={17} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-[88rem] gap-8 px-4 py-12 sm:px-6 md:grid-cols-5">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-muted">
              A high-performance storefront backed by an inventory automation pipeline that syncs suppliers, warehouse and sales channels in real time.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold">Shop</div>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
              <Link to="/shop" className="hover:text-ink">All products</Link>
              <Link to="/shop?q=audio" className="hover:text-ink">Audio</Link>
              <Link to="/shop?q=desk" className="hover:text-ink">Desk setup</Link>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold">Operations</div>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
              <Link to="/ops" className="hover:text-ink">Dashboard</Link>
              <Link to="/ops/orders" className="hover:text-ink">Orders</Link>
              <Link to="/ops/purchases" className="hover:text-ink">Purchases</Link>
              <Link to="/ops/reports" className="hover:text-ink">Reports</Link>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold">Company</div>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
              <Link to="/about" className="hover:text-ink">About</Link>
              <Link to="/support" className="hover:text-ink">Support</Link>
              <Link to="/ops/channels" className="hover:text-ink">Channels</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-line py-6 text-center text-xs text-faint">
          © {new Date().getFullYear()} Orbital Retail — Storefront &amp; Ops. Built as a product demo.
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
