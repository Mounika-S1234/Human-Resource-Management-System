require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('./db');
const { Organisation, User, Employee, Team, EmployeeTeam } = require('./models');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    await sequelize.sync({ alter: true });
    console.log('Database tables synced');

    // Create organisation
    const org = await Organisation.create({
      name: 'Tech Company Inc.',
    });
    console.log('Organisation created:', org.id);

    // Create admin user
    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await User.create({
      organisationId: org.id,
      email: 'admin@techcompany.com',
      passwordHash,
      name: 'Admin User',
    });
    console.log('User created:', user.id);

    // Create sample employees
    const emp1 = await Employee.create({
      organisationId: org.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
    });

    const emp2 = await Employee.create({
      organisationId: org.id,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '123-456-7891',
    });

    const emp3 = await Employee.create({
      organisationId: org.id,
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      phone: '123-456-7892',
    });

    console.log('Employees created:', emp1.id, emp2.id, emp3.id);

    // Create sample teams
    const team1 = await Team.create({
      organisationId: org.id,
      name: 'Engineering',
      description: 'Software Engineering team',
    });

    const team2 = await Team.create({
      organisationId: org.id,
      name: 'Marketing',
      description: 'Marketing and Communications team',
    });

    console.log('Teams created:', team1.id, team2.id);

    // Assign employees to teams
    await EmployeeTeam.create({
      employeeId: emp1.id,
      teamId: team1.id,
    });

    await EmployeeTeam.create({
      employeeId: emp2.id,
      teamId: team1.id,
    });

    await EmployeeTeam.create({
      employeeId: emp2.id,
      teamId: team2.id,
    });

    await EmployeeTeam.create({
      employeeId: emp3.id,
      teamId: team2.id,
    });

    console.log('Assignments created');
    console.log('Database seeding completed successfully!');
    console.log('\nTest Credentials:');
    console.log('Email: admin@techcompany.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
