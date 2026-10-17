import { NavLink, Link, Outlet } from 'react-router-dom'
import { BarChart3, Boxes, ClipboardList, LayoutDashboard, PackagePlus, Pause, Play, Radio, Store, Truck } from 'lucide-react'
import { useStore } from '../lib/store.jsx'
import { LiveDot } from './StatusPill.jsx'
import { Logo } from './StoreLayout.jsx'
import { clock } from '../lib/format.js'

const items = [
  { to: '/ops', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/ops/orders', label: 'Orders', icon: ClipboardList },
  { to: '/ops/inventory', label: 'Inventory', icon: Boxes },
  { to: '/ops/purchases', label: 'Purchases', icon: PackagePlus },
  { to: '/ops/suppliers', label: 'Suppliers', icon: Truck },
  { to: '/ops/channels', label: 'Channels', icon: Radio },
  { to: '/ops/reports', label: 'Reports', icon: BarChart3 },
]

export default function OpsLayout() {
  const { paused, setPaused, lastTick, kpis } = useStore()

  const link = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
      isActive ? "bg-elevate text-ink ring-1 ring-inset ring-line2" : "text-muted hover:bg-surface2 hover:text-ink"
    }`

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-surface px-4 py-5 lg:flex">
        <Logo to="/ops" />
        <div className="mt-1 pl-10 font-mono text-[11px] uppercase tracking-widest text-faint">Ops Console</div>

        <nav className="mt-6 flex flex-col gap-1">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end} className={link}>
              <it.icon size={17} /> {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-surface2 hover:text-ink">
            <Store size={17} /> View storefront
          </Link>
          <div className="rounded-xl border border-line bg-surface2 p-3">
            <div className="flex items-center justify-between">
              <LiveDot label={paused ? "Paused" : "Pipeline live"} color={paused ? "var(--color-warn)" : "var(--color-good)"} />
            </div>
            <div className="mt-2 font-mono text-[11px] text-faint">tick {clock(lastTick)}</div>
            <div className="mt-1 text-[11px] text-faint">{kpis.syncHealth.toFixed(0)}% channels healthy</div>
            <button
              onClick={() => setPaused((p) => !p)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-line2 bg-elevate px-3 py-2 text-xs font-semibold transition hover:border-accent hover:text-accent"
            >
              {paused ? <Play size={13} /> : <Pause size={13} />}
              {paused ? "Resume pipeline" : "Pause pipeline"}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur-xl lg:hidden">
          <div className="flex h-14 items-center gap-3 px-4">
            <Logo to="/ops" />
            <nav className="ml-auto flex items-center gap-1 overflow-x-auto no-scrollbar">
              {items.map((it) => (
                <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) => `whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium ${isActive ? "bg-elevate text-ink" : "text-muted"}`}>
                  {it.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
