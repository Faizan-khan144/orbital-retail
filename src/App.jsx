import { Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './lib/store.jsx'
import StoreLayout from './components/StoreLayout.jsx'
import OpsLayout from './components/OpsLayout.jsx'
import Home from './pages/store/Home.jsx'
import Shop from './pages/store/Shop.jsx'
import Product from './pages/store/Product.jsx'
import Checkout from './pages/store/Checkout.jsx'
import About from './pages/store/About.jsx'
import Support from './pages/store/Support.jsx'
import Dashboard from './pages/ops/Dashboard.jsx'
import Inventory from './pages/ops/Inventory.jsx'
import Suppliers from './pages/ops/Suppliers.jsx'
import Channels from './pages/ops/Channels.jsx'
import Orders from './pages/ops/Orders.jsx'
import Purchases from './pages/ops/Purchases.jsx'
import Reports from './pages/ops/Reports.jsx'

export default function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
        </Route>
        <Route path="/ops" element={<OpsLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="channels" element={<Channels />} />
          <Route path="orders" element={<Orders />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </StoreProvider>
  )
}
