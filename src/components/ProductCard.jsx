import { Link } from 'react-router-dom'
import { ShoppingCart, Eye } from 'lucide-react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleAdd = (e) => {
    e.preventDefault()
    addToCart(product)
    toast.success(`${product.name} কার্টে যোগ হয়েছে!`)
  }

  return (
    <Link to={`/products/${product.id}`} className="card group block overflow-hidden">
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="font-body text-sm">No Image</span>
          </div>
        )}
        {!product.is_active && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="badge bg-red-100 text-red-600">Stock নেই</span>
          </div>
        )}
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-brand-600/0 group-hover:bg-brand-600/10 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleAdd}
            disabled={!product.is_active || product.stock === 0}
            className="btn-gold text-sm px-5 py-2 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ShoppingCart size={15} /> কার্টে যোগ
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-sans font-semibold text-brand-600 text-base leading-snug mb-1 line-clamp-1">{product.name}</h3>
        <p className="font-body text-gray-400 text-xs mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-body font-bold text-lg text-brand-600">৳{product.price}</span>
          <span className="badge bg-brand-50 text-brand-600">
            {product.stock > 0 ? `${product.stock} বাকি` : 'শেষ'}
          </span>
        </div>
      </div>
    </Link>
  )
}
