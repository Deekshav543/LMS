const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const dns = require('dns')

const { sampleCourses } = require('./sampleData')

const User = require('../src/models/User')
const Course = require('../src/models/Course')
const Section = require('../src/models/Section')
const Lesson = require('../src/models/Lesson')
const Enrollment = require('../src/models/Enrollment')
const Progress = require('../src/models/Progress')

async function seed() {
  const uri = process.env.MONGO_URI
  if (!uri) throw new Error('MONGO_URI is not set')
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set (needed for server; not required for seeding but good hygiene)')
  }

  if (uri.startsWith('mongodb+srv://')) {
    dns.setServers(['8.8.8.8', '1.1.1.1'])
  }

  await mongoose.connect(uri)

  // Clear existing data for a clean demo environment
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Section.deleteMany({}),
    Lesson.deleteMany({}),
    Enrollment.deleteMany({}),
    Progress.deleteMany({}),
  ])

  const adminPasswordHash = await bcrypt.hash('Admin123!', 10)
  const studentPasswordHash = await bcrypt.hash('Student123!', 10)

  const admin = await User.create({
    name: 'Admin Instructor',
    email: 'admin@example.com',
    passwordHash: adminPasswordHash,
    role: 'admin',
  })

  const student = await User.create({
    name: 'Student Learner',
    email: 'student@example.com',
    passwordHash: studentPasswordHash,
    role: 'student',
  })

  for (const c of sampleCourses) {
    const course = await Course.create({
      title: c.title,
      description: c.description,
      thumbnail: c.thumbnail,
      category: c.category,
      instructorId: admin._id,
      learningOutcomes: c.learningOutcomes,
    })

    for (const sec of c.sections) {
      const section = await Section.create({
        courseId: course._id,
        title: sec.title,
        order: sec.order,
      })

      // Lessons must be sequentially ordered within the course
      for (const lesson of sec.lessons) {
        await Lesson.create({
          courseId: course._id,
          sectionId: section._id,
          title: lesson.title,
          order: lesson.order,
          youtube_url: lesson.youtube_url,
          duration: lesson.duration,
        })
      }
    }
  }

  // Enroll student + seed some progress so "Resume Learning" works immediately
  const courses = await Course.find({}).lean()
  for (const course of courses) {
    await Enrollment.create({
      user_id: student._id,
      course_id: course._id,
      enrollment_date: new Date(),
    })

    const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 }).lean()
    if (lessons.length > 0) {
      await Progress.create({
        user_id: student._id,
        course_id: course._id,
        lesson_id: lessons[0]._id,
        status: 'completed',
        completed_at: new Date(),
      })
    }
  }

  // eslint-disable-next-line no-console
  console.log('Seed complete.')
  // eslint-disable-next-line no-console
  console.log('Admin login:', { email: 'admin@example.com', password: 'Admin123!' })
  // eslint-disable-next-line no-console
  console.log('Student login:', { email: 'student@example.com', password: 'Student123!' })

  await mongoose.disconnect()
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  })

