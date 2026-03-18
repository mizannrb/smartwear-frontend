import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে')
      return
    }
    if (form.password !== form.confirm) {
      toast.error('পাসওয়ার্ড মিলছে না')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, new_password: form.password })
      toast.success('পাসওয়ার্ড পরিবর্তন হয়েছে!')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'লিংক মেয়াদ শেষ হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  if (!token) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <p className="font-body text-red-500">অবৈধ রিসেট লিংক</p>
    </div>
  )

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-brand-600" />
            </div>
            <h1 className="text-3xl font-bold text-brand-600 mb-2">নতুন পাসওয়ার্ড</h1>
            <p className="font-body text-gray-400 text-sm">কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">নতুন পাসওয়ার্ড</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={6}
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

            <div>
              <label className="label">পাসওয়ার্ড নিশ্চিত করুন</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="••••••"
                className={`input-field ${form.confirm && form.password !== form.confirm ? 'border-red-400' : ''}`}
              />
              {form.confirm && form.password !== form.confirm && (
                <p className="font-body text-xs text-red-500 mt-1">পাসওয়ার্ড মিলছে না</p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60">
              {loading
                ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <><Lock size={17} /> পাসওয়ার্ড পরিবর্তন করুন</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
