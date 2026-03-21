const express = require('express');
const { pool } = require('../config/db');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/youtube-url', requireAuth, async (req, res) => {
  try {
    const { lessonId } = req.body || {};
    if (!lessonId) return res.status(400).json({ message: 'lessonId is required' });

    const [lessons] = await pool.query('SELECT * FROM lessons WHERE id = ?', [lessonId]);
    const lesson = lessons[0];
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const [enrollments] = await pool.query('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?', [req.user.id, lesson.course_id]);
    if (enrollments.length === 0) return res.status(403).json({ message: 'Enroll in course to access lessons' });

    return res.json({
      lessonId: lesson.id,
      youtubeUrl: lesson.video_url,
      youtube_url: lesson.video_url,
      order: lesson.order,
      title: lesson.title,
      courseId: lesson.course_id,
    });
  } catch (err) {
    console.error('[lessons] resolveUrl error:', err);
    return res.status(500).json({ message: 'Failed to resolve youtube url' });
  }
});

module.exports = router;
