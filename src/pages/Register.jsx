import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'নাম দিন'
    if (!form.email.trim()) errs.email = 'ইমেইল দিন'
    if (form.password.length < 6) errs.password = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register(form)
      toast.success('রেজিস্ট্রেশন সফল! এখন লগইন করুন।')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className={`input-field ${errors[key] ? 'border-red-400 focus:ring-red-400' : ''}`}
      />
      {errors[key] && <p className="font-body text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-brand-600 mb-2">রেজিস্টার করুন</h1>
            <p className="font-body text-gray-400 text-sm">নতুন অ্যাকাউন্ট তৈরি করুন</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {field('name', 'পূর্ণ নাম *', 'text', 'আপনার নাম')}
            {field('email', 'ইমেইল *', 'email', 'example@email.com')}

            <div>
              <label className="label">পাসওয়ার্ড * <span className="text-gray-400 font-normal">(কমপক্ষে ৬ অক্ষর)</span></label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••"
                  className={`input-field pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength indicator */}
              {form.password && (
                <div className="mt-2 flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                      form.password.length >= (i + 1) * 2
                        ? form.password.length < 6 ? 'bg-red-400' : form.password.length < 10 ? 'bg-yellow-400' : 'bg-green-400'
                        : 'bg-gray-200'
                    }`} />
                  ))}
                </div>
              )}
              {errors.password && <p className="font-body text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {field('phone', 'ফোন নম্বর (ঐচ্ছিক)', 'tel', '01XXXXXXXXX')}
            
            <div>
              <label className="label">ঠিকানা (ঐচ্ছিক)</label>
              <textarea
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="আপনার ঠিকানা লিখুন"
                rows={2}
                className="input-field resize-none"
              />
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60 mt-2">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <><UserPlus size={17} /> রেজিস্টার করুন</>
              )}
            </button>
          </form>

          <p className="text-center font-body text-sm text-gray-400 mt-6">
            অ্যাকাউন্ট আছে?{' '}
            <Link to="/login" className="text-brand-600 font-medium hover:text-gold-500 transition-colors">
              লগইন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
