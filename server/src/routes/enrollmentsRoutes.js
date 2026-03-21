const express = require('express')

const Enrollment = require('../models/Enrollment')
const Course = require('../models/Course')
const Lesson = require('../models/Lesson')
const Progress = require('../models/Progress')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

async function progressSummaryFor(userId, courseId) {
  const totalLessons = await Lesson.countDocuments({ courseId })
  const completedLessons = await Progress.countDocuments({
    user_id: userId,
    course_id: courseId,
    status: 'completed',
  })

  const percentage = totalLessons ? (completedLessons / totalLessons) * 100 : 0

  const last = await Progress.findOne({
    user_id: userId,
    course_id: courseId,
    status: 'completed',
  })
    .sort({ completed_at: -1 })
    .select('lesson_id completed_at')
    .lean()

  const completedLessonIds = await Progress.find({
    user_id: userId,
    course_id: courseId,
    status: 'completed',
  })
    .select('lesson_id')
    .lean()

  const lessonIdList = completedLessonIds.map((p) => String(p.lesson_id))
  const lastWatchedLesson = last?.lesson_id ? String(last.lesson_id) : null

  return {
    percentage,
    completedLessons,
    totalLessons,
    lastWatchedLesson,
    completedLessonIds: lessonIdList,
  }
}

router.post('/', requireAuth, async (req, res) => {
  try {
    const { courseId } = req.body || {}
    if (!courseId) return res.status(400).json({ message: 'courseId is required' })

    const course = await Course.findById(courseId).lean()
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const existing = await Enrollment.findOne({ user_id: req.user.id, course_id: courseId })
    if (existing) {
      return res.status(200).json({ enrollment: existing })
    }

    const enrollment = await Enrollment.create({
      user_id: req.user.id,
      course_id: courseId,
      enrollment_date: new Date(),
    })

    return res.status(201).json({ enrollment })
  } catch (err) {
    return res.status(500).json({ message: 'Enrollment failed' })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user_id: req.user.id })
      .sort({ enrollment_date: -1 })
      .lean()

    const courseIds = enrollments.map((e) => e.course_id)
    const courses = await Course.find({ _id: { $in: courseIds } })
      .select('_id title description thumbnail category instructorId')
      .lean()

    const courseById = new Map(courses.map((c) => [String(c._id), c]))

    const items = await Promise.all(
      enrollments.map(async (e) => {
        const course = courseById.get(String(e.course_id))
        if (!course) return null
        const summary = await progressSummaryFor(req.user.id, e.course_id)
        return {
          course: { id: course._id, ...course },
          enrollment_date: e.enrollment_date,
          progress: summary,
        }
      })
    )

    return res.json({ enrollments: items.filter(Boolean) })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch enrollments' })
  }
})

module.exports = router

