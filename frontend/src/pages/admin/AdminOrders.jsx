import { useState, useEffect } from 'react'
import API from '../../api/axios'

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_STYLE = {
  pending:    { bg: '#fef9c3', color: '#854d0e', border: '#fde047' },
  processing: { bg: '#eff6ff', color: '#1d4ed8', border: '#93c5fd' },
  shipped:    { bg: '#f5f3ff', color: '#6d28d9', border: '#c4b5fd' },
  delivered:  { bg: '#f0fdf4', color: '#15803d', border: '#86efac' },
  cancelled:  { bg: '#fef2f2', color: '#b91c1c', border: '#fca5a5' },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/admin/all')
      setOrders(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await API.patch(`/orders/admin/${orderId}/status`, { status })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    } catch (err) {
      alert('Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#1a6bcc', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>Orders</h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{orders.length} total orders</p>
        </div>
        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', ...STATUS_OPTIONS].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', border: 'none',
                background: filter === s ? '#1a6bcc' : '#f1f5f9',
                color: filter === s ? '#fff' : '#64748b',
              }}
            >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: 16, border: '1.5px solid #e2e8f0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ color: '#94a3b8', fontWeight: 600 }}>No {filter} orders</p>
          </div>
        ) : filtered.map(order => {
          const s = STATUS_STYLE[order.status] || STATUS_STYLE.pending
          return (
            <div key={order.id} style={{
              background: '#fff', border: '1.5px solid #e2e8f0',
              borderRadius: 16, padding: 20,
            }}>
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Order #{order.id}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      background: s.bg, color: s.color, border: `1px solid ${s.border}`
                    }}>{order.status.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>
                    {order.user_name} · {order.user_email}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                    {new Date(order.created_at).toLocaleString('en-IN')} · 📍 {order.shipping_address}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#1a6bcc' }}>
                    ₹{Number(order.total_amount).toLocaleString('en-IN')}
                  </div>
                  {order.payment_status && (
                    <div style={{ fontSize: 11, color: order.payment_status === 'paid' ? '#16a34a' : '#d97706', fontWeight: 600, marginTop: 2 }}>
                      {order.payment_status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
                {order.items?.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
                    <span style={{ color: '#334155' }}>{item.product_name} × {item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Status updater */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Update status:</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(order.id, s)}
                      disabled={order.status === s || updating === order.id}
                      style={{
                        padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        cursor: order.status === s ? 'default' : 'pointer',
                        border: '1.5px solid',
                        borderColor: order.status === s ? STATUS_STYLE[s]?.border || '#e2e8f0' : '#e2e8f0',
                        background: order.status === s ? (STATUS_STYLE[s]?.bg || '#f1f5f9') : '#fff',
                        color: order.status === s ? (STATUS_STYLE[s]?.color || '#64748b') : '#64748b',
                        opacity: updating === order.id && order.status !== s ? 0.5 : 1,
                      }}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}