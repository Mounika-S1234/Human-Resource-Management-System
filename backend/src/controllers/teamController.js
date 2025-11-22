const { Team, Employee, EmployeeTeam, Log } = require('../models');
const { Op } = require('sequelize');

// List all teams for organisation
const listTeams = async (req, res) => {
  try {
    const orgId = req.user.orgId;

    const teams = await Team.findAll({
      where: { organisationId: orgId },
      include: {
        association: 'Employees',
        through: { attributes: [] },
      },
    });

    return res.json({ teams });
  } catch (error) {
    console.error('List teams error:', error);
    return res.status(500).json({ message: 'Failed to list teams', error: error.message });
  }
};

// Get single team
const getTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.user.orgId;

    const team = await Team.findOne({
      where: { id, organisationId: orgId },
      include: {
        association: 'Employees',
        through: { attributes: [] },
      },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    return res.json({ team });
  } catch (error) {
    console.error('Get team error:', error);
    return res.status(500).json({ message: 'Failed to get team', error: error.message });
  }
};

// Create team
const createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    const orgId = req.user.orgId;

    if (!name) {
      return res.status(400).json({ message: 'Team name required' });
    }

    const team = await Team.create({
      organisationId: orgId,
      name,
      description,
    });

    // Create log
    await Log.create({
      organisationId: orgId,
      userId: req.user.userId,
      action: 'team_created',
      meta: { teamId: team.id, name },
    });

    return res.status(201).json({
      message: 'Team created successfully',
      team,
    });
  } catch (error) {
    console.error('Create team error:', error);
    return res.status(500).json({ message: 'Failed to create team', error: error.message });
  }
};

// Update team
const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const orgId = req.user.orgId;

    const team = await Team.findOne({
      where: { id, organisationId: orgId },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.update({
      name: name || team.name,
      description: description || team.description,
    });

    // Create log
    await Log.create({
      organisationId: orgId,
      userId: req.user.userId,
      action: 'team_updated',
      meta: {
        teamId: id,
        changes: { name, description },
      },
    });

    return res.json({
      message: 'Team updated successfully',
      team,
    });
  } catch (error) {
    console.error('Update team error:', error);
    return res.status(500).json({ message: 'Failed to update team', error: error.message });
  }
};

// Delete team
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.user.orgId;

    const team = await Team.findOne({
      where: { id, organisationId: orgId },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.destroy();

    // Create log
    await Log.create({
      organisationId: orgId,
      userId: req.user.userId,
      action: 'team_deleted',
      meta: { teamId: id },
    });

    return res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Delete team error:', error);
    return res.status(500).json({ message: 'Failed to delete team', error: error.message });
  }
};

// Assign employee to team
const assignEmployee = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { employeeId } = req.body;
    const orgId = req.user.orgId;

    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID required' });
    }

    const team = await Team.findOne({
      where: { id: teamId, organisationId: orgId },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const employee = await Employee.findOne({
      where: { id: employeeId, organisationId: orgId },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if already assigned
    const existing = await EmployeeTeam.findOne({
      where: { employeeId, teamId },
    });

    if (existing) {
      return res.status(409).json({ message: 'Employee already assigned to this team' });
    }

    const assignment = await EmployeeTeam.create({
      employeeId,
      teamId,
    });

    // Create log
    await Log.create({
      organisationId: orgId,
      userId: req.user.userId,
      action: 'employee_assigned_to_team',
      meta: { employeeId, teamId },
    });

    return res.status(201).json({
      message: 'Employee assigned to team successfully',
      assignment,
    });
  } catch (error) {
    console.error('Assign employee error:', error);
    return res.status(500).json({ message: 'Failed to assign employee', error: error.message });
  }
};

// Unassign employee from team
const unassignEmployee = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { employeeId } = req.body;
    const orgId = req.user.orgId;

    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID required' });
    }

    const team = await Team.findOne({
      where: { id: teamId, organisationId: orgId },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const assignment = await EmployeeTeam.findOne({
      where: { employeeId, teamId },
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await assignment.destroy();

    // Create log
    await Log.create({
      organisationId: orgId,
      userId: req.user.userId,
      action: 'employee_unassigned_from_team',
      meta: { employeeId, teamId },
    });

    return res.json({ message: 'Employee unassigned from team successfully' });
  } catch (error) {
    console.error('Unassign employee error:', error);
    return res.status(500).json({ message: 'Failed to unassign employee', error: error.message });
  }
};

module.exports = {
  listTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployee,
  unassignEmployee,
};
