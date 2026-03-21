const express = require('express')

const Lesson = require('../models/Lesson')
const Progress = require('../models/Progress')
const Enrollment = require('../models/Enrollment')

const { requireAuth } = require('../middleware/auth')

const router = express.Router()

async function computeSummary(userId, courseId) {
  const totalLessons = await Lesson.countDocuments({ courseId })
  const completedLessons = await Progress.countDocuments({
    user_id: userId,
    course_id: courseId,
    status: 'completed',
  })

  const percentage = totalLessons ? (completedLessons / totalLessons) * 100 : 0

  const completed = await Progress.find({
    user_id: userId,
    course_id: courseId,
    status: 'completed',
  })
    .select('lesson_id')
    .lean()

  const completedLessonIds = completed.map((p) => String(p.lesson_id))

  const last = await Progress.findOne({
    user_id: userId,
    course_id: courseId,
    status: 'completed',
  })
    .sort({ completed_at: -1 })
    .select('lesson_id completed_at')
    .lean()

  return {
    percentage,
    completedLessons,
    totalLessons,
    lastWatchedLesson: last?.lesson_id ? String(last.lesson_id) : null,
    completedLessonIds,
  }
}

router.post('/complete', requireAuth, async (req, res) => {
  try {
    const { userId, courseId, lessonId } = req.body || {}
    if (!userId || !courseId || !lessonId) {
      return res.status(400).json({ message: 'userId, courseId, lessonId are required' })
    }

    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'userId mismatch' })
    }

    const enrollment = await Enrollment.findOne({ user_id: req.user.id, course_id: courseId })
    if (!enrollment) return res.status(403).json({ message: 'Enroll in course first' })

    const lesson = await Lesson.findById(lessonId).select('courseId').lean()
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' })
    if (String(lesson.courseId) !== String(courseId)) return res.status(400).json({ message: 'Lesson not in course' })

    const now = new Date()
    await Progress.updateOne(
      { user_id: req.user.id, course_id: courseId, lesson_id: lessonId },
      {
        $set: { status: 'completed' },
        $setOnInsert: { completed_at: now },
      },
      { upsert: true }
    )

    const summary = await computeSummary(req.user.id, courseId)
    return res.json({ ok: true, progress: summary })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to complete lesson' })
  }
})

router.get('/summary', requireAuth, async (req, res) => {
  try {
    const courseId = req.query.courseId
    if (!courseId) return res.status(400).json({ message: 'courseId is required' })

    const enrollment = await Enrollment.findOne({ user_id: req.user.id, course_id: courseId })
    if (!enrollment) return res.status(403).json({ message: 'Enroll in course first' })

    const summary = await computeSummary(req.user.id, courseId)
    return res.json({ progress: summary })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch progress summary' })
  }
})

module.exports = router

