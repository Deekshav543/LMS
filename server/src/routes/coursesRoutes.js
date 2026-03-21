const express = require('express');
const { pool } = require('../config/db');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

async function courseTotals(courseId) {
  const [totals] = await pool.query(
    'SELECT COUNT(id) AS totalLessons, SUM(duration) AS totalDuration FROM lessons WHERE course_id = ?',
    [courseId]
  );
  const t = totals[0] || { totalLessons: 0, totalDuration: 0 };
  return {
    totalLessons: Number(t.totalLessons) || 0,
    totalDuration: Number(t.totalDuration) || 0
  };
}

router.get('/', async (req, res) => {
  try {
    const [courses] = await pool.query('SELECT * FROM courses ORDER BY id DESC');

    const withTotals = await Promise.all(
      courses.map(async (course) => {
        const totals = await courseTotals(course.id);
        return {
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail || course.image,
          category: course.category,
          instructorName: course.instructor || course.instructorName || 'Expert Instructor',
          price: course.price,
          rating: course.rating,
          students: course.students,
          totalLessons: totals.totalLessons,
          totalDuration: totals.totalDuration,
        };
      })
    );

    return res.json({ courses: withTotals });
  } catch (err) {
    console.error('[courses] ERROR AT GET /api/courses:', err);
    return res.status(500).json({ message: 'Failed to fetch courses' });
  }
});

router.get('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const [courses] = await pool.query('SELECT * FROM courses WHERE id = ?', [courseId]);
    const course = courses[0];

    if (!course) return res.status(404).json({ message: 'Course not found' });

    const totals = await courseTotals(course.id);

    return res.json({
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail || course.image,
        category: course.category,
        instructorName: course.instructor || course.instructorName || 'Expert Instructor',
        price: course.price,
        rating: course.rating,
        students: course.students,
        totalLessons: totals.totalLessons,
        totalDuration: totals.totalDuration,
      },
    });
  } catch (err) {
    console.error('[courses] getById error:', err);
    return res.status(500).json({ message: 'Failed to fetch course' });
  }
});

router.get('/:courseId/lessons', async (req, res) => {
  try {
    const { courseId } = req.params;
    const [courses] = await pool.query('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (courses.length === 0) return res.status(404).json({ message: 'Course not found' });

    const [lessons] = await pool.query(
      'SELECT id, title, `order`, video_url, duration FROM lessons WHERE course_id = ? ORDER BY `order` ASC',
      [courseId]
    );

    return res.json({
      lessons: lessons.map((l) => ({
        id: l.id,
        title: l.title,
        order: l.order,
        youtubeUrl: l.video_url,
        youtube_url: l.video_url, // compatibility
        duration: l.duration,
      })),
    });
  } catch (err) {
    console.error('[courses] getLessons error:', err);
    return res.status(500).json({ message: 'Failed to fetch lessons' });
  }
});

module.exports = router;
