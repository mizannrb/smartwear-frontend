import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Menu, X, Shield, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-brand-600 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-gold-400 text-2xl font-sans font-bold tracking-tight">SmartWear</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-body text-sm font-medium">
            <Link to="/" className={`hover:text-gold-400 transition-colors ${isActive('/') ? 'text-gold-400' : 'text-gray-200'}`}>হোম</Link>
            <Link to="/products" className={`hover:text-gold-400 transition-colors ${isActive('/products') ? 'text-gold-400' : 'text-gray-200'}`}>পণ্য</Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-brand-700 rounded-lg transition-colors">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-body font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 hover:bg-brand-700 px-3 py-2 rounded-lg transition-colors font-body text-sm"
                >
                  <div className="w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-200">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card-hover py-2 z-50">
                    <Link to="/profile" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-brand-600 hover:bg-brand-50 font-body text-sm transition-colors">
                      <User size={15} /> প্রোফাইল
                    </Link>
                    {user.is_admin && (
                      <Link to="/admin" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-brand-600 hover:bg-brand-50 font-body text-sm transition-colors">
                        <Shield size={15} /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 w-full font-body text-sm transition-colors">
                      <LogOut size={15} /> লগআউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="font-body text-sm text-gray-200 hover:text-white transition-colors">লগইন</Link>
                <Link to="/register" className="btn-gold text-sm px-4 py-2 rounded-lg">রেজিস্টার</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-brand-700 px-4 py-4 space-y-3 font-body text-sm">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-200 hover:text-gold-400">হোম</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-200 hover:text-gold-400">পণ্য</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-200 hover:text-gold-400">কার্ট ({itemCount})</Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-200 hover:text-gold-400">প্রোফাইল</Link>
              {user.is_admin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-200 hover:text-gold-400">Admin Panel</Link>}
              <button onClick={handleLogout} className="block py-2 text-red-400 hover:text-red-300">লগআউট</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-200">লগইন</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-gold-400">রেজিস্টার</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
