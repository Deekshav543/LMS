import { useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import { AuthContext } from '../auth/AuthContext'
import LessonItem from './LessonItem'
import ProgressBar from './ProgressBar'
import Spinner from './Spinner'
import { CoursePlayerSkeleton } from './Skeletons'
import { useToasts } from './ToastProvider'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'

/** Robustly extract YouTube video ID from any URL or bare ID */
function extractVideoId(youtubeUrl) {
  if (!youtubeUrl) return ''
  const trimmed = String(youtubeUrl).trim()

  const embed = trimmed.match(/embed\/([a-zA-Z0-9_-]{11})/)
  if (embed?.[1]) return embed[1]

  const watch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (watch?.[1]) return watch[1]

  const short = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (short?.[1]) return short[1]

  const shorts = trimmed.match(/shorts\/([a-zA-Z0-9_-]{11})/)
  if (shorts?.[1]) return shorts[1]

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed

  return ''
}

function getNextLessonId({ lessons, completedLessonIds, lastWatchedLessonId }) {
  const sorted = [...lessons].sort((a, b) => a.order - b.order)
  const completedSet = new Set(completedLessonIds || [])

  if (lastWatchedLessonId) {
    const idx = sorted.findIndex((l) => String(l.id) === String(lastWatchedLessonId))
    if (idx >= 0) {
      const after = sorted.slice(idx + 1)
      const nextIncomplete = after.find((l) => !completedSet.has(String(l.id)))
      if (nextIncomplete) return nextIncomplete.id
    }
  }

  const firstIncomplete = sorted.find((l) => !completedSet.has(String(l.id)))
  if (firstIncomplete) return firstIncomplete.id

  const last = sorted[sorted.length - 1]
  return last?.id || null
}

export default function CoursePlayer({ courseId }) {
  const { user } = useContext(AuthContext)
  const { pushToast } = useToasts()

  const [lessons, setLessons] = useState([])
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeLessonId, setActiveLessonId] = useState(null)
  const [resolvedYoutubeUrl, setResolvedYoutubeUrl] = useState(null)
  const [resolving, setResolving] = useState(false)
  const [completing, setCompleting] = useState(false)

  const sortedLessons = useMemo(() => [...lessons].sort((a, b) => a.order - b.order), [lessons])
  const completedLessonIds = useMemo(() => progress?.completedLessonIds || [], [progress])

  useEffect(() => {
    if (!user) return
    setLoading(true)
    Promise.all([
      api.get(`courses/${courseId}/lessons`),
      api.get(`progress/summary?courseId=${encodeURIComponent(courseId)}`),
    ])
      .then(([lessonRes, progressRes]) => {
        const fetchedLessons = lessonRes.data.lessons || []
        setLessons(fetchedLessons)
        const p = progressRes.data.progress
        setProgress(p)
        const nextId = getNextLessonId({
          lessons: fetchedLessons,
          completedLessonIds: p?.completedLessonIds || [],
          lastWatchedLessonId: p?.lastWatchedLesson || null,
        })
        setActiveLessonId(nextId)
      })
      .catch((err) => pushToast('error', err?.response?.data?.message || 'Failed to load course player'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user])

  const activeLesson = useMemo(() => {
    if (!activeLessonId) return null
    return sortedLessons.find((l) => String(l.id) === String(activeLessonId)) || null
  }, [activeLessonId, sortedLessons])

  const resolveYoutubeForLesson = async (lessonIdToResolve) => {
    if (!lessonIdToResolve) return
    setResolving(true)
    try {
      const res = await api.post('lessons/youtube-url', { lessonId: lessonIdToResolve })
      setResolvedYoutubeUrl(res.data.youtubeUrl || res.data.youtube_url)
    } catch (err) {
      pushToast('error', err?.response?.data?.message || 'Failed to load video')
    } finally {
      setResolving(false)
    }
  }

  useEffect(() => {
    if (activeLessonId) resolveYoutubeForLesson(activeLessonId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLessonId])

  const isCompleted = useMemo(() => {
    if (!activeLessonId) return false
    return completedLessonIds.some((id) => String(id) === String(activeLessonId))
  }, [activeLessonId, completedLessonIds])

  const onCompleteActiveLesson = async () => {
    if (!user || !activeLessonId || !courseId || isCompleted || completing) return
    setCompleting(true)
    try {
      await api.post('progress/complete', { userId: user.id, courseId, lessonId: activeLessonId })
      pushToast('success', '✅ Marked as complete!')

      const summaryRes = await api.get(`progress/summary?courseId=${encodeURIComponent(courseId)}`)
      const newProgress = summaryRes.data.progress
      setProgress(newProgress)

      const nextId = getNextLessonId({
        lessons,
        completedLessonIds: newProgress.completedLessonIds || [],
        lastWatchedLessonId: newProgress.lastWatchedLesson || activeLessonId,
      })
      if (nextId && String(nextId) !== String(activeLessonId)) {
        setActiveLessonId(nextId)
      }
    } catch (err) {
      pushToast('error', err?.response?.data?.message || 'Failed to update progress')
    } finally {
      setCompleting(false)
    }
  }

  const goNext = () => {
    const idx = sortedLessons.findIndex((l) => String(l.id) === String(activeLessonId))
    if (idx < 0) return
    const next = sortedLessons[idx + 1]
    if (next) setActiveLessonId(next.id)
  }

  const goPrev = () => {
    const idx = sortedLessons.findIndex((l) => String(l.id) === String(activeLessonId))
    if (idx < 0) return
    const prev = sortedLessons[idx - 1]
    if (prev) setActiveLessonId(prev.id)
  }

  const activeLessonIdx = sortedLessons.findIndex((l) => String(l.id) === String(activeLessonId))
  const totalLessons = progress?.totalLessons ?? sortedLessons.length
  const completedCount = progress?.completedLessons ?? completedLessonIds.length

  const videoId = extractVideoId(resolvedYoutubeUrl)
  // Convert to embed URL with rel=0 to prevent unrelated videos
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1` : ''

  if (loading) return <CoursePlayerSkeleton />

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, minHeight: 560, position: 'relative' }}>
      {/* ── LEFT: Lesson List ── */}
      <aside style={{
        borderRadius: 18,
        border: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}
        className="lesson-sidebar"
      >
        <div style={{
          padding: '20px 18px', borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              Course Content
            </h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
              {completedCount}/{totalLessons}
            </span>
          </div>
          <ProgressBar percentage={progress?.percentage || 0} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {sortedLessons.map((l) => {
            const completed = completedLessonIds.includes(String(l.id))
            const active = String(l.id) === String(activeLessonId)
            return (
              <LessonItem
                key={l.id}
                lesson={l}
                active={active}
                completed={completed}
                onClick={() => setActiveLessonId(l.id)}
              />
            )
          })}
        </div>
      </aside>

      {/* ── RIGHT: Video Player ── */}
      <div style={{
        borderRadius: 18,
        border: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Lesson title area */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          background: 'var(--bg-surface)',
        }}>
          <div>
            {activeLesson && (
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--brand-primary)', marginBottom: 3 }}>
                Lesson {activeLesson.order} of {sortedLessons.length}
              </div>
            )}
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {activeLesson?.title || 'Select a lesson'}
            </h2>
          </div>

          {/* Prev / Next */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={goPrev}
              disabled={activeLessonIdx <= 0}
              className="btn-secondary"
              style={{ padding: '7px 14px', fontSize: 13 }}
            >
              <ChevronLeft size={15} /> Prev
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={activeLessonIdx >= sortedLessons.length - 1}
              className="btn-secondary"
              style={{ padding: '7px 14px', fontSize: 13 }}
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* Video area */}
        <div style={{ background: '#000', position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          {resolving ? (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', color: '#fff', gap: 12, zIndex: 5,
            }}>
              <Spinner size={36} />
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Loading video...</span>
            </div>
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              title={activeLesson?.title || 'Course Video'}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)',
            }}>
              <p>No valid YouTube video found for this lesson.</p>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{completedCount}</span>
            &nbsp;of&nbsp;
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{totalLessons}</span>
            &nbsp;lessons completed
          </div>

          <button
            type="button"
            id="mark-complete-btn"
            onClick={onCompleteActiveLesson}
            disabled={completing || isCompleted}
            className={isCompleted ? 'btn-secondary' : 'btn-primary'}
            style={{
              padding: '10px 22px', fontSize: 14,
              background: isCompleted ? 'rgba(5,150,105,0.1)' : undefined,
              color: isCompleted ? '#059669' : undefined,
              border: isCompleted ? '1.5px solid rgba(5,150,105,0.3)' : undefined,
            }}
          >
            {isCompleted ? <CheckCircle size={16} /> : null}
            {isCompleted ? 'Completed ✓' : completing ? 'Saving...' : 'Mark as Complete'}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .lesson-sidebar { display: none; }
          [class*="grid"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
