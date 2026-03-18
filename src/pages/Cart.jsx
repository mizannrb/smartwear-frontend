import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) {
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  if (cart.length === 0) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <ShoppingBag size={64} className="text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-brand-600 mb-2">কার্ট খালি</h2>
      <p className="font-body text-gray-400 text-sm mb-6">কোনো পণ্য কার্টে নেই</p>
      <Link to="/products" className="btn-primary">পণ্য দেখুন</Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">আমার কার্ট</h1>
        <button onClick={clearCart} className="font-body text-sm text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors">
          <Trash2 size={14} /> সব মুছুন
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="card p-4 flex gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-body">No img</div>
                }
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-sans font-semibold text-brand-600 text-base leading-snug mb-1 truncate">{item.name}</h3>
                <p className="font-body text-lg font-bold text-gold-500 mb-3">৳{item.price}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors text-brand-600">
                      <Minus size={13} />
                    </button>
                    <span className="px-3 py-1.5 font-body font-semibold text-brand-600 text-sm min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors text-brand-600">
                      <Plus size={13} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-body font-bold text-brand-600">৳{(item.price * item.quantity).toFixed(0)}</span>
                    <button onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h3 className="font-sans font-bold text-brand-600 text-xl mb-5">অর্ডার সারসংক্ষেপ</h3>

            <div className="space-y-3 mb-5 font-body text-sm">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-gray-500">
                  <span className="truncate flex-1 mr-2">{item.name} × {item.quantity}</span>
                  <span className="font-medium text-brand-600 shrink-0">৳{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between font-body font-bold text-brand-600 text-lg">
                <span>মোট</span>
                <span>৳{total.toFixed(0)}</span>
              </div>
            </div>

            <button onClick={handleCheckout}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base">
              {user ? 'অর্ডার করুন' : 'লগইন করুন'} <ArrowRight size={17} />
            </button>

            <Link to="/products" className="block text-center font-body text-sm text-brand-600 hover:text-gold-500 mt-4 transition-colors">
              কেনাকাটা চালিয়ে যান
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
