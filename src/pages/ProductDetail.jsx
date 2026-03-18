import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAdd = () => {
    addToCart(product, qty)
    toast.success(`${product.name} কার্টে যোগ হয়েছে!`)
  }

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-gray-200 rounded-2xl aspect-[3/4]" />
        <div className="space-y-4 pt-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  )

  if (!product) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-brand-600 font-body text-sm mb-8 hover:text-gold-500 transition-colors">
        <ArrowLeft size={16} /> ফিরে যান
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4]">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-body">No Image</div>
          )}
        </div>

        {/* Details */}
        <div className="py-4">
          <p className="font-body text-gold-500 text-sm font-medium mb-2">SmartWear Collection</p>
          <h1 className="text-3xl font-bold text-brand-600 mb-4">{product.name}</h1>
          <p className="text-4xl font-bold text-brand-600 mb-6 font-body">৳{product.price}</p>

          {product.description && (
            <p className="font-body text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>
          )}

          <div className="flex items-center gap-3 mb-2">
            <span className="font-body text-sm text-gray-500">স্টক:</span>
            <span className={`badge ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              {product.stock > 0 ? `${product.stock}টি আছে` : 'স্টক শেষ'}
            </span>
          </div>

          {product.stock > 0 && (
            <>
              {/* Quantity */}
              <div className="flex items-center gap-3 my-6">
                <span className="font-body text-sm text-gray-600 font-medium">পরিমাণ:</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="px-4 py-2 font-body font-semibold text-brand-600 min-w-[3rem] text-center">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-gray-100 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button onClick={handleAdd} className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4">
                <ShoppingCart size={18} /> কার্টে যোগ করুন
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
