const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Lesson = sequelize.define('Lesson', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  video_url: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.INTEGER, defaultValue: 0 },
  order: { type: DataTypes.INTEGER, defaultValue: 0 } // needed for sorting in UI
}, {
  timestamps: false
})

module.exports = Lesson
