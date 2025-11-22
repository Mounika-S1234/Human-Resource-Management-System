const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Organisation = sequelize.define(
  'Organisation',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'organisations',
    timestamps: false,
  }
);

module.exports = Organisation;
