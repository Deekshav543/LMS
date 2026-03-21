const express = require('express')
const { Lesson, Progress, Enrollment } = require('../models')
const { requireAuth } = require('../middleware/auth')
const enrollmentsRoutes = require('./enrollmentsRoutes') // Reusing properly defined compute summary

const router = express.Router()
const computeSummary = enrollmentsRoutes.progressSummaryFor 

router.post('/complete', requireAuth, async (req, res) => {
  try {
    const { userId, courseId, lessonId } = req.body || {}
    if (!userId || !courseId || !lessonId) {
      return res.status(400).json({ message: 'userId, courseId, lessonId are required' })
    }

    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'userId mismatch' })
    }

    const enrollment = await Enrollment.findOne({ where: { user_id: req.user.id, course_id: courseId } })
    if (!enrollment) return res.status(403).json({ message: 'Enroll in course first' })

    const lesson = await Lesson.findByPk(lessonId)
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' })
    if (String(lesson.course_id) !== String(courseId)) return res.status(400).json({ message: 'Lesson not in course' })

    const [progressRecord, created] = await Progress.findOrCreate({
      where: { user_id: req.user.id, course_id: courseId, lesson_id: lessonId },
      defaults: { completed: true }
    })

    if (!created && !progressRecord.completed) {
      progressRecord.completed = true
      await progressRecord.save()
    }

    const summary = await computeSummary(req.user.id, courseId)
    return res.json({ ok: true, progress: summary })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to complete lesson' })
  }
})

router.get('/summary', requireAuth, async (req, res) => {
  try {
    const courseId = req.query.courseId || req.query.course_id
    if (!courseId) return res.status(400).json({ message: 'courseId is required' })

    const enrollment = await Enrollment.findOne({ where: { user_id: req.user.id, course_id: courseId } })
    if (!enrollment) return res.status(403).json({ message: 'Enroll in course first' })

    const summary = await computeSummary(req.user.id, courseId)
    return res.json({ progress: summary })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to fetch progress summary' })
  }
})

module.exports = router
