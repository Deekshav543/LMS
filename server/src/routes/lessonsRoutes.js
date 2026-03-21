const express = require('express')

const Lesson = require('../models/Lesson')
const Enrollment = require('../models/Enrollment')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

router.post('/youtube-url', requireAuth, async (req, res) => {
  try {
    const { lessonId } = req.body || {}
    if (!lessonId) return res.status(400).json({ message: 'lessonId is required' })

    const lesson = await Lesson.findById(lessonId).select('_id courseId youtube_url order title').lean()
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' })

    const enrollment = await Enrollment.findOne({
      user_id: req.user.id,
      course_id: lesson.courseId,
    })
    if (!enrollment) return res.status(403).json({ message: 'Enroll in course to access lessons' })

    return res.json({
      lessonId: lesson._id,
      youtubeUrl: lesson.youtube_url,
      youtube_url: lesson.youtube_url, // backward compatibility
      order: lesson.order,
      title: lesson.title,
      courseId: lesson.courseId,
    })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to resolve youtube url' })
  }
})

module.exports = router

