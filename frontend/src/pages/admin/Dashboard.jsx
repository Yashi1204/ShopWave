import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../../api/axios'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    API.get('/admin/stats').then(({ data }) => setStats(data))
  }, [])

  const cards = [
    { label: 'Total Revenue', value: stats ? `₹${Number(stats.revenue).toLocaleString('en-IN')}` : '...', color: 'bg-blue-600' },
    { label: 'Total Orders',  value: stats?.total_orders  ?? '...', color: 'bg-green-600' },
    { label: 'Products',      value: stats?.total_products ?? '...', color: 'bg-purple-600' },
    { label: 'Users',         value: stats?.total_users    ?? '...', color: 'bg-orange-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className={`${c.color} text-white rounded-xl p-5`}>
            <div className="text-2xl font-bold">{c.value}</div>
            <div className="text-sm opacity-80 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <Link to="/admin/products" className="bg-white border hover:shadow-md rounded-xl p-5 flex-1 text-center transition">
          <div className="text-3xl mb-2">📦</div>
          <div className="font-semibold text-gray-700">Manage Products</div>
        </Link>
        <Link to="/admin/orders" className="bg-white border hover:shadow-md rounded-xl p-5 flex-1 text-center transition">
          <div className="text-3xl mb-2">🚚</div>
          <div className="font-semibold text-gray-700">Manage Orders</div>
        </Link>
      </div>
    </div>
  )
}