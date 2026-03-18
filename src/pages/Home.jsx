import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Shield, Truck, RefreshCw } from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products/?limit=8')
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-600 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-96 h-96 rounded-full border-2 border-white" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border border-white" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-xl">
            <span className="badge bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-4">
              নতুন কালেকশন ২০২৬
            </span>
            <h1 className="text-5xl font-bold leading-tight mb-6 text-white">
              আপনার স্টাইল,<br />
              <span className="text-gold-400">আমাদের পোশাক</span>
            </h1>
            <p className="font-body text-gray-300 text-lg mb-8 leading-relaxed">
              সেরা মানের পোশাক, সর্বোত্তম দামে। SmartWear-এ স্বাগতম।
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/products" className="btn-gold flex items-center gap-2">
                এখনই কিনুন <ArrowRight size={18} />
              </Link>
              <Link to="/products" className="btn-secondary border-white text-white hover:bg-white/10 flex items-center gap-2">
                কালেকশন দেখুন
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Truck, title: 'দ্রুত ডেলিভারি', desc: '২৪-৭২ ঘণ্টার মধ্যে' },
            { icon: Shield, title: 'নিরাপদ পেমেন্ট', desc: '১০০% সুরক্ষিত' },
            { icon: RefreshCw, title: 'সহজ রিটার্ন', desc: '৭ দিনের মধ্যে রিটার্ন' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4 p-4 rounded-xl hover:bg-brand-50 transition-colors">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 shrink-0">
                <Icon size={22} />
              </div>
              <div>
                <p className="font-body font-semibold text-brand-600 text-sm">{title}</p>
                <p className="font-body text-gray-400 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-body text-gold-500 font-medium text-sm mb-1">Featured</p>
            <h2 className="section-title">জনপ্রিয় পণ্যসমূহ</h2>
          </div>
          <Link to="/products" className="font-body text-brand-600 text-sm font-medium hover:text-gold-500 flex items-center gap-1 transition-colors">
            সব দেখুন <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="bg-gray-200 aspect-[3/4]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-body">কোনো পণ্য পাওয়া যায়নি</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}
