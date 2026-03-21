const express = require('express')

const Course = require('../models/Course')
const Section = require('../models/Section')
const Lesson = require('../models/Lesson')
const Enrollment = require('../models/Enrollment')
const Progress = require('../models/Progress')
const User = require('../models/User')
const { requireAuth, requireAdmin } = require('../middleware/auth')

const router = express.Router()

function courseTotals(courseId) {
  return Lesson.aggregate([
    { $match: { courseId } },
    { $group: { _id: '$courseId', totalLessons: { $sum: 1 }, totalDuration: { $sum: '$duration' } } },
  ])
}

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({})
      .sort({ createdAt: -1 })
      .lean()

    const instructorIds = courses.map((c) => c.instructorId)
    const instructors = await User.find({ _id: { $in: instructorIds } }).select('_id name').lean()
    const instructorById = new Map(instructors.map((u) => [String(u._id), u.name]))

    const withTotals = await Promise.all(
      courses.map(async (course) => {
        const totals = await courseTotals(course._id)
        const t = totals[0] || { totalLessons: 0, totalDuration: 0 }
        return {
          id: course._id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          category: course.category,
          instructorName: instructorById.get(String(course.instructorId)) || 'Instructor',
          totalLessons: t.totalLessons,
          totalDuration: t.totalDuration,
        }
      })
    )

    return res.json({ courses: withTotals })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch courses' })
  }
})

router.get('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params
    const course = await Course.findById(courseId).lean()
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const instructor = await User.findById(course.instructorId).select('name').lean()
    const totals = await courseTotals(course._id)
    const t = totals[0] || { totalLessons: 0, totalDuration: 0 }

    return res.json({
      course: {
        id: course._id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        category: course.category,
        instructorId: course.instructorId,
        instructorName: instructor?.name || 'Instructor',
        learningOutcomes: course.learningOutcomes,
        totalLessons: t.totalLessons,
        totalDuration: t.totalDuration,
      },
    })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch course' })
  }
})

// Step 1: fetch all lessons for the course
router.get('/:courseId/lessons', async (req, res) => {
  try {
    const { courseId } = req.params
    const course = await Course.findById(courseId).lean()
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const lessons = await Lesson.find({ courseId })
      .sort({ order: 1 })
      .select('_id title order youtube_url duration')
      .lean()

    return res.json({
      lessons: lessons.map((l) => ({
        id: l._id,
        title: l.title,
        order: l.order,
        youtubeUrl: l.youtube_url,
        youtube_url: l.youtube_url, // backward compatibility
        duration: l.duration,
      })),
    })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch lessons' })
  }
})

// Admin course create (includes sections + lessons)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, description, thumbnail, category, learningOutcomes, sections } = req.body || {}
    if (!title || !description) return res.status(400).json({ message: 'title and description are required' })
    if (!Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({ message: 'sections[] is required' })
    }

    const course = await Course.create({
      title: String(title).trim(),
      description: String(description),
      thumbnail: thumbnail ? String(thumbnail) : '',
      category: category ? String(category) : '',
      instructorId: req.user.id,
      learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes.map(String) : [],
    })

    // Create sections + lessons in order
    const createdSections = []
    for (const sec of sections) {
      const section = await Section.create({
        courseId: course._id,
        title: String(sec.title || 'Section').trim(),
        order: Number(sec.order ?? createdSections.length + 1),
      })

      createdSections.push(section)

      const lessons = Array.isArray(sec.lessons) ? sec.lessons : []
      for (const lesson of lessons) {
        if (!lesson?.title || !lesson?.youtube_url) continue
        await Lesson.create({
          courseId: course._id,
          sectionId: section._id,
          title: String(lesson.title).trim(),
          order: Number(lesson.order),
          youtube_url: String(lesson.youtube_url),
          duration: Number(lesson.duration ?? 0),
        })
      }
    }

    return res.status(201).json({ courseId: course._id })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create course' })
  }
})

router.put('/:courseId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { courseId } = req.params
    const { title, description, thumbnail, category, learningOutcomes, sections } = req.body || {}

    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    if (title !== undefined) course.title = String(title).trim()
    if (description !== undefined) course.description = String(description)
    if (thumbnail !== undefined) course.thumbnail = String(thumbnail)
    if (category !== undefined) course.category = String(category)
    if (learningOutcomes !== undefined) course.learningOutcomes = Array.isArray(learningOutcomes) ? learningOutcomes.map(String) : []

    await course.save()

    // Replace structure if provided
    if (Array.isArray(sections)) {
      await Progress.deleteMany({ course_id: course._id })
      await Enrollment.deleteMany({ course_id: course._id })
      await Lesson.deleteMany({ courseId: course._id })
      await Section.deleteMany({ courseId: course._id })

      for (const sec of sections) {
        const section = await Section.create({
          courseId: course._id,
          title: String(sec.title || 'Section').trim(),
          order: Number(sec.order ?? 1),
        })

        const lessons = Array.isArray(sec.lessons) ? sec.lessons : []
        for (const lesson of lessons) {
          if (!lesson?.title || !lesson?.youtube_url) continue
          await Lesson.create({
            courseId: course._id,
            sectionId: section._id,
            title: String(lesson.title).trim(),
            order: Number(lesson.order),
            youtube_url: String(lesson.youtube_url),
            duration: Number(lesson.duration ?? 0),
          })
        }
      }
    }

    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update course' })
  }
})

router.delete('/:courseId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { courseId } = req.params

    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    await Progress.deleteMany({ course_id: course._id })
    await Enrollment.deleteMany({ course_id: course._id })
    await Lesson.deleteMany({ courseId: course._id })
    await Section.deleteMany({ courseId: course._id })
    await Course.deleteById(course._id)

    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete course' })
  }
})

module.exports = router

