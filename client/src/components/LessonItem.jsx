import { Check, PlayCircle, Lock } from 'lucide-react'

export default function LessonItem({ lesson, active, completed, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`lesson-item${active ? ' active' : ''}`}
      style={{
        width: '100%', textAlign: 'left',
        border: active ? '1.5px solid rgba(124,58,237,0.3)' : '1.5px solid transparent',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 32, height: 32, flexShrink: 0,
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: completed
          ? 'rgba(5, 150, 105, 0.15)'
          : active
          ? 'rgba(124, 58, 237, 0.15)'
          : 'var(--bg-surface)',
        border: completed
          ? '1.5px solid rgba(5,150,105,0.3)'
          : active
          ? '1.5px solid rgba(124,58,237,0.3)'
          : '1.5px solid var(--border-color)',
        color: completed ? '#059669' : active ? 'var(--brand-primary)' : 'var(--text-muted)',
        transition: 'all 0.2s',
      }}>
        {completed ? <Check size={14} strokeWidth={2.5} /> : active ? <PlayCircle size={14} /> : <Lock size={12} />}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12,
          color: active ? 'var(--brand-primary)' : 'var(--text-muted)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 2,
        }}>
          Lesson {lesson.order}
        </div>
        <div style={{
          fontSize: 13, fontWeight: 500,
          color: active ? 'var(--brand-primary)' : 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {lesson.title}
        </div>
        {lesson.duration && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            {Math.round(lesson.duration / 60)} min
          </div>
        )}
      </div>

      {/* Completed badge */}
      {completed && (
        <div style={{
          flexShrink: 0,
          padding: '2px 8px', borderRadius: 999,
          background: 'rgba(5,150,105,0.1)',
          color: '#059669', fontSize: 11, fontWeight: 700,
        }}>
          Done
        </div>
      )}
    </button>
  )
}
