import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
      toast.success('পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'কোনো সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={28} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-brand-600 mb-2">ইমেইল পাঠানো হয়েছে!</h2>
              <p className="font-body text-gray-400 text-sm mb-6">
                <span className="font-medium text-brand-600">{email}</span> এ পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। ইমেইল চেক করুন।
              </p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft size={16} /> লগইনে ফিরুন
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-brand-600 mb-2">পাসওয়ার্ড ভুলে গেছেন?</h1>
                <p className="font-body text-gray-400 text-sm">ইমেইল দিন, রিসেট লিংক পাঠানো হবে</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">ইমেইল</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="input-field"
                  />
                </div>

                <button type="submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60">
                  {loading
                    ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : <><Mail size={17} /> লিংক পাঠান</>
                  }
                </button>
              </form>

              <div className="text-center mt-6">
                <Link to="/login" className="font-body text-sm text-brand-600 hover:text-gold-500 flex items-center justify-center gap-1 transition-colors">
                  <ArrowLeft size={14} /> লগইনে ফিরুন
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
