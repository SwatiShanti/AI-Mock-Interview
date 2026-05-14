/**
 * pages/LoginPage.jsx — User login with JWT auth
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/helpers'
import toast from 'react-hot-toast'
import { HiSparkles, HiEye, HiEyeSlash } from 'react-icons/hi2'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Card from '../components/common/Card'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form,     setForm]     = useState({ email: '', password: '' })
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Please fill all fields')
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back! 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-glow">
              <HiSparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">InterviewAI</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">Welcome back</h1>
          <p className="text-gray-400 text-sm">Sign in to continue your practice</p>
        </div>

        {/* Card */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="••••••••"
                className="pr-11"
                autoComplete="current-password"
              />
              <button
                type="button" 
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPwd ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
              </button>
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3.5 flex items-center justify-center gap-2"
            >
              {loading ? <><LoadingSpinner size="sm" /><span>Signing in…</span></> : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
