const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    category: { type: String, default: '' },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    learningOutcomes: { type: [String], default: [] },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Course', CourseSchema)

