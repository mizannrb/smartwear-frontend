import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-brand-600 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-gold-400 text-xl font-sans font-bold mb-3">SmartWear</h3>
            <p className="font-body text-sm text-gray-400 leading-relaxed">
              আপনার পছন্দের পোশাকের সেরা গন্তব্য। মানসম্পন্ন পোশাক, সেরা দামে।
            </p>
          </div>
          <div>
            <h4 className="text-white font-body font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 font-body text-sm">
              <li><Link to="/" className="hover:text-gold-400 transition-colors">হোম</Link></li>
              <li><Link to="/products" className="hover:text-gold-400 transition-colors">সব পণ্য</Link></li>
              <li><Link to="/cart" className="hover:text-gold-400 transition-colors">কার্ট</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-body font-semibold mb-3">Account</h4>
            <ul className="space-y-2 font-body text-sm">
              <li><Link to="/login" className="hover:text-gold-400 transition-colors">লগইন</Link></li>
              <li><Link to="/register" className="hover:text-gold-400 transition-colors">রেজিস্টার</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-brand-700 mt-8 pt-6 text-center font-body text-xs text-gray-500">
          © 2026 SmartWear. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
