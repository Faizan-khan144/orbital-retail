import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { BINS, CHANNELS, PRODUCTS, SUPPLIERS } from "../data/seed"

const StoreCtx = createContext(null)

const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const uid = (p) => `${p}_${Math.random().toString(36).slice(2, 9)}`

let seq = 1000
const nextId = (p) => `${p}-${++seq}`

function seedChannels() {
  return CHANNELS.map((c, i) => ({
    ...c,
    status: i === 4 ? "syncing" : "synced",
    lastSync: Date.now() - Math.floor(rand(2, 9) * 60000),
    orders24h: Math.round(rand(120, 640) * c.share * 10),
    revenue24h: Math.round(rand(9000, 42000) * c.share * 10),
    latency: Math.round(rand(38, 180)),
    uptime: rand(98.2, 99.98),
  }))
}

function seedEvents(products, channels) {
  const out = []
  for (let i = 0; i < 7; i++) {
    const p = pick(products)
    const c = pick(channels)
    out.push({
      id: uid("ev"),
      ts: Date.now() - (7 - i) * rand(9000, 26000),
      kind: "sale",
      level: "info",
      channelId: c.id,
      productId: p.id,
      qty: Math.ceil(rand(1, 3)),
      message: `${c.name} order · ${p.name}`,
    })
  }
  return out.sort((a, b) => b.ts - a.ts)
}

function seedOrders(products, channels) {
  const statuses = ["allocated", "allocated", "picking", "picking", "shipped", "delivered"]
  const out = []
  for (let i = 0; i < 12; i++) {
    const c = pick(channels)
    const n = 1 + Math.floor(rand(0, 3))
    const lines = []
    const used = new Set()
    for (let j = 0; j < n; j++) {
      const p = pick(products)
      if (used.has(p.id)) continue
      used.add(p.id)
      lines.push({ id: p.id, sku: p.sku, name: p.name, price: p.price, category: p.category, hue: p.hue, qty: 1 + Math.floor(rand(0, 3)) })
    }
    const total = lines.reduce((a, l) => a + l.price * l.qty, 0)
    out.push({ id: `#${4120 + i}`, channelId: c.id, lines, total, ts: Date.now() - i * rand(40000, 150000), status: pick(statuses) })
  }
  return out.sort((a, b) => b.ts - a.ts)
}

function walk(base, vol, min, max) {
  const v = base + rand(-vol, vol)
  return Math.min(max, Math.max(min, v))
}

const CART_KEY = "orbital.cart.v1"

function loadCart() {
  try {
    if (typeof localStorage === "undefined") return []
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (l) => l && typeof l.id === "string" && typeof l.price === "number" && typeof l.qty === "number" && l.qty > 0,
    )
  } catch {
    return []
  }
}

