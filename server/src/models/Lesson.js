const mongoose = require('mongoose')

const LessonSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true, index: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, index: true },
    youtube_url: { type: String, required: true },
    duration: { type: Number, default: 0 }, // seconds
  },
  { timestamps: true }
)

// Unique lesson within a course by order position
LessonSchema.index({ courseId: 1, order: 1 }, { unique: true })

module.exports = mongoose.model('Lesson', LessonSchema)

