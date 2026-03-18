import { useState, useEffect } from 'react'
import { User, Package, Lock, Eye, EyeOff } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'profile', label: 'প্রোফাইল', icon: User },
  { id: 'orders', label: 'অর্ডার', icon: Package },
  { id: 'password', label: 'পাসওয়ার্ড', icon: Lock },
]

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [active, setActive] = useState('profile')
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' })
  const [passForm, setPassForm] = useState({ old_password: '', new_password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (active === 'orders') {
      setLoadingOrders(true)
      api.get('/orders/my')
        .then(res => setOrders(res.data))
        .catch(console.error)
        .finally(() => setLoadingOrders(false))
    }
  }, [active])

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put('/users/me', profileForm)
      updateUser(res.data)
      toast.success('প্রোফাইল আপডেট হয়েছে!')
    } catch {
      toast.error('আপডেট ব্যর্থ হয়েছে')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passForm.new_password.length < 6) { toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'); return }
    if (passForm.new_password !== passForm.confirm) { toast.error('পাসওয়ার্ড মিলছে না'); return }
    setSaving(true)
    try {
      await api.put('/users/me/password', { old_password: passForm.old_password, new_password: passForm.new_password })
      toast.success('পাসওয়ার্ড পরিবর্তন হয়েছে!')
      setPassForm({ old_password: '', new_password: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'ব্যর্থ হয়েছে')
    } finally {
      setSaving(false)
    }
  }

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-600',
    processing: 'bg-blue-50 text-blue-600',
    shipped: 'bg-purple-50 text-purple-600',
    delivered: 'bg-green-50 text-green-600',
    cancelled: 'bg-red-50 text-red-500',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-sans">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-600">{user?.name}</h1>
          <p className="font-body text-gray-400 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id)}
            className={`flex items-center gap-2 px-4 py-3 font-body text-sm font-medium border-b-2 -mb-px transition-colors ${
              active === id ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400 hover:text-brand-600'
            }`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {active === 'profile' && (
        <form onSubmit={handleProfileSave} className="card p-6 max-w-lg space-y-5">
          <div>
            <label className="label">নাম</label>
            <input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
              className="input-field" required />
          </div>
          <div>
            <label className="label">ফোন</label>
            <input value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="input-field" placeholder="01XXXXXXXXX" />
          </div>
          <div>
            <label className="label">ঠিকানা</label>
            <textarea value={profileForm.address} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
              className="input-field resize-none" rows={3} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
          </button>
        </form>
      )}

      {/* Orders Tab */}
      {active === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="text-center py-12 font-body text-gray-400">লোড হচ্ছে...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="font-body text-gray-400">কোনো অর্ডার নেই</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-body font-bold text-brand-600">অর্ডার #{order.id}</p>
                    <p className="font-body text-xs text-gray-400 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                  <span className={`badge ${statusColors[order.status] || 'bg-gray-100 text-gray-500'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items?.map(item => (
                    <p key={item.id} className="font-body text-sm text-gray-500">
                      পণ্য #{item.product_id} × {item.quantity} — ৳{item.price}
                    </p>
                  ))}
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3">
                  <p className="font-body text-sm text-gray-400 truncate max-w-xs">{order.address}</p>
                  <p className="font-body font-bold text-brand-600">৳{order.total_price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Password Tab */}
      {active === 'password' && (
        <form onSubmit={handlePasswordChange} className="card p-6 max-w-lg space-y-5">
          <div>
            <label className="label">বর্তমান পাসওয়ার্ড</label>
            <input type={showPass ? 'text' : 'password'} value={passForm.old_password}
              onChange={e => setPassForm({ ...passForm, old_password: e.target.value })}
              className="input-field" required />
          </div>
          <div>
            <label className="label">নতুন পাসওয়ার্ড <span className="text-gray-400 font-normal text-xs">(কমপক্ষে ৬ অক্ষর)</span></label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={passForm.new_password}
                onChange={e => setPassForm({ ...passForm, new_password: e.target.value })}
                className="input-field pr-10" required minLength={6} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="label">পাসওয়ার্ড নিশ্চিত করুন</label>
            <input type={showPass ? 'text' : 'password'} value={passForm.confirm}
              onChange={e => setPassForm({ ...passForm, confirm: e.target.value })}
              className={`input-field ${passForm.confirm && passForm.new_password !== passForm.confirm ? 'border-red-400' : ''}`}
              required />
            {passForm.confirm && passForm.new_password !== passForm.confirm && (
              <p className="font-body text-xs text-red-500 mt-1">পাসওয়ার্ড মিলছে না</p>
            )}
          </div>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
          </button>
        </form>
      )}
    </div>
  )
}
