import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar          from './components/Navbar'
import CartDrawer      from './components/CartDrawer'
import ProtectedRoute  from './components/ProtectedRoute'
import AdminRoute      from './components/AdminRoute'
import Home            from './pages/Home'
import ProductDetail   from './pages/ProductDetail'
import Cart            from './pages/Cart'
import Checkout        from './pages/Checkout'
import OrderHistory    from './pages/OrderHistory'
import Wishlist        from './pages/Wishlist'
import Login           from './pages/Login'
import Register        from './pages/Register'
import ForgotPassword  from './pages/ForgotPassword'
import ResetPassword   from './pages/ResetPassword'
import Dashboard       from './pages/admin/Dashboard'
import ManageProducts  from './pages/admin/ManageProducts'
import ManageOrders    from './pages/admin/ManageOrders'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <CartDrawer />
            <main className="max-w-7xl mx-auto px-4 pt-0 pb-8">
              <Routes>
                <Route path="/"                 element={<Home />} />
                <Route path="/products/:id"     element={<ProductDetail />} />
                <Route path="/login"            element={<Login />} />
                <Route path="/register"         element={<Register />} />
                <Route path="/forgot-password"  element={<ForgotPassword />} />
                <Route path="/reset-password"   element={<ResetPassword />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/cart"      element={<Cart />} />
                  <Route path="/checkout"  element={<Checkout />} />
                  <Route path="/orders"    element={<OrderHistory />} />
                  <Route path="/wishlist"  element={<Wishlist />} />
                </Route>

                <Route element={<AdminRoute />}>
                  <Route path="/admin"             element={<Dashboard />} />
                  <Route path="/admin/products"    element={<ManageProducts />} />
                  <Route path="/admin/orders"      element={<ManageOrders />} />
                </Route>
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}