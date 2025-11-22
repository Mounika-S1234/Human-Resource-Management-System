const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Organisation, Log } = require('../models');

// Register organisation and admin user
const register = async (req, res) => {
  try {
    const { orgName, adminName, email, password } = req.body;

    if (!orgName || !adminName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Create organisation
    const organisation = await Organisation.create({ name: orgName });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      organisationId: organisation.id,
      email,
      passwordHash,
      name: adminName,
    });

    // Create log
    await Log.create({
      organisationId: organisation.id,
      userId: user.id,
      action: 'organisation_created',
      meta: { organisationId: organisation.id, userId: user.id },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, orgId: organisation.id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(201).json({
      message: 'Organisation and user created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      organisation: {
        id: organisation.id,
        name: organisation.name,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({
      where: { email },
      include: Organisation,
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create log
    await Log.create({
      organisationId: user.organisationId,
      userId: user.id,
      action: 'user_login',
      meta: { userId: user.id },
    });

    const token = jwt.sign(
      { userId: user.id, orgId: user.organisationId },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      organisation: {
        id: user.Organisation.id,
        name: user.Organisation.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

module.exports = {
  register,
  login,
};
