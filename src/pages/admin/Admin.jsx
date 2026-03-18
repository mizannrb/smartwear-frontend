import { useState, useEffect } from 'react'
import { Users, Package, ShoppingBag, Tag, Plus, Pencil, Trash2, Ban, CheckCircle, X } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'overview', label: 'Overview', icon: ShoppingBag },
  { id: 'products', label: 'পণ্য', icon: Package },
  { id: 'categories', label: 'ক্যাটাগরি', icon: Tag },
  { id: 'users', label: 'ব্যবহারকারী', icon: Users },
  { id: 'orders', label: 'অর্ডার', icon: ShoppingBag },
]

export default function Admin() {
  const [active, setActive] = useState('overview')
  const [data, setData] = useState({ products: [], categories: [], users: [], orders: [] })
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // { type: 'product'|'category'|'user', data: null|{...} }
  const [form, setForm] = useState({})

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [p, c, u, o] = await Promise.all([
        api.get('/products/'),
        api.get('/categories/'),
        api.get('/users/'),
        api.get('/orders/'),
      ])
      setData({ products: p.data, categories: c.data, users: u.data, orders: o.data })
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const openModal = (type, item = null) => {
    setModal({ type, item })
    if (type === 'product') setForm(item || { name: '', description: '', price: '', stock: '', image_url: '', category_id: '' })
    if (type === 'category') setForm(item || { name: '', slug: '' })
    if (type === 'user') setForm(item || { name: '', email: '', password: '', phone: '' })
  }
  const closeModal = () => { setModal(null); setForm({}) }

  // ===== PRODUCTS =====
  const saveProduct = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock), category_id: parseInt(form.category_id) }
      if (modal.item) await api.put(`/products/${modal.item.id}`, payload)
      else await api.post('/products/', payload)
      toast.success(modal.item ? 'পণ্য আপডেট হয়েছে!' : 'পণ্য যোগ হয়েছে!')
      closeModal(); fetchAll()
    } catch (err) { toast.error(err.response?.data?.detail || 'Error') }
  }

  const deleteProduct = async (id) => {
    if (!confirm('এই পণ্য মুছে ফেলবেন?')) return
    try { await api.delete(`/products/${id}`); toast.success('মুছে ফেলা হয়েছে'); fetchAll() }
    catch { toast.error('মুছতে পারেনি') }
  }

  // ===== CATEGORIES =====
  const saveCategory = async (e) => {
    e.preventDefault()
    try {
      if (modal.item) await api.put(`/categories/${modal.item.id}`, form)
      else await api.post('/categories/', form)
      toast.success(modal.item ? 'আপডেট হয়েছে!' : 'যোগ হয়েছে!')
      closeModal(); fetchAll()
    } catch (err) { toast.error(err.response?.data?.detail || 'Error') }
  }

  const deleteCategory = async (id) => {
    if (!confirm('এই ক্যাটাগরি মুছে ফেলবেন?')) return
    try { await api.delete(`/categories/${id}`); toast.success('মুছে ফেলা হয়েছে'); fetchAll() }
    catch { toast.error('মুছতে পারেনি — পণ্য আছে') }
  }

  // ===== USERS =====
  const toggleSuspend = async (user) => {
    try {
      await api.put(`/users/${user.id}`, { ...user, is_active: !user.is_active })
      toast.success(user.is_active ? 'ব্যবহারকারী সাসপেন্ড হয়েছে' : 'ব্যবহারকারী সক্রিয় হয়েছে')
      fetchAll()
    } catch { toast.error('ব্যর্থ হয়েছে') }
  }

  const deleteUser = async (id) => {
    if (!confirm('এই ব্যবহারকারী মুছে ফেলবেন?')) return
    try { await api.delete(`/users/${id}`); toast.success('মুছে ফেলা হয়েছে'); fetchAll() }
    catch { toast.error('মুছতে পারেনি') }
  }

  const addUser = async (e) => {
    e.preventDefault()
    if (form.password?.length < 6) { toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর'); return }
    try {
      await api.post('/auth/register', form)
      toast.success('ব্যবহারকারী যোগ হয়েছে!')
      closeModal(); fetchAll()
    } catch (err) { toast.error(err.response?.data?.detail || 'Error') }
  }

  // ===== ORDER STATUS =====
  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}`, { status })
      toast.success('স্ট্যাটাস আপডেট হয়েছে')
      fetchAll()
    } catch { toast.error('ব্যর্থ হয়েছে') }
  }

  const statCards = [
    { label: 'মোট পণ্য', value: data.products.length, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'মোট অর্ডার', value: data.orders.length, icon: ShoppingBag, color: 'bg-green-50 text-green-600' },
    { label: 'মোট ব্যবহারকারী', value: data.users.length, icon: Users, color: 'bg-purple-50 text-purple-600' },
    { label: 'ক্যাটাগরি', value: data.categories.length, icon: Tag, color: 'bg-gold-500/10 text-gold-600' },
  ]

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="font-body text-gray-400 text-sm">SmartWear পরিচালনা কেন্দ্র</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-body text-sm font-medium transition-all ${active === id ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-brand-600'
              }`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 font-body text-gray-400">লোড হচ্ছে...</div>
      ) : (
        <>
          {/* Overview */}
          {active === 'overview' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {statCards.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card p-5">
                  <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-3`}>
                    <Icon size={20} />
                  </div>
                  <p className="font-body text-3xl font-bold text-brand-600">{value}</p>
                  <p className="font-body text-sm text-gray-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Products */}
          {active === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-5">
                <p className="font-body text-gray-400 text-sm">{data.products.length}টি পণ্য</p>
                <button onClick={() => openModal('product')} className="btn-primary flex items-center gap-2 py-2">
                  <Plus size={16} /> নতুন পণ্য
                </button>
              </div>
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['পণ্য', 'মূল্য', 'স্টক', 'ক্যাটাগরি', 'অ্যাকশন'].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-body text-xs font-semibold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {p.image_url && <img src={p.image_url} alt="" className="w-10 h-10 object-cover rounded-lg" />}
                            <span className="font-body text-sm font-medium text-brand-600">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-gray-600">৳{p.price}</td>
                        <td className="px-4 py-3">
                          <span className={`badge ${p.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{p.stock}</span>
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-gray-500">{p.category_id}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openModal('product', p)} className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"><Pencil size={14} /></button>
                            <button onClick={() => deleteProduct(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Categories */}
          {active === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-5">
                <p className="font-body text-gray-400 text-sm">{data.categories.length}টি ক্যাটাগরি</p>
                <button onClick={() => openModal('category')} className="btn-primary flex items-center gap-2 py-2">
                  <Plus size={16} /> নতুন ক্যাটাগরি
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data.categories.map(c => (
                  <div key={c.id} className="card p-4 flex items-center justify-between">
                    <div>
                      <p className="font-body font-semibold text-brand-600">{c.name}</p>
                      <p className="font-body text-xs text-gray-400">{c.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openModal('category', c)} className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg"><Pencil size={14} /></button>
                      <button onClick={() => deleteCategory(c.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users */}
          {active === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-5">
                <p className="font-body text-gray-400 text-sm">{data.users.length} জন ব্যবহারকারী</p>
                <button onClick={() => openModal('user')} className="btn-primary flex items-center gap-2 py-2">
                  <Plus size={16} /> নতুন ব্যবহারকারী
                </button>
              </div>
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['ব্যবহারকারী', 'ইমেইল', 'ভূমিকা', 'স্ট্যাটাস', 'অ্যাকশন'].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-body text-xs font-semibold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-body text-sm font-medium text-brand-600">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-gray-500">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`badge ${u.is_admin ? 'bg-gold-500/10 text-gold-600' : 'bg-gray-100 text-gray-500'}`}>
                            {u.is_admin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${u.is_active !== false ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                            {u.is_active !== false ? 'সক্রিয়' : 'সাসপেন্ড'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => toggleSuspend(u)}
                              className={`p-1.5 rounded-lg transition-colors ${u.is_active !== false ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}
                              title={u.is_active !== false ? 'সাসপেন্ড' : 'সক্রিয় করুন'}>
                              {u.is_active !== false ? <Ban size={14} /> : <CheckCircle size={14} />}
                            </button>
                            <button onClick={() => deleteUser(u.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders */}
          {active === 'orders' && (
            <div className="space-y-4">
              {data.orders.map(order => (
                <div key={order.id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-body font-bold text-brand-600">অর্ডার #{order.id}</p>
                      <p className="font-body text-xs text-gray-400">ব্যবহারকারী #{order.user_id} · {new Date(order.created_at).toLocaleDateString('bn-BD')}</p>
                    </div>
                    <select
                      value={order.status}
                      onChange={e => updateOrderStatus(order.id, e.target.value)}
                      className="input-field w-auto py-1.5 text-xs"
                    >
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <p className="font-body text-sm text-gray-400 mb-2">{order.address}</p>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <p className="font-body text-sm text-gray-400">{order.items?.length} টি পণ্য</p>
                    <p className="font-body font-bold text-brand-600">৳{order.total_price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-sans font-bold text-brand-600 text-xl">
                {modal.item ? 'সম্পাদনা' : 'নতুন যোগ করুন'}
              </h3>
              <button onClick={closeModal} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>

            {/* Product Form */}
            {modal.type === 'product' && (
              <form onSubmit={saveProduct} className="space-y-4">
                {[['name', 'পণ্যের নাম *', 'text'], ['price', 'মূল্য *', 'number'], ['stock', 'স্টক *', 'number'], ['image_url', 'Image URL', 'url']].map(([key, label, type]) => (
                  <div key={key}>
                    <label className="label">{label}</label>
                    <input type={type} value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="input-field" required={label.includes('*')} />
                  </div>
                ))}
                <div>
                  <label className="label">বিবরণ</label>
                  <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="input-field resize-none" rows={2} />
                </div>
                <div>
                  <label className="label">ক্যাটাগরি *</label>
                  <select value={form.category_id || ''} onChange={e => setForm({ ...form, category_id: e.target.value })}
                    className="input-field" required>
                    <option value="">বেছে নিন</option>
                    {data.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary flex-1">সংরক্ষণ</button>
                  <button type="button" onClick={closeModal} className="btn-secondary flex-1">বাতিল</button>
                </div>
              </form>
            )}

            {/* Category Form */}
            {modal.type === 'category' && (
              <form onSubmit={saveCategory} className="space-y-4">
                <div>
                  <label className="label">নাম *</label>
                  <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="label">Slug * <span className="text-gray-400 font-normal text-xs">(ইংরেজিতে, ছোট হাতে)</span></label>
                  <input value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="input-field" placeholder="shirt" required />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary flex-1">সংরক্ষণ</button>
                  <button type="button" onClick={closeModal} className="btn-secondary flex-1">বাতিল</button>
                </div>
              </form>
            )}

            {/* User Form */}
            {modal.type === 'user' && (
              <form onSubmit={addUser} className="space-y-4">
                {[['name', 'নাম *', 'text'], ['email', 'ইমেইল *', 'email'], ['password', 'পাসওয়ার্ড * (কমপক্ষে ৬ অক্ষর)', 'password'], ['phone', 'ফোন', 'tel']].map(([key, label, type]) => (
                  <div key={key}>
                    <label className="label">{label}</label>
                    <input type={type} value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="input-field" required={label.includes('*')} />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary flex-1">যোগ করুন</button>
                  <button type="button" onClick={closeModal} className="btn-secondary flex-1">বাতিল</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
