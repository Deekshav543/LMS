const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  instructor: { type: DataTypes.STRING, defaultValue: 'Expert Instructor' }, // requested "instructor"
  price: { type: DataTypes.STRING, defaultValue: '₹499' }, // requested "price" (String to keep ₹ currency)
  image: { type: DataTypes.STRING }, // requested "image"
  duration: { type: DataTypes.INTEGER, defaultValue: 0 }, // requested "duration"
  lessons: { type: DataTypes.INTEGER, defaultValue: 0 }, // requested "lessons"
  rating: { type: DataTypes.FLOAT, defaultValue: 0.0 }, // requested "rating"
  students: { type: DataTypes.STRING, defaultValue: '0' }, // requested "students" (string for '12,450')
  // Keeping these for backwards compatibility with parts not explicitly told to remove:
  thumbnail: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  instructorName: { type: DataTypes.STRING, defaultValue: 'Admin Instructor' }
}, {
  timestamps: false
})

module.exports = Course
