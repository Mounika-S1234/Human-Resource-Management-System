const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Organisation = require('./Organisation');

const Team = sequelize.define(
  'Team',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    organisationId: {
      type: DataTypes.INTEGER,
      references: {
        model: Organisation,
        key: 'id',
      },
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'teams',
    timestamps: false,
  }
);

Team.belongsTo(Organisation, { foreignKey: 'organisationId' });

module.exports = Team;
