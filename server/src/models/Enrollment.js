const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Enrollment = sequelize.define('Enrollment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: true,
  createdAt: 'enrollment_date',
  updatedAt: false
})

module.exports = Enrollment
