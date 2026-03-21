import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import CourseCard from '../components/CourseCard'
import { CourseCatalogSkeleton } from '../components/Skeletons'
import { useToasts } from '../components/ToastProvider'
import { BookOpen, Filter, SlidersHorizontal } from 'lucide-react'
import { AuthContext } from '../auth/AuthContext'

const CATEGORIES_FILTER = ['All', 'Programming', 'AI & ML', 'Web Dev', 'Data Science', 'DevOps', 'Cybersecurity']

export default function Home() {
  const { pushToast } = useToasts()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [courses, setCourses] = useState([])
  const [enrolledIds, setEnrolledIds] = useState([])
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  const query = searchParams.get('q') || ''

  useEffect(() => {
    api
      .get('/courses')
      .then((res) => setCourses(res.data.courses))
      .catch(() => pushToast('error', 'Failed to load courses'))
      .finally(() => setLoading(false))
  }, [pushToast])

  useEffect(() => {
    if (!user) return
    api
      .get('/enrollments/me')
      .then((res) => {
        const ids = (res.data.enrollments || []).map(e => String(e.course.id))
        setEnrolledIds(ids)
      })
      .catch(() => {})
  }, [user])

  const filtered = useMemo(() => {
    let list = courses
    const q = query.trim().toLowerCase()
    if (q) list = list.filter(c => c.title.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q))
    if (activeCategory !== 'All') list = list.filter(c => c.category === activeCategory)
    return list
  }, [courses, query, activeCategory])

  const onEnroll = async (courseId) => {
    try {
      await api.post('/enrollments', { courseId })
      pushToast('success', 'Enrolled successfully! Starting your course...')
      navigate(`/course/${courseId}`)
    } catch (err) {
      pushToast('error', err?.response?.data?.message || 'Enrollment failed')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #3b0764 0%, #4c1d95 50%, #1e3a5f 100%)',
        padding: '48px 24px 64px',
        marginBottom: -32,
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
            }}>
              <BookOpen size={20} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 30, fontWeight: 800,
              color: '#fff', margin: 0,
            }}>
              Course Catalog
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15 }}>
            {loading ? 'Loading courses...' : `${courses.length} courses available — Enroll and start learning today`}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 64px' }}>

        {/* Filter Row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32,
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14 }}>
            <SlidersHorizontal size={16} />
            <span>Filter:</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES_FILTER.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 16px', borderRadius: 999,
                  border: activeCategory === cat ? '2px solid var(--brand-primary)' : '1.5px solid var(--border-color)',
                  background: activeCategory === cat ? 'rgba(124,58,237,0.12)' : 'var(--bg-card)',
                  color: activeCategory === cat ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: activeCategory === cat ? 700 : 500,
                  fontSize: 13, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Result count */}
          {!loading && (
            <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              {query ? ` for "${query}"` : ''}
            </div>
          )}
        </div>

        {/* Search query indicator */}
        {query && !loading && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24,
            padding: '10px 16px', borderRadius: 10,
            background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
          }}>
            <Filter size={15} style={{ color: 'var(--brand-primary)' }} />
            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>
              Searching for: <strong>"{query}"</strong>
            </span>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <CourseCatalogSkeleton count={6} />
        ) : filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '80px 24px', textAlign: 'center',
            border: '2px dashed var(--border-color)', borderRadius: 20,
            background: 'var(--bg-surface)',
          }}>
            <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
            <h3 style={{ fontFamilie: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              No courses found
            </h3>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
              {query ? 'Try a different search term or category.' : 'No courses are available right now.'}
            </p>
            {(query || activeCategory !== 'All') && (
              <button
                type="button"
                onClick={() => { setActiveCategory('All'); navigate('/home') }}
                className="btn-primary"
                style={{ marginTop: 20 }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {filtered.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onEnroll={onEnroll} 
                isEnrolled={enrolledIds.includes(String(course.id))} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
