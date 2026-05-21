import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { itemCount, setCartOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const hideProducts = ['/login', '/register', '/forgot-password'].includes(location.pathname)

  const scrollToProducts = () => {
    setMenuOpen(false)
    setTimeout(() => {
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #f0f4f8', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1a6bcc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>S</span>
          </div>
          <span style={{ fontSize: 17, fontWeight: 600 }}>
            <span style={{ color: '#1a6bcc' }}>Shop</span><span style={{ color: '#059669' }}>Wave</span>
          </span>
        </Link>

        {/* Desktop center links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
          {!hideProducts && (
            <Link to="/" onClick={scrollToProducts} style={{ fontSize: 14, color: '#64748b', fontWeight: 500, padding: '8px 14px', borderRadius: 8, textDecoration: 'none' }}
              onMouseEnter={e => { e.target.style.background = '#f8fafc'; e.target.style.color = '#1a6bcc' }}
              onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = '#64748b' }}>Products</Link>
          )}
          {user && <Link to="/orders" style={{ fontSize: 14, color: '#64748b', fontWeight: 500, padding: '8px 14px', borderRadius: 8, textDecoration: 'none' }}
            onMouseEnter={e => { e.target.style.background = '#f8fafc'; e.target.style.color = '#1a6bcc' }}
            onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = '#64748b' }}>Orders</Link>}
          {user && <Link to="/wishlist" style={{ fontSize: 14, color: '#64748b', fontWeight: 500, padding: '8px 14px', borderRadius: 8, textDecoration: 'none' }}
            onMouseEnter={e => { e.target.style.background = '#f8fafc'; e.target.style.color = '#1a6bcc' }}
            onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = '#64748b' }}>Wishlist</Link>}
          {isAdmin && <Link to="/admin" style={{ fontSize: 14, color: '#64748b', fontWeight: 500, padding: '8px 14px', borderRadius: 8, textDecoration: 'none' }}
            onMouseEnter={e => { e.target.style.background = '#f8fafc'; e.target.style.color = '#1a6bcc' }}
            onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = '#64748b' }}>Admin</Link>}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user && (
            <button onClick={() => setCartOpen(true)} style={{ position: 'relative', width: 36, height: 36, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 6M17 13l1.4 6M9 19a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
              {itemCount > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -6, background: '#1a6bcc', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>{itemCount}</span>
              )}
            </button>
          )}

          {/* Desktop user */}
          <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 12px', maxWidth: 140 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1a6bcc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, color: '#334155', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                </div>
                <button onClick={logout} style={{ fontSize: 13, color: '#64748b', fontWeight: 500, padding: '7px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ fontSize: 13, color: '#64748b', fontWeight: 500, padding: '7px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', textDecoration: 'none' }}>Login</Link>
                <Link to="/register" style={{ fontSize: 13, color: '#fff', fontWeight: 600, padding: '7px 16px', borderRadius: 8, background: '#1a6bcc', textDecoration: 'none' }}>Register</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{ width: 36, height: 36, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'none', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18 }}
          >{menuOpen ? '✕' : '☰'}</button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #f0f4f8', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }} className="show-mobile">
          {!hideProducts && (
            <Link to="/" onClick={scrollToProducts} style={{ fontSize: 14, color: '#334155', fontWeight: 500, padding: '10px 12px', borderRadius: 8, textDecoration: 'none' }}>🏠 Products</Link>
          )}
          {user && <Link to="/orders" onClick={() => setMenuOpen(false)} style={{ fontSize: 14, color: '#334155', fontWeight: 500, padding: '10px 12px', borderRadius: 8, textDecoration: 'none' }}>📦 Orders</Link>}
          {user && <Link to="/wishlist" onClick={() => setMenuOpen(false)} style={{ fontSize: 14, color: '#334155', fontWeight: 500, padding: '10px 12px', borderRadius: 8, textDecoration: 'none' }}>❤️ Wishlist</Link>}
          {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ fontSize: 14, color: '#334155', fontWeight: 500, padding: '10px 12px', borderRadius: 8, textDecoration: 'none' }}>⚙️ Admin</Link>}
          <div style={{ borderTop: '1px solid #f0f4f8', marginTop: 8, paddingTop: 8 }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#334155', fontWeight: 500 }}>👤 {user.name}</span>
                <button onClick={() => { logout(); setMenuOpen(false) }} style={{ fontSize: 13, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Logout</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', fontSize: 14, color: '#64748b', fontWeight: 500, padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', textDecoration: 'none' }}>Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', fontSize: 14, color: '#fff', fontWeight: 600, padding: '10px', borderRadius: 8, background: '#1a6bcc', textDecoration: 'none' }}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}