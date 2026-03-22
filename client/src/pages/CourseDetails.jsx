import { useContext, useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import { useToasts } from '../components/ToastProvider'
import CoursePlayer from '../components/CoursePlayer'
import { CourseDetailsHeaderSkeleton, CoursePlayerSkeleton } from '../components/Skeletons'
import { AuthContext } from '../auth/AuthContext'
import { Star, Clock, Users, BookOpen, Award, ArrowLeft, PlayCircle } from 'lucide-react'

function formatDuration(seconds) {
  const s = Number(seconds) || 0
  const hours = Math.floor(s / 3600)
  const minutes = Math.round((s % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes} min`
}

export default function CourseDetails() {
  const { courseId } = useParams()
  const { user } = useContext(AuthContext)
  const { pushToast } = useToasts()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolled, setEnrolled] = useState(null)

  useEffect(() => {
    api
      .get(`courses/${courseId}`)
      .then((res) => setCourse(res.data.course))
      .catch(() => pushToast('error', 'Failed to load course'))
      .finally(() => setLoading(false))
  }, [courseId, pushToast])

  useEffect(() => {
    if (!user) return
    api
      .get('enrollments/me')
      .then((res) => {
        const ids = (res.data.enrollments || []).map((e) => String(e.course.id))
        setEnrolled(ids.includes(String(courseId)))
      })
      .catch(() => setEnrolled(false))
  }, [courseId, user])

  const onEnroll = async () => {
    try {
      await api.post('enrollments', { courseId })
      pushToast('success', 'Enrolled! Start your learning journey now.')
      setEnrolled(true)
    } catch (err) {
      pushToast('error', err?.response?.data?.message || 'Enrollment failed')
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
        <CourseDetailsHeaderSkeleton />
      </div>
    )
  }

  if (!course) {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-primary)' }}>Course not found</h2>
        <Link to="/home" className="btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
          Browse Courses
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* Back nav */}
      <div style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card)', padding: '12px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Link to="/home" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 500,
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <ArrowLeft size={16} /> Back to Courses
          </Link>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e0a3c 0%, #3b0764 40%, #1e3a5f 100%)',
        padding: '48px 24px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center' }}>
          <div style={{ maxWidth: 700 }}>
            {/* Category */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 999,
              background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.4)',
              color: '#c4b5fd', fontSize: 12, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16,
            }}>
              <BookOpen size={12} /> {course.category}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 16,
            }}>
              {course.title}
            </h1>

            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 24, maxWidth: 580 }}>
              {course.description}
            </p>

            {/* Meta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                <Star size={16} fill="#f59e0b" stroke="none" />
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>{Number(course.rating || 4.5).toFixed(1)}</span>
                <span>(12,450 ratings)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                <Users size={16} />
                <span>{course.students || '12,450'} students</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                <BookOpen size={16} />
                <span>{course.totalLessons} lessons</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                <Clock size={16} />
                <span>{formatDuration(course.totalDuration)}</span>
              </div>
            </div>

            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              👨‍🏫 Instructor: <strong style={{ color: '#fff' }}>{course.instructorName}</strong>
            </div>
          </div>

          {/* Course Thumbnail */}
          {course.thumbnail && (
            <div style={{
              width: 320, borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              border: '2px solid rgba(255,255,255,0.1)',
              flexShrink: 0,
            }}
              className="hide-on-mobile"
            >
              <img src={course.thumbnail} alt={course.title} style={{ width: '100%', display: 'block' }} />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 64px' }}>

        {/* Enroll CTA (if not enrolled) */}
        {enrolled === false && (
          <div style={{
            borderRadius: 18, padding: '28px 32px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.06))',
            border: '1.5px solid rgba(124,58,237,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 20, marginBottom: 32,
          }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                Ready to start learning?
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                Enroll now to unlock all {course.totalLessons} lessons and track your progress automatically.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>
                {course.price || '₹999'}
              </div>
              <button
                type="button"
                id="enroll-button"
                onClick={onEnroll}
                className="btn-primary"
                style={{ padding: '12px 28px', fontSize: 15, borderRadius: 12 }}
              >
                <PlayCircle size={18} /> Enroll Now
              </button>
            </div>
          </div>
        )}

        {/* Course Player / Preview */}
        {enrolled === null ? (
          <CoursePlayerSkeleton />
        ) : enrolled ? (
          <CoursePlayer courseId={courseId} />
        ) : (
          <div style={{
            borderRadius: 18,
            border: '2px dashed var(--border-color)',
            background: 'var(--bg-surface)',
            padding: '60px 24px', textAlign: 'center',
          }}>
            <Award size={52} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Enroll to access the full course
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              All lessons, the video player, and progress tracking will be unlocked after enrollment.
            </p>
          </div>
        )}
      </div>

      <style>{`@media (max-width: 768px) { .hide-on-mobile { display: none !important; } }`}</style>
    </div>
  )
}
