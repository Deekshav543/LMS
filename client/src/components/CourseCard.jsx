import { Star, Clock, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CourseCard({ course, onEnroll, isEnrolled }) {
  const navigate = useNavigate()
  
  const rating = Number(course.rating) || 4.5
  const price = course.price || '₹499'
  const students = course.students || '12,450'

  return (
    <div
      className="course-card"
      role="article"
    >
      {/* Thumbnail */}
      <div className="card-thumbnail">
        <img
          src={course.thumbnail || `https://picsum.photos/seed/${course.id}/720/400`}
          alt={`${course.title} thumbnail`}
        />
        {/* Category overlay */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          padding: '4px 10px', borderRadius: 6,
          background: 'rgba(124,58,237,0.85)',
          backdropFilter: 'blur(4px)',
          color: '#fff', fontSize: 11, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {course.category}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: 8 }}>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700,
          color: 'var(--text-primary)', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {course.title}
        </h3>

        {/* Instructor */}
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {course.instructorName || 'Expert Instructor'}
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: 14 }}>{rating.toFixed(1)}</span>
          <div style={{ display: 'flex', gap: 1 }}>
            {[1,2,3,4,5].map(i => (
              <Star
                key={i}
                size={12}
                fill={i <= Math.floor(rating) ? '#f59e0b' : 'none'}
                stroke="#f59e0b"
                strokeWidth={1.5}
              />
            ))}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({students})</span>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={11} /> {course.totalLessons || '–'} lessons
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={11} /> {students}
          </span>
        </div>

        {/* Price + Actions */}
        <div style={{
          marginTop: 'auto', paddingTop: 12,
          borderTop: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>
            {price}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => navigate(`/course/${course.id}`)}
              className="btn-ghost"
              style={{ padding: '7px 12px', fontSize: 12 }}
            >
              Details
            </button>
            {isEnrolled ? (
              <button
                type="button"
                onClick={() => navigate(`/course/${course.id}`)}
                className="btn-primary"
                style={{ padding: '7px 14px', fontSize: 12, background: 'var(--bg-success, #059669)' }}
              >
                Let's Go
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onEnroll(course.id)}
                className="btn-primary"
                style={{ padding: '7px 14px', fontSize: 12 }}
              >
                Enroll
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
