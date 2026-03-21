const mongoose = require('mongoose')

const SectionSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, index: true },
  },
  { timestamps: true }
)

SectionSchema.index({ courseId: 1, order: 1 }, { unique: true })

module.exports = mongoose.model('Section', SectionSchema)

