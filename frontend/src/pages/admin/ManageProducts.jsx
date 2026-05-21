import { useState, useEffect } from 'react'
import API from '../../api/axios'

const EMPTY = { name: '', description: '', price: '', stock: '', category: '', image_url: '' }

export default function ManageProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm]         = useState(EMPTY)
  const [editing, setEditing]   = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => API.get('/products').then(({ data }) => setProducts(data.products))
  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (editing) await API.put(`/admin/products/${editing}`, form)
    else await API.post('/admin/products', form)
    setForm(EMPTY); setEditing(null); setShowForm(false); load()
  }

  const del = async (id) => {
    if (confirm('Delete this product?')) { await API.delete(`/admin/products/${id}`); load() }
  }

  const edit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, category: p.category, image_url: p.image_url || '' })
    setEditing(p.id); setShowForm(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY) }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white border rounded-xl p-6 mb-6 grid grid-cols-2 gap-4">
          {[['name','Name'],['category','Category'],['price','Price'],['stock','Stock'],['image_url','Image URL']].map(([field, label]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input required={field !== 'image_url'} value={form[field]}
                onChange={e => setForm({...form, [field]: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required rows={3} value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="col-span-2 flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium">{editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{['Product','Category','Price','Stock','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-gray-600 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.category}</td>
                <td className="px-4 py-3 font-semibold">₹{Number(p.price).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${p.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{p.stock}</span></td>
                <td className="px-4 py-3">
                  <button onClick={() => edit(p)} className="text-blue-600 hover:underline text-xs mr-3">Edit</button>
                  <button onClick={() => del(p.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}