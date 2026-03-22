import { useContext, useEffect, useState } from 'react'
import api from '../api/axios'
import { DashboardSkeleton } from '../components/Skeletons'
import ProgressBar from '../components/ProgressBar'
import { AuthContext } from '../auth/AuthContext'
import { useToasts } from '../components/ToastProvider'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Trophy, PlayCircle, TrendingUp, Clock } from 'lucide-react'

export default function Dashboard() {
  const { user } = useContext(AuthContext)
  const { pushToast } = useToasts()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('enrollments/me')
      .then((res) => setItems(res.data.enrollments || []))
      .catch(() => pushToast('error', 'Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [pushToast, user])

  const totalCourses = items.length
  const completed = items.filter(it => it.progress.percentage >= 100).length
  const avgProgress = totalCourses > 0
    ? items.reduce((s, it) => s + it.progress.percentage, 0) / totalCourses
    : 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #164e63 0%, #1e3a8a 50%, #3b0764 100%)',
        padding: '48px 24px 64px',
        marginBottom: -32,
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Avatar */}
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 22,
              border: '3px solid rgba(255,255,255,0.2)',
            }}>
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800,
                color: '#fff', margin: 0, marginBottom: 4,
              }}>
                My Learning Dashboard
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, margin: 0 }}>
                Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! Keep up the great work 🚀
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 64px' }}>

        {/* Stats */}
        {!loading && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 20, marginBottom: 40,
          }}>
            {[
              { icon: <BookOpen size={20} />, label: 'Enrolled Courses', value: totalCourses, color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
              { icon: <Trophy size={20} />, label: 'Completed', value: completed, color: '#059669', bg: 'rgba(5,150,105,0.1)' },
              { icon: <TrendingUp size={20} />, label: 'Avg. Progress', value: `${avgProgress.toFixed(0)}%`, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
              { icon: <Clock size={20} />, label: 'In Progress', value: totalCourses - completed, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: '20px 24px', borderRadius: 16,
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: stat.bg, color: stat.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
            My Enrolled Courses
          </h2>
          <Link to="/home" className="btn-secondary" style={{ fontSize: 13 }}>
            Browse More Courses
          </Link>
        </div>

        {loading ? (
          <DashboardSkeleton count={4} />
        ) : items.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '80px 24px', textAlign: 'center',
            border: '2px dashed var(--border-color)', borderRadius: 20,
            background: 'var(--bg-surface)',
          }}>
            <BookOpen size={52} style={{ color: 'var(--text-muted)', marginBottom: 20 }} />
            <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
              No courses yet
            </h3>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 400 }}>
              You haven't enrolled in any courses yet. Browse our catalog and start your learning journey today!
            </p>
            <Link to="/home" className="btn-primary" style={{ fontSize: 15 }}>
              <BookOpen size={18} /> Browse Courses
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}>
            {items.map((it) => (
              <div
                key={it.course.id}
                style={{
                  borderRadius: 18, border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
              >
                {/* Course thumbnail */}
                {it.course.thumbnail && (
                  <img
                    src={it.course.thumbnail}
                    alt={it.course.title}
                    style={{ width: '100%', height: 140, objectFit: 'cover' }}
                  />
                )}

                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ flex: 1, marginRight: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand-primary)', marginBottom: 4 }}>
                        {it.course.category}
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                        {it.course.title}
                      </h3>
                    </div>
                    <div style={{
                      padding: '4px 12px', borderRadius: 999, flexShrink: 0,
                      background: it.progress.percentage >= 100 ? 'rgba(5,150,105,0.12)' : 'rgba(124,58,237,0.1)',
                      color: it.progress.percentage >= 100 ? '#059669' : 'var(--brand-primary)',
                      fontWeight: 800, fontSize: 14,
                    }}>
                      {it.progress.percentage.toFixed(0)}%
                    </div>
                  </div>

                  <ProgressBar percentage={it.progress.percentage} />

                  <div style={{
                    display: 'flex', justifyContent: 'flex-end', marginTop: 18,
                  }}>
                    <Link
                      to={`/course/${it.course.id}`}
                      className="btn-primary"
                      style={{ padding: '9px 20px', fontSize: 13 }}
                    >
                      <PlayCircle size={15} />
                      {it.progress.percentage >= 100 ? 'Review Course' : 'Continue Learning'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
