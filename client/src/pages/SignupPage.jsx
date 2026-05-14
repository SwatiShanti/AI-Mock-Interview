/**
 * pages/SignupPage.jsx — User registration
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/helpers'
import toast from 'react-hot-toast'
import { HiSparkles, HiEye, HiEyeSlash, HiCheckCircle } from 'react-icons/hi2'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Card from '../components/common/Card'

const PERKS = ['Free forever', 'AI-powered feedback', 'Unlimited practice']

export default function SignupPage() {
  const { signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form,    setForm]    = useState({ name: '', email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) { navigate('/dashboard', { replace: true }); return null }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await signup(form.name, form.email, form.password)
      toast.success('Account created! Let\'s get started 🚀')
      navigate('/dashboard')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const pwdStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
  const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500']
  const strengthLabels = ['', 'Weak', 'Good', 'Strong']

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-glow">
              <HiSparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">InterviewAI</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">Create your account</h1>
          <p className="text-gray-400 text-sm">Start practicing interviews for free</p>
        </div>

        {/* Perks */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {PERKS.map((p) => (
            <span key={p} className="flex items-center gap-1.5 text-xs text-gray-400">
              <HiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />{p}
            </span>
          ))}
        </div>

        {/* Card */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              autoComplete="name"
            />
            
            <Input
              label="Email Address"
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPwd ? 'text' : 'password'}
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="pr-11"
                autoComplete="new-password"
              />
              <button
                type="button" 
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPwd ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
              </button>
              
              {/* Strength meter */}
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= pwdStrength ? strengthColors[pwdStrength] : 'bg-gray-700'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{strengthLabels[pwdStrength]}</span>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3.5 flex items-center justify-center gap-2"
            >
              {loading ? <><LoadingSpinner size="sm" /><span>Creating account…</span></> : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
