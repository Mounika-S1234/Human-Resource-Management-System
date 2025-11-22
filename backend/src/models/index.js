const Organisation = require('./Organisation');
const User = require('./User');
const Employee = require('./Employee');
const Team = require('./Team');
const EmployeeTeam = require('./EmployeeTeam');
const Log = require('./Log');

// Define associations
Employee.hasMany(EmployeeTeam, { foreignKey: 'employeeId' });
Team.hasMany(EmployeeTeam, { foreignKey: 'teamId' });

Employee.belongsToMany(Team, {
  through: EmployeeTeam,
  foreignKey: 'employeeId',
  otherKey: 'teamId',
});

Team.belongsToMany(Employee, {
  through: EmployeeTeam,
  foreignKey: 'teamId',
  otherKey: 'employeeId',
});

module.exports = {
  Organisation,
  User,
  Employee,
  Team,
  EmployeeTeam,
  Log,
};
