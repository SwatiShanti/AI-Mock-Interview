/**
 * components/common/Navbar.jsx — Top navigation bar
 */
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState } from 'react'
import { HiBars3, HiXMark, HiSparkles } from 'react-icons/hi2'

const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'New Interview', href: '/interview/setup' },
  { label: 'History', href: '/history' },
]

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (href) => location.pathname === href

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
              <HiSparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">InterviewAI</span>
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* User pill */}
                <div className="hidden sm:flex items-center gap-2 glass-card px-3 py-1.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300 font-medium">{user?.name?.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"  className="btn-secondary text-sm px-4 py-2">Login</Link>
                <Link to="/signup" className="btn-primary  text-sm px-4 py-2">Get Started</Link>
              </>
            )}

            {/* Mobile menu toggle */}
            {isAuthenticated && (
              <button onClick={() => setOpen(!open)} className="md:hidden text-gray-400 hover:text-white">
                {open ? <HiXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {open && isAuthenticated && (
          <div className="md:hidden pb-4 border-t border-white/10 pt-4 space-y-1 animate-slide-up">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
