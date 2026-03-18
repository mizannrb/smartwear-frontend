import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState(null)

  useEffect(() => {
    Promise.all([api.get('/products/'), api.get('/categories/')])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data)
        setCategories(cRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = selectedCat ? p.category_id === selectedCat : true
    return matchSearch && matchCat
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="font-body text-gold-500 font-medium text-sm mb-1">Collection</p>
        <h1 className="section-title">সব পণ্য</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="পণ্য খুঁজুন..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCat(null)}
            className={`px-4 py-2 rounded-lg font-body text-sm font-medium transition-colors ${!selectedCat ? 'bg-brand-600 text-white' : 'bg-white text-brand-600 border border-gray-200 hover:bg-brand-50'}`}
          >
            সব
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-4 py-2 rounded-lg font-body text-sm font-medium transition-colors ${selectedCat === c.id ? 'bg-brand-600 text-white' : 'bg-white text-brand-600 border border-gray-200 hover:bg-brand-50'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="bg-gray-200 aspect-[3/4]" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-body text-gray-400 text-lg">কোনো পণ্য পাওয়া যায়নি</p>
        </div>
      ) : (
        <>
          <p className="font-body text-gray-400 text-sm mb-4">{filtered.length}টি পণ্য পাওয়া গেছে</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  )
}
