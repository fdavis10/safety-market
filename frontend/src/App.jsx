import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CartProvider } from './CartContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Packages from './pages/Packages'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import DocumentPage from './pages/DocumentPage'
import OrderSuccess from './pages/OrderSuccess'
import OrderPayReturn from './pages/OrderPayReturn'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Catalog />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/rules" element={<DocumentPage kind="rules" />} />
            <Route path="/offer" element={<DocumentPage kind="offer" />} />
            <Route path="/order/:id/pay" element={<OrderPayReturn />} />
            <Route path="/order/:id" element={<OrderSuccess />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
