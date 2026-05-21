import { useState, useEffect } from 'react'
import API from '../api/axios'

const STEPS = ['pending', 'processing', 'shipped', 'delivered']

const STEP_ICON = {
  pending:    '🕐',
  processing: '⚙️',
  shipped:    '🚚',
  delivered:  '✅',
  cancelled:  '❌',
}

const STATUS_STYLE = {
  pending:    { bg: '#fef9c3', color: '#854d0e', border: '#fde047' },
  processing: { bg: '#eff6ff', color: '#1d4ed8', border: '#93c5fd' },
  shipped:    { bg: '#f5f3ff', color: '#6d28d9', border: '#c4b5fd' },
  delivered:  { bg: '#f0fdf4', color: '#15803d', border: '#86efac' },
  cancelled:  { bg: '#fef2f2', color: '#b91c1c', border: '#fca5a5' },
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    API.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#1a6bcc', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (orders.length === 0) return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>No orders yet</h2>
      <p style={{ color: '#94a3b8' }}>Your orders will appear here</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>My Orders</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {orders.map(order => {
          const s = STATUS_STYLE[order.status] || STATUS_STYLE.pending
          const isOpen = expanded === order.id
          const stepIndex = STEPS.indexOf(order.status)
          const isCancelled = order.status === 'cancelled'

          return (
            <div key={order.id} style={{
              background: '#fff', border: '1.5px solid #e2e8f0',
              borderRadius: 16, overflow: 'hidden',
            }}>
              {/* Header */}
              <div
                onClick={() => setExpanded(isOpen ? null : order.id)}
                style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Order #{order.id}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      background: s.bg, color: s.color, border: `1px solid ${s.border}`
                    }}>{STEP_ICON[order.status]} {order.status.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 17, fontWeight: 800, color: '#1a6bcc' }}>
                    ₹{Number(order.total_amount).toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: 18, color: '#94a3b8' }}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Tracking bar */}
              {!isCancelled && (
                <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', gap: 0 }}>
                  {STEPS.map((step, i) => {
                    const done = stepIndex >= i
                    const active = stepIndex === i
                    return (
                      <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: done ? '#1a6bcc' : '#f1f5f9',
                            border: active ? '3px solid #93c5fd' : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14, transition: 'all 0.2s',
                          }}>
                            {done ? <span style={{ color: '#fff', fontSize: 13 }}>✓</span> : <span style={{ fontSize: 13 }}>{STEP_ICON[step]}</span>}
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 600, color: done ? '#1a6bcc' : '#94a3b8', whiteSpace: 'nowrap' }}>
                            {step.charAt(0).toUpperCase() + step.slice(1)}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div style={{
                            flex: 1, height: 3, borderRadius: 2, margin: '0 4px',
                            marginBottom: 18,
                            background: stepIndex > i ? '#1a6bcc' : '#e2e8f0',
                            transition: 'background 0.3s',
                          }} />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Expanded items */}
              {isOpen && (
                <div style={{ borderTop: '1px solid #f1f5f9', padding: '16px 20px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 10 }}>Items</div>
                  {order.items?.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '6px 0', borderBottom: '1px solid #f8fafc' }}>
                      <span style={{ color: '#334155' }}>{item.product_name} × {item.quantity}</span>
                      <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, marginTop: 12, paddingTop: 8, borderTop: '1.5px solid #e2e8f0' }}>
                    <span>Total</span>
                    <span style={{ color: '#1a6bcc' }}>₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>📍 {order.shipping_address}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}