const mongoose = require('mongoose')

const EnrollmentSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    enrollment_date: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

EnrollmentSchema.index({ user_id: 1, course_id: 1 }, { unique: true })

module.exports = mongoose.model('Enrollment', EnrollmentSchema)

