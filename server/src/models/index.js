const User = require('./User')
const Course = require('./Course')
const Lesson = require('./Lesson')
const Progress = require('./Progress')
const Enrollment = require('./Enrollment')

User.hasMany(Enrollment, { foreignKey: 'user_id' })
Enrollment.belongsTo(User, { foreignKey: 'user_id' })

Course.hasMany(Enrollment, { foreignKey: 'course_id' })
Enrollment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' })

Course.hasMany(Lesson, { foreignKey: 'course_id' })
Lesson.belongsTo(Course, { foreignKey: 'course_id' })

User.hasMany(Progress, { foreignKey: 'user_id' })
Progress.belongsTo(User, { foreignKey: 'user_id' })

Lesson.hasMany(Progress, { foreignKey: 'lesson_id' })
Progress.belongsTo(Lesson, { foreignKey: 'lesson_id' })

Course.hasMany(Progress, { foreignKey: 'course_id' })
Progress.belongsTo(Course, { foreignKey: 'course_id' })

module.exports = { User, Course, Lesson, Progress, Enrollment }
