const express = require('express');
const { pool } = require('../config/db');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/complete', requireAuth, async (req, res) => {
  try {
    const { lessonId, courseId } = req.body || {};
    if (!lessonId || !courseId) return res.status(400).json({ message: 'lessonId and courseId are required' });

    // Ensure enrollment
    const [enrollments] = await pool.query('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?', [req.user.id, courseId]);
    if (enrollments.length === 0) return res.status(403).json({ message: 'User not enrolled' });

    // Upsert equivalent for mysql
    const [existing] = await pool.query('SELECT id FROM progress WHERE user_id = ? AND lesson_id = ?', [req.user.id, lessonId]);
    if (existing.length > 0) {
      await pool.query('UPDATE progress SET completed = 1, updatedAt = NOW() WHERE id = ?', [existing[0].id]);
    } else {
      await pool.query(
        'INSERT INTO progress (user_id, course_id, lesson_id, completed, updatedAt) VALUES (?, ?, ?, 1, NOW())',
        [req.user.id, courseId, lessonId]
      );
    }

    // After marking complete, fetch and return the updated progress summary
    const [totalRows] = await pool.query('SELECT COUNT(id) AS totalLessons FROM lessons WHERE course_id = ?', [courseId]);
    const totalLessons = totalRows[0].totalLessons || 0;

    const [completedRows] = await pool.query(
      'SELECT COUNT(id) AS completedLessons FROM progress WHERE user_id = ? AND course_id = ? AND completed = 1',
      [req.user.id, courseId]
    );
    const completedLessons = completedRows[0].completedLessons || 0;

    const percentage = totalLessons ? (completedLessons / totalLessons) * 100 : 0;

    const [lastWatchedRows] = await pool.query(
      'SELECT lesson_id FROM progress WHERE user_id = ? AND course_id = ? AND completed = 1 ORDER BY updatedAt DESC LIMIT 1',
      [req.user.id, courseId]
    );

    const [completedIdsRows] = await pool.query(
      'SELECT lesson_id FROM progress WHERE user_id = ? AND course_id = ? AND completed = 1',
      [req.user.id, courseId]
    );

    return res.json({
      ok: true,
      message: 'Lesson marked as complete',
      progress: {
        percentage: Math.round(percentage),
        completedLessons,
        totalLessons,
        lastWatchedLesson: lastWatchedRows[0]?.lesson_id ? String(lastWatchedRows[0].lesson_id) : null,
        completedLessonIds: completedIdsRows.map((p) => String(p.lesson_id)),
      },
    });
  } catch (err) {
    console.error('[progress] complete error:', err);
    return res.status(500).json({ message: 'Failed to update progress' });
  }
});

router.get('/summary', requireAuth, async (req, res) => {
  try {
    const { courseId } = req.query;
    if (!courseId) return res.status(400).json({ message: 'courseId required' });

    const [totalRows] = await pool.query('SELECT COUNT(id) AS totalLessons FROM lessons WHERE course_id = ?', [courseId]);
    const totalLessons = totalRows[0].totalLessons || 0;

    const [completedRows] = await pool.query(
      'SELECT COUNT(id) AS completedLessons FROM progress WHERE user_id = ? AND course_id = ? AND completed = 1',
      [req.user.id, courseId]
    );
    const completedLessons = completedRows[0].completedLessons || 0;

    const percentage = totalLessons ? (completedLessons / totalLessons) * 100 : 0;

    const [lastWatchedRows] = await pool.query(
      'SELECT lesson_id FROM progress WHERE user_id = ? AND course_id = ? AND completed = 1 ORDER BY updatedAt DESC LIMIT 1',
      [req.user.id, courseId]
    );

    const [completedIdsRows] = await pool.query(
      'SELECT lesson_id FROM progress WHERE user_id = ? AND course_id = ? AND completed = 1',
      [req.user.id, courseId]
    );

    return res.json({
      progress: {
        percentage: Math.round(percentage),
        completedLessons,
        totalLessons,
        lastWatchedLesson: lastWatchedRows[0]?.lesson_id ? String(lastWatchedRows[0].lesson_id) : null,
        completedLessonIds: completedIdsRows.map((p) => String(p.lesson_id)),
      },
    });
  } catch (err) {
    console.error('[progress] getSummary error:', err);
    return res.status(500).json({ message: 'Failed to fetch summary' });
  }
});

module.exports = router;
