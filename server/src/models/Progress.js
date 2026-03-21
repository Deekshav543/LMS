const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Progress = sequelize.define('Progress', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  lesson_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false }, // added to summary tracking
  completed: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  timestamps: true
})

module.exports = Progress
