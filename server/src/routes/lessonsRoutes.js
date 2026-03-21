const express = require('express')
const { Lesson, Enrollment } = require('../models')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

router.post('/youtube-url', requireAuth, async (req, res) => {
  try {
    const { lessonId } = req.body || {}
    if (!lessonId) return res.status(400).json({ message: 'lessonId is required' })

    const lesson = await Lesson.findByPk(lessonId, { raw: true })
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' })

    const enrollment = await Enrollment.findOne({
      where: {
        user_id: req.user.id,
        course_id: lesson.course_id,
      }
    })
    
    if (!enrollment) return res.status(403).json({ message: 'Enroll in course to access lessons' })

    return res.json({
      lessonId: lesson.id,
      youtubeUrl: lesson.video_url,
      youtube_url: lesson.video_url, // backward compatibility
      order: lesson.order,
      title: lesson.title,
      courseId: lesson.course_id,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to resolve youtube url' })
  }
})

module.exports = router
