import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../auth/AuthContext'
import { useToasts } from '../components/ToastProvider'
import Spinner from '../components/Spinner'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function Signup() {
  const { signup, login } = useContext(AuthContext)
  const { pushToast } = useToasts()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      pushToast('error', 'Passwords do not match')
      return
    }
    if (password.length < 6) {
      pushToast('error', 'Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await signup({ name, email, password })
      pushToast('success', 'Account created! Please log in.')
      navigate('/login')
    } catch (err) {
      pushToast('error', err?.response?.data?.message || 'Signup failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundImage: 'url(/hero-bg.jpg)',
      backgroundSize: 'cover', backgroundPosition: 'center',
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(15,10,40,0.90) 0%, rgba(60,10,100,0.82) 50%, rgba(15,10,40,0.88) 100%)',
        backdropFilter: 'blur(2px)',
      }} />

      {/* Glass card */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 460,
        margin: '24px',
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 24,
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        padding: '40px 36px',
        animation: 'fadeInUp 0.5s ease',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 16,
              boxShadow: '0 6px 20px rgba(124,58,237,0.5)',
            }}>
              LF
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, color: '#fff' }}>
              LearnFlow
            </span>
          </Link>
          <div style={{ marginTop: 16 }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700,
              color: '#fff', marginBottom: 6,
            }}>
              Start Learning Today
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>
              Create your free account — no credit card needed
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center',
              }}>
                <User size={16} />
              </span>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                required
                autoComplete="name"
                className="lf-input"
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center',
              }}>
                <Mail size={16} />
              </span>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="lf-input"
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center',
              }}>
                <Lock size={16} />
              </span>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                autoComplete="new-password"
                className="lf-input"
                style={{ paddingLeft: 42, paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center',
              }}>
                <Lock size={16} />
              </span>
              <input
                id="signup-confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                required
                autoComplete="new-password"
                className="lf-input"
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          {/* Terms */}
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
            By creating an account you agree to our{' '}
            <a href="#" style={{ color: '#a78bfa', textDecoration: 'none' }}>Terms of Service</a>{' '}
            and{' '}
            <a href="#" style={{ color: '#a78bfa', textDecoration: 'none' }}>Privacy Policy</a>.
          </p>

          {/* Submit */}
          <button
            id="signup-submit"
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              padding: '13px', fontSize: 15, borderRadius: 12,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 6px 24px rgba(124,58,237,0.45)',
            }}
          >
            {loading ? <Spinner size={18} /> : <ArrowRight size={18} />}
            {loading ? 'Creating account...' : 'Create Free Account'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Already a member?</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        </div>

        <Link
          to="/login"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600,
            background: 'rgba(255,255,255,0.08)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            color: '#fff', textDecoration: 'none',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          Log in to your account
        </Link>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
            ← Back to LearnFlow
          </Link>
        </div>
      </div>
    </div>
  )
}
