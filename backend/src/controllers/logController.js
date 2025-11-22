const { Log, User } = require('../models');

// Get all logs for organisation
const getLogs = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    const { action, limit = 50, offset = 0 } = req.query;

    let where = { organisationId: orgId };
    if (action) {
      where.action = action;
    }

    const { count, rows } = await Log.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'email', 'name'],
          required: false,
        },
      ],
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return res.json({
      logs: rows,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Get logs error:', error);
    return res.status(500).json({ message: 'Failed to get logs', error: error.message });
  }
};

module.exports = {
  getLogs,
};