function saveCart(cart) {
  try {
    if (typeof localStorage === "undefined") return
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  } catch {
    /* storage unavailable — ignore */
  }
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => PRODUCTS.map((p) => ({ ...p })))
  const [suppliers, setSuppliers] = useState(() => SUPPLIERS.map((s) => ({ ...s })))
  const [bins, setBins] = useState(() => BINS.map((b) => ({ ...b })))

  const [channels, setChannels] = useState(seedChannels)
  const [events, setEvents] = useState(() => seedEvents(PRODUCTS, CHANNELS))
  const [orders, setOrders] = useState(() => seedOrders(PRODUCTS, CHANNELS))
  const [revenueSeries, setRevenueSeries] = useState(() => {
    let v = 26000
    return Array.from({ length: 32 }, () => (v = walk(v, 2600, 12000, 46000)))
  })
  const [fulfilment, setFulfilment] = useState(97.8)
  const [cart, setCart] = useState(loadCart)
  const [paused, setPaused] = useState(false)
  const [lastTick, setLastTick] = useState(Date.now())

  useEffect(() => { saveCart(cart) }, [cart])

  const productsRef = useRef(products)
  useEffect(() => { productsRef.current = products }, [products])
  const channelsRef = useRef(channels)
  useEffect(() => { channelsRef.current = channels }, [channels])
  const binsRef = useRef(bins)
  useEffect(() => { binsRef.current = bins }, [bins])

  const pushEvent = useCallback((e) => {
    setEvents((prev) => [{ id: uid("ev"), ts: Date.now(), level: "info", ...e }, ...prev].slice(0, 60))
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      if (paused) return
      setLastTick(Date.now())
      const roll = Math.random()

      if (roll < 0.58) {
        const p = pick(productsRef.current)
        const synced = channelsRef.current.filter((x) => x.status === "synced")
        const c = pick(synced.length ? synced : channelsRef.current)
        const qty = Math.ceil(rand(1, 3))
        setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, stock: Math.max(0, x.stock - qty) } : x)))
        setChannels((prev) =>
          prev.map((x) =>
            x.id === c.id
              ? { ...x, orders24h: x.orders24h + 1, revenue24h: x.revenue24h + p.price * qty, latency: Math.round(walk(x.latency, 14, 28, 220)) }
              : x,
          ),
        )
        pushEvent({ kind: "sale", channelId: c.id, productId: p.id, qty, message: `${c.name} order · ${p.name}` })
        if (p.stock - qty <= p.reorder) {
          pushEvent({ kind: "alert", level: "warn", productId: p.id, qty: p.stock - qty, message: `Reorder point hit · ${p.name}` })
        }
      } else if (roll < 0.76) {
        const low = productsRef.current.filter((p) => p.stock <= p.reorder)
        const p = low.length ? pick(low) : pick(productsRef.current)
        const qty = Math.ceil(rand(30, 90))
        setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, stock: x.stock + qty } : x)))
        setSuppliers((prev) => prev.map((s) => (s.id === p.supplierId && s.openPOs > 0 ? { ...s, openPOs: s.openPOs - 1 } : s)))
        const sup = SUPPLIERS.find((s) => s.id === p.supplierId)
        pushEvent({ kind: "shipment", level: "good", productId: p.id, qty, message: `Inbound ${qty}u · ${sup?.name ?? "supplier"}` })
      } else if (roll < 0.88) {
        const b = pick(binsRef.current)
        const delta = Math.round(rand(-40, 40))
        setBins((prev) => prev.map((x) => (x.id === b.id ? { ...x, used: Math.min(x.capacity, Math.max(0, x.used + delta)) } : x)))
        pushEvent({ kind: "transfer", productId: null, message: `Bin ${b.id} ${delta >= 0 ? "replenished" : "picked"} (${delta >= 0 ? "+" : ""}${delta}u)`, level: "info" })
      } else {
        const c = pick(channelsRef.current)
        const next = pick(["synced", "synced", "synced", Math.random() < 0.5 ? "syncing" : "degraded"])
        setChannels((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: next, lastSync: Date.now(), latency: Math.round(walk(x.latency, 24, 28, 260)) } : x)))
        pushEvent({
          kind: "sync",
          channelId: c.id,
          level: next === "degraded" ? "warn" : "info",
          message: `${c.name} channel ${next === "synced" ? "synced" : next}`,
        })
      }

      setRevenueSeries((prev) => {
        const next = walk(prev[prev.length - 1], 2800, 12000, 46000)
        return [...prev.slice(1), next]
      })
      setFulfilment((f) => Math.min(99.6, Math.max(95.4, f + rand(-0.25, 0.24))))
    }, 2200)
    return () => clearInterval(t)
  }, [paused, pushEvent])

  const kpis = useMemo(() => {
    const units = products.reduce((a, p) => a + p.stock, 0)
    const inventoryValue = products.reduce((a, p) => a + p.stock * p.cost, 0)
    const retailValue = products.reduce((a, p) => a + p.stock * p.price, 0)
    const lowStock = products.filter((p) => p.stock <= p.reorder)
    const openPOs = suppliers.reduce((a, s) => a + s.openPOs, 0)
    const orders24h = channels.reduce((a, c) => a + c.orders24h, 0)
    const revenue24h = channels.reduce((a, c) => a + c.revenue24h, 0)
    const synced = channels.filter((c) => c.status === "synced").length
    const avgLatency = channels.reduce((a, c) => a + c.latency, 0) / channels.length
    const binUsed = bins.reduce((a, b) => a + b.used, 0)
    const binCap = bins.reduce((a, b) => a + b.capacity, 0)
    return {
      units,
      inventoryValue,
      retailValue,
      lowStock,
      openPOs,
      orders24h,
      revenue24h,
      syncHealth: (synced / channels.length) * 100,
      avgLatency,
      fulfilment,
      binUsed,
      binCap,
      warehouseFill: (binUsed / binCap) * 100,
    }
  }, [products, suppliers, channels, bins, fulfilment])

  const addToCart = useCallback((product, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((l) => l.id === product.id)
      if (found) return prev.map((l) => (l.id === product.id ? { ...l, qty: Math.min(l.qty + qty, product.stock || 99) } : l))
      return [...prev, { id: product.id, sku: product.sku, name: product.name, price: product.price, category: product.category, hue: product.hue, image: product.image, qty }]
    })
  }, [])

  const setQty = useCallback((id, qty) => {
    setCart((prev) => prev.flatMap((l) => (l.id === id ? (qty <= 0 ? [] : [{ ...l, qty }]) : [l])))
  }, [])

  const removeFromCart = useCallback((id) => setCart((prev) => prev.filter((l) => l.id !== id)), [])
  const clearCart = useCallback(() => setCart([]), [])

  const placeOrder = useCallback(
    (channelId = "ch_storefront") => {
      let placed
      setCart((prev) => {
        placed = prev
        return []
      })
      if (!placed || !placed.length) return null
      const total = placed.reduce((a, l) => a + l.price * l.qty, 0)
      const id = nextId("ORD")
      setProducts((prev) =>
        prev.map((p) => {
          const line = placed.find((l) => l.id === p.id)
          return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p
        }),
      )
      setChannels((prev) =>
        prev.map((c) => (c.id === channelId ? { ...c, orders24h: c.orders24h + 1, revenue24h: c.revenue24h + total, lastSync: Date.now() } : c)),
      )
      setOrders((prev) => [{ id, channelId, lines: placed, total, ts: Date.now(), status: "allocated" }, ...prev].slice(0, 24))
      placed.forEach((l) =>
        pushEvent({ kind: "sale", level: "good", channelId, productId: l.id, qty: l.qty, message: `New order ${id} · ${l.name} ×${l.qty}` }),
      )
      return id
    },
    [pushEvent],
  )

  const raisePO = useCallback(
    (productId) => {
      const p = productsRef.current.find((x) => x.id === productId)
      if (!p) return
      const qty = p.reorder * 2
      setSuppliers((prev) => prev.map((s) => (s.id === p.supplierId ? { ...s, openPOs: s.openPOs + 1 } : s)))
      pushEvent({ kind: "sync", level: "info", productId, qty, message: `PO raised · ${p.name} (${qty}u)` })
      setTimeout(() => {
        setProducts((prev) => prev.map((x) => (x.id === productId ? { ...x, stock: x.stock + qty } : x)))
        setSuppliers((prev) => prev.map((s) => (s.id === p.supplierId ? { ...s, openPOs: Math.max(0, s.openPOs - 1) } : s)))
        pushEvent({ kind: "shipment", level: "good", productId, qty, message: `PO received · ${p.name} (+${qty}u)` })
      }, 4200)
    },
    [pushEvent],
  )

  const syncChannel = useCallback(
    (id) => {
      const c = CHANNELS.find((x) => x.id === id)
      setChannels((prev) => prev.map((x) => (x.id === id ? { ...x, status: "syncing" } : x)))
      setTimeout(() => {
        setChannels((prev) => prev.map((x) => (x.id === id ? { ...x, status: "synced", lastSync: Date.now(), latency: Math.round(walk(x.latency, 12, 28, 220)) } : x)))
        pushEvent({ kind: "sync", level: "good", channelId: id, message: `${c?.name ?? "Channel"} manual sync complete` })
      }, 950)
    },
    [pushEvent],
  )

  const cartCount = cart.reduce((a, l) => a + l.qty, 0)
  const cartSubtotal = cart.reduce((a, l) => a + l.price * l.qty, 0)

  const value = {
    products,
    suppliers,
    channels,
    bins,
    events,
    orders,
    revenueSeries,
    kpis,
    paused,
    setPaused,
    lastTick,
    cart,
    cartCount,
    cartSubtotal,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    placeOrder,
    raisePO,
    syncChannel,
    supplierById: (id) => suppliers.find((s) => s.id === id),
    channelById: (id) => channels.find((c) => c.id === id),
    productById: (id) => products.find((p) => p.id === id),
  }

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
