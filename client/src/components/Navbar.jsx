import { Search, Moon, Sun, LogOut, User, BookOpen, LayoutDashboard, Menu, X } from 'lucide-react'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../auth/AuthContext'
import { ThemeContext } from '../theme/ThemeContext'

export default function Navbar({ onLogout }) {
  const { user, token } = useContext(AuthContext)
  const themeCtx = useContext(ThemeContext)
  const navigate = useNavigate()
  const location = useLocation()

  const qFromUrl = useMemo(() => {
    const sp = new URLSearchParams(location.search)
    return sp.get('q') || ''
  }, [location.search])

  const [q, setQ] = useState(qFromUrl)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => { setQ(qFromUrl) }, [qFromUrl])
  useEffect(() => { setMobileOpen(false); setProfileOpen(false) }, [location.pathname])

  const onSearch = (e) => {
    e.preventDefault()
    const url = q.trim() ? `/home?q=${encodeURIComponent(q.trim())}` : '/home'
    navigate(url)
  }

  const isLanding = location.pathname === '/' || location.pathname === '/landing'

  return (
    <>
      <header
        className="lf-navbar"
        style={{
          background: isLanding ? 'rgba(9,9,11,0.70)' : undefined,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: isLanding ? '1px solid rgba(255,255,255,0.08)' : undefined,
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', height: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px' }}>

          {/* Logo */}
          <Link
            to={user ? '/home' : '/'}
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}
          >
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14,
              boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
            }}>
              LF
            </div>
            <span style={{
              fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18,
              color: isLanding ? '#fff' : 'var(--text-primary)',
              letterSpacing: '-0.3px',
            }}>
              LearnFlow
            </span>
          </Link>

          {/* Search (show when authenticated or on catalog) */}
          {user && (
            <form onSubmit={onSearch} className="lf-search" style={{ flex: 1, maxWidth: 480 }}>
              <span className="lf-search-icon"><Search size={16} /></span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for courses, topics..."
              />
            </form>
          )}

          {/* Spacer for landing */}
          {!user && <div style={{ flex: 1 }} />}

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hidden-mobile">

            {/* Dark Mode Toggle */}
            {themeCtx && (
              <button
                type="button"
                onClick={themeCtx.toggleTheme}
                title={themeCtx.theme === 'dark' ? 'Light mode' : 'Dark mode'}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 38, height: 38,
                  borderRadius: 10,
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--brand-primary)'; e.currentTarget.style.borderColor = 'var(--brand-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)' }}
              >
                {themeCtx.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {user ? (
              <>
                <Link to="/home" className="btn-ghost" style={{ color: isLanding ? 'rgba(255,255,255,0.8)' : undefined }}>
                  Courses
                </Link>
                <Link to="/dashboard" className="btn-ghost" style={{ color: isLanding ? 'rgba(255,255,255,0.8)' : undefined }}>
                  My Learning
                </Link>

                {/* Profile Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 12px',
                      border: '1.5px solid var(--border-color)',
                      background: 'var(--bg-surface)',
                      borderRadius: 10,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 12,
                    }}>
                      {(user.name || 'U')[0].toUpperCase()}
                    </div>
                    <span>{user.name?.split(' ')[0] || 'Account'}</span>
                  </button>

                  {profileOpen && (
                    <div style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 14,
                      boxShadow: 'var(--shadow-lg)',
                      minWidth: 200,
                      overflow: 'hidden',
                      animation: 'fadeInUp 0.2s ease',
                      zIndex: 100,
                    }}>
                      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{user.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{user.email}</div>
                      </div>
                      <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', textDecoration: 'none', color: 'var(--text-primary)', fontSize: 14, transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <BookOpen size={15} /> Browse Courses
                      </Link>
                      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', textDecoration: 'none', color: 'var(--text-primary)', fontSize: 14, transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LayoutDashboard size={15} /> My Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={() => { setProfileOpen(false); onLogout?.() }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          width: '100%', padding: '12px 16px',
                          background: 'transparent', border: 'none',
                          borderTop: '1px solid var(--border-color)',
                          color: '#dc2626', fontSize: 14, fontWeight: 500,
                          cursor: 'pointer', transition: 'background 0.15s',
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost" style={{
                  color: isLanding ? 'rgba(255,255,255,0.9)' : undefined,
                }}>
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up Free
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(v => !v)}
            style={{
              display: 'none',
              width: 38, height: 38,
              alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-surface)',
              border: '1.5px solid var(--border-color)',
              borderRadius: 10,
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
            className="show-mobile"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
        }}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0,
            width: 280, background: 'var(--bg-card)',
            boxShadow: 'var(--shadow-lg)',
            padding: 24,
            display: 'flex', flexDirection: 'column', gap: 8,
            animation: 'fadeIn 0.25s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button type="button" onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>
            {themeCtx && (
              <button type="button" onClick={() => { themeCtx.toggleTheme(); setMobileOpen(false) }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontSize: 15, fontWeight: 500 }}>
                {themeCtx.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                {themeCtx.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            )}
            {user ? (
              <>
                <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', textDecoration: 'none', color: 'var(--text-primary)', fontSize: 15, fontWeight: 500 }}>
                  <BookOpen size={18} /> Courses
                </Link>
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', textDecoration: 'none', color: 'var(--text-primary)', fontSize: 15, fontWeight: 500 }}>
                  <LayoutDashboard size={18} /> My Learning
                </Link>
                <button type="button" onClick={() => { setMobileOpen(false); onLogout?.() }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 15, fontWeight: 500, marginTop: 'auto' }}>
                  <LogOut size={18} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', textDecoration: 'none', color: 'var(--text-primary)', fontSize: 15, fontWeight: 500 }}>
                  <User size={18} /> Log In
                </Link>
                <Link to="/signup" className="btn-primary" style={{ marginTop: 8, justifyContent: 'center' }}>
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}
