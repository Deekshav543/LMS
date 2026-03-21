const express = require('express');
const { pool } = require('../config/db');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

async function progressSummaryFor(userId, courseId) {
  const [totalsRows] = await pool.query('SELECT COUNT(id) AS totalLessons FROM lessons WHERE course_id = ?', [courseId]);
  const totalLessons = totalsRows[0].totalLessons || 0;

  const [completedRows] = await pool.query(
    'SELECT COUNT(id) AS completedLessons FROM progress WHERE user_id = ? AND course_id = ? AND completed = 1',
    [userId, courseId]
  );
  const completedLessons = completedRows[0].completedLessons || 0;

  const percentage = totalLessons ? (completedLessons / totalLessons) * 100 : 0;

  const [lastWatchedRows] = await pool.query(
    'SELECT lesson_id FROM progress WHERE user_id = ? AND course_id = ? AND completed = 1 ORDER BY updatedAt DESC LIMIT 1',
    [userId, courseId]
  );
  
  const [completedIdsRows] = await pool.query(
    'SELECT lesson_id FROM progress WHERE user_id = ? AND course_id = ? AND completed = 1',
    [userId, courseId]
  );

  const lessonIdList = completedIdsRows.map((p) => String(p.lesson_id));
  const lastWatchedLesson = lastWatchedRows[0]?.lesson_id ? String(lastWatchedRows[0].lesson_id) : null;

  return {
    percentage: Math.round(percentage),
    completedLessons,
    totalLessons,
    lastWatchedLesson,
    completedLessonIds: lessonIdList,
  };
}

router.post('/', requireAuth, async (req, res) => {
  try {
    const { courseId } = req.body || {};
    if (!courseId) return res.status(400).json({ message: 'courseId is required' });

    const [courses] = await pool.query('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (courses.length === 0) return res.status(404).json({ message: 'Course not found' });

    const [existing] = await pool.query('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?', [req.user.id, courseId]);
    if (existing.length > 0) {
       return res.status(200).json({ enrollment: existing[0] });
    }

    const [result] = await pool.query('INSERT INTO enrollments (user_id, course_id, enrollment_date) VALUES (?, ?, NOW())', [req.user.id, courseId]);
    
    return res.status(201).json({ enrollment: { id: result.insertId, user_id: req.user.id, course_id: courseId } });
  } catch (err) {
    console.error('[enrollments] create error:', err);
    return res.status(500).json({ message: 'Enrollment failed' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const [enrollments] = await pool.query(
      'SELECT e.*, c.title, c.description, c.thumbnail, c.category, c.instructor, c.instructorName FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.user_id = ? ORDER BY e.enrollment_date DESC',
      [req.user.id]
    );

    const items = await Promise.all(
      enrollments.map(async (e) => {
        const summary = await progressSummaryFor(req.user.id, e.course_id);
        return {
          course: { id: e.course_id, title: e.title, description: e.description, thumbnail: e.thumbnail, category: e.category, instructorName: e.instructor || e.instructorName },
          enrollment_date: e.enrollment_date,
          progress: summary,
        };
      })
    );

    return res.json({ enrollments: items.filter(Boolean) });
  } catch (err) {
    console.error('[enrollments] getMe error:', err);
    return res.status(500).json({ message: 'Failed to fetch enrollments' });
  }
});

module.exports = Object.assign(router, { progressSummaryFor });
