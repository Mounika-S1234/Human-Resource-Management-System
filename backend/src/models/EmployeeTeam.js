const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Employee = require('./Employee');
const Team = require('./Team');

const EmployeeTeam = sequelize.define(
  'EmployeeTeam',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
        key: 'id',
      },
      allowNull: false,
      onDelete: 'CASCADE',
    },
    teamId: {
      type: DataTypes.INTEGER,
      references: {
        model: Team,
        key: 'id',
      },
      allowNull: false,
      onDelete: 'CASCADE',
    },
    assignedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'employee_teams',
    timestamps: false,
  }
);

EmployeeTeam.belongsTo(Employee, { foreignKey: 'employeeId' });
EmployeeTeam.belongsTo(Team, { foreignKey: 'teamId' });

module.exports = EmployeeTeam;
