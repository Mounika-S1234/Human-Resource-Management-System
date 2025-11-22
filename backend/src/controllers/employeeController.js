const { Employee, EmployeeTeam, Log } = require('../models');

// List all employees for organisation
const listEmployees = async (req, res) => {
  try {
    const orgId = req.user.orgId;

    const employees = await Employee.findAll({
      where: { organisationId: orgId },
      include: {
        association: 'Teams',
        through: { attributes: [] },
      },
    });

    return res.json({ employees });
  } catch (error) {
    console.error('List employees error:', error);
    return res.status(500).json({ message: 'Failed to list employees', error: error.message });
  }
};

// Get single employee
const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.user.orgId;

    const employee = await Employee.findOne({
      where: { id, organisationId: orgId },
      include: {
        association: 'Teams',
        through: { attributes: [] },
      },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.json({ employee });
  } catch (error) {
    console.error('Get employee error:', error);
    return res.status(500).json({ message: 'Failed to get employee', error: error.message });
  }
};

// Create employee
const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const orgId = req.user.orgId;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name required' });
    }

    const employee = await Employee.create({
      organisationId: orgId,
      firstName,
      lastName,
      email,
      phone,
    });

    // Create log
    await Log.create({
      organisationId: orgId,
      userId: req.user.userId,
      action: 'employee_created',
      meta: {
        employeeId: employee.id,
        firstName,
        lastName,
      },
    });

    return res.status(201).json({
      message: 'Employee created successfully',
      employee,
    });
  } catch (error) {
    console.error('Create employee error:', error);
    return res.status(500).json({ message: 'Failed to create employee', error: error.message });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone } = req.body;
    const orgId = req.user.orgId;

    const employee = await Employee.findOne({
      where: { id, organisationId: orgId },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.update({
      firstName: firstName || employee.firstName,
      lastName: lastName || employee.lastName,
      email: email || employee.email,
      phone: phone || employee.phone,
    });

    // Create log
    await Log.create({
      organisationId: orgId,
      userId: req.user.userId,
      action: 'employee_updated',
      meta: {
        employeeId: id,
        changes: { firstName, lastName, email, phone },
      },
    });

    return res.json({
      message: 'Employee updated successfully',
      employee,
    });
  } catch (error) {
    console.error('Update employee error:', error);
    return res.status(500).json({ message: 'Failed to update employee', error: error.message });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.user.orgId;

    const employee = await Employee.findOne({
      where: { id, organisationId: orgId },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.destroy();

    // Create log
    await Log.create({
      organisationId: orgId,
      userId: req.user.userId,
      action: 'employee_deleted',
      meta: { employeeId: id },
    });

    return res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    return res.status(500).json({ message: 'Failed to delete employee', error: error.message });
  }
};

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
