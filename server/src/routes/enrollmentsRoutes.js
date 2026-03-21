const express = require('express')
const { Enrollment, Course, Lesson, Progress } = require('../models')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

async function progressSummaryFor(userId, courseId) {
  const totalLessons = await Lesson.count({ where: { course_id: courseId } })
  const completedLessons = await Progress.count({
    where: {
      user_id: userId,
      course_id: courseId,
      completed: true,
    }
  })

  const percentage = totalLessons ? (completedLessons / totalLessons) * 100 : 0

  const lastProgress = await Progress.findOne({
    where: {
      user_id: userId,
      course_id: courseId,
      completed: true,
    },
    order: [['updatedAt', 'DESC']],
    attributes: ['lesson_id']
  })

  const completedRecords = await Progress.findAll({
    where: {
      user_id: userId,
      course_id: courseId,
      completed: true,
    },
    attributes: ['lesson_id']
  })

  const lessonIdList = completedRecords.map((p) => String(p.lesson_id))
  const lastWatchedLesson = lastProgress?.lesson_id ? String(lastProgress.lesson_id) : null

  return {
    percentage: Math.round(percentage),
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

    const course = await Course.findByPk(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const [enrollment, created] = await Enrollment.findOrCreate({
      where: { user_id: req.user.id, course_id: courseId }
    })

    if (!created) {
      return res.status(200).json({ enrollment })
    }

    return res.status(201).json({ enrollment })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Enrollment failed' })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { user_id: req.user.id },
      order: [['enrollment_date', 'DESC']],
      include: [{ model: Course, as: 'course' }]
    })

    const items = await Promise.all(
      enrollments.map(async (e) => {
        if (!e.course) return null
        const summary = await progressSummaryFor(req.user.id, e.course_id)
        return {
          course: { id: e.course.id, title: e.course.title, description: e.course.description, thumbnail: e.course.thumbnail, category: e.course.category, instructorName: e.course.instructorName },
          enrollment_date: e.enrollment_date,
          progress: summary,
        }
      })
    )

    return res.json({ enrollments: items.filter(Boolean) })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to fetch enrollments' })
  }
})

// Used extensively in progress checks as backwards compat wrapper so let's export it secretly for refactoring
module.exports = Object.assign(router, { progressSummaryFor })
