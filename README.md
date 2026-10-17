# Orbital Retail — Storefront & Ops

[![Contributors](https://img.shields.io/github/contributors/Faizan-khan144/orbital-retail)](https://github.com/Faizan-khan144/orbital-retail/graphs/contributors)
[![Last commit](https://img.shields.io/github/last-commit/Faizan-khan144/orbital-retail)](https://github.com/Faizan-khan144/orbital-retail/commits/main)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#license)

A high-performance storefront wired to a real-time inventory automation pipeline. Shoppers browse a live catalog that reads directly from warehouse bins, while operators watch orders, stock, suppliers and sales channels sync in the ops console.

> Hardware that runs on its own supply chain.

## Highlights

- **Live inventory engine** — a rolling simulation streams sales, shipments, bin transfers and channel syncs into the UI every ~2s.
- **Warehouse-aware catalog** — product pages read live bin stock, so sold-out items can never oversell.
- **Storefront** — home, shop with filtering/sorting, product detail, quick-view modal, cart drawer and checkout.
- **Ops console** — dashboard, orders, inventory, purchases, suppliers, channels and reports.
- **Light, premium design system** — token-based theme, generous spacing and a rich motion layer (reveal-on-scroll, stagger, float, sheen, gradient text).
- **Persistent cart** — the cart survives refreshes via `localStorage`.

## Tech stack

| Layer | Choice |
| --- | --- |
| Build | Vite 8 |
| UI | React 19 |
| Routing | react-router-dom 7 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Icons | lucide-react |
| Lint | oxlint |

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

### Scripts

```bash
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint      # run oxlint
```

## Project structure

```
src/
  components/   # shared UI (layouts, product tile/card, cart drawer, quick view)
  data/         # seed data: products, suppliers, bins, channels
  lib/          # store engine, formatting helpers, icon maps
  pages/
    store/      # customer-facing pages
    ops/        # operations console pages
  App.jsx       # route table
  index.css     # theme tokens + animation layer
```

## Contributors

- [Muhammad Faizan Khan](https://github.com/Faizan-khan144)

## License

MIT
