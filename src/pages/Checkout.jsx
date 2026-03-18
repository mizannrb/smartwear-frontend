import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, MapPin } from 'lucide-react'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { cart, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [address, setAddress] = useState(user?.address || '')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const handleOrder = async (e) => {
    e.preventDefault()
    if (!address.trim()) { toast.error('ঠিকানা দিন'); return }
    if (cart.length === 0) { toast.error('কার্ট খালি'); return }

    setLoading(true)
    try {
      const res = await api.post('/orders/', {
        address,
        items: cart.map(i => ({ product_id: i.id, quantity: i.quantity }))
      })
      setOrderId(res.data.id)
      clearCart()
      setDone(true)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'অর্ডার ব্যর্থ হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <CheckCircle size={72} className="text-green-500 mb-4" />
      <h2 className="text-3xl font-bold text-brand-600 mb-2">অর্ডার সফল!</h2>
      <p className="font-body text-gray-400 text-sm mb-1">অর্ডার নম্বর: <span className="font-bold text-brand-600">#{orderId}</span></p>
      <p className="font-body text-gray-400 text-sm mb-8">আপনার অর্ডার গ্রহণ করা হয়েছে। শীঘ্রই ডেলিভারি দেওয়া হবে।</p>
      <div className="flex gap-4">
        <button onClick={() => navigate('/products')} className="btn-primary">কেনাকাটা করুন</button>
        <button onClick={() => navigate('/profile')} className="btn-secondary">আমার অর্ডার</button>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="section-title mb-8">চেকআউট</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Address Form */}
        <form onSubmit={handleOrder} className="card p-6 h-fit">
          <h3 className="font-sans font-bold text-brand-600 text-xl mb-5 flex items-center gap-2">
            <MapPin size={20} /> ডেলিভারি ঠিকানা
          </h3>

          <div className="mb-6">
            <label className="label">সম্পূর্ণ ঠিকানা *</label>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="বাড়ি নং, রাস্তা, এলাকা, জেলা..."
              rows={4}
              required
              className="input-field resize-none"
            />
          </div>

          <div className="bg-brand-50 rounded-xl p-4 mb-6 font-body text-sm">
            <p className="text-brand-600 font-medium">{user?.name}</p>
            <p className="text-gray-400">{user?.email}</p>
            {user?.phone && <p className="text-gray-400">{user?.phone}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60">
            {loading
              ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : '✓ অর্ডার নিশ্চিত করুন'
            }
          </button>
        </form>

        {/* Order Summary */}
        <div className="card p-6 h-fit">
          <h3 className="font-sans font-bold text-brand-600 text-xl mb-5">অর্ডার তালিকা</h3>

          <div className="space-y-4 mb-5">
            {cart.map(item => (
              <div key={item.id} className="flex gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gray-200" />
                  }
                </div>
                <div className="flex-1">
                  <p className="font-body font-medium text-brand-600 text-sm">{item.name}</p>
                  <p className="font-body text-gray-400 text-xs">× {item.quantity}</p>
                </div>
                <p className="font-body font-bold text-brand-600 text-sm">৳{(item.price * item.quantity).toFixed(0)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between font-body font-bold text-brand-600 text-xl">
              <span>মোট</span>
              <span>৳{total.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
