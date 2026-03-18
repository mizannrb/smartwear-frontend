import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`স্বাগতম, ${user.name}!`)
      navigate(user.is_admin ? '/admin' : '/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'লগইন ব্যর্থ হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-brand-600 mb-2">লগইন করুন</h1>
            <p className="font-body text-gray-400 text-sm">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">ইমেইল</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="example@email.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">পাসওয়ার্ড</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••"
                  className="input-field pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="font-body text-xs text-brand-600 hover:text-gold-500 transition-colors">
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={17} /> লগইন</>
              )}
            </button>
          </form>

          <p className="text-center font-body text-sm text-gray-400 mt-6">
            অ্যাকাউন্ট নেই?{' '}
            <Link to="/register" className="text-brand-600 font-medium hover:text-gold-500 transition-colors">
              রেজিস্টার করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
