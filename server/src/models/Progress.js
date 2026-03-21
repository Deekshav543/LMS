const mongoose = require('mongoose')

const ProgressSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true },
    status: { type: String, enum: ['completed'], default: 'completed' },
    completed_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

ProgressSchema.index({ user_id: 1, course_id: 1, lesson_id: 1 }, { unique: true })

module.exports = mongoose.model('Progress', ProgressSchema)

