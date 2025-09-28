// controllers/authController.js
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

// User Registration - Use existing schema
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    console.log(`📝 SIGNUP ATTEMPT: ${email}`);

    // Validation
    if (!name || !email || !password) {
      console.log(`❌ SIGNUP FAILED: Missing required fields`);
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (password.length < 6) {
      console.log(`❌ SIGNUP FAILED: Password too short`);
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    console.log('🔍 Checking existing users...');
    const [existingUsers] = await pool.execute(
      'SELECT id, email FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      console.log(`❌ SIGNUP FAILED: ${email} already exists in database`);
      return res.status(400).json({
        success: false,
        message: 'Email already registered. Please login instead.'
      });
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user using your existing schema
    console.log('💾 Inserting into existing users table...');
    const [result] = await pool.execute(`
      INSERT INTO users (
        name, 
        email, 
        password, 
        phone, 
        role, 
        address, 
        is_email_verified, 
        is_active,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, 'user', ?, FALSE, TRUE, NOW(), NOW())
    `, [name, email, hashedPassword, phone || null, address || null]);

    console.log(`✅ USER REGISTERED in existing schema:`);
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${name}`);
    console.log(`🆔 Database ID: ${result.insertId}`);
    console.log(`👥 Role: user`);
    console.log(`📱 Phone: ${phone || 'not provided'}`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! You can now login.',
      user: {
        id: result.insertId,
        name,
        email,
        phone,
        role: 'user',
        isEmailVerified: false,
        isActive: true
      }
    });

  } catch (error) {
    console.error('❌ SIGNUP ERROR:', error);
    console.error('Error code:', error.code);
    console.error('SQL State:', error.sqlState);
    
    res.status(500).json({
      success: false,
      message: 'Failed to create account. Please try again.',
      error: error.message
    });
  }
};

// User Login - Use existing schema
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`🔑 LOGIN ATTEMPT: ${email}`);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Get user from existing schema
    const [users] = await pool.execute(`
      SELECT 
        id, name, email, password, phone, role, 
        avatar_url, is_email_verified, address, 
        emergency_contact, is_active, created_at 
      FROM users 
      WHERE email = ?
    `, [email]);

    if (users.length === 0) {
      console.log(`❌ LOGIN FAILED: ${email} not found in database`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    if (!user.is_active) {
      console.log(`❌ LOGIN FAILED: ${email} account is deactivated`);
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    console.log('🔐 Verifying password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log(`❌ LOGIN FAILED: Invalid password for ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log(`✅ LOGIN SUCCESSFUL from existing database:`);
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🆔 ID: ${user.id}`);
    console.log(`👥 Role: ${user.role}`);
    console.log(`✉️ Email Verified: ${user.is_email_verified}`);

    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatar_url,
        isEmailVerified: user.is_email_verified,
        address: user.address,
        emergencyContact: user.emergency_contact,
        memberSince: user.created_at
      }
    });

  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// Check if user exists in existing schema
const checkUserExists = async (req, res) => {
  try {
    const { email } = req.params;

    console.log(`🔍 CHECKING USER: ${email} in existing database`);

    const [users] = await pool.execute(
      'SELECT id, name, email, role, is_email_verified FROM users WHERE email = ?',
      [email]
    );

    if (users.length > 0) {
      console.log(`✅ USER FOUND: ${email} exists in database`);
    } else {
      console.log(`❌ USER NOT FOUND: ${email} needs to register`);
    }

    res.json({
      success: true,
      exists: users.length > 0,
      user: users.length > 0 ? {
        id: users[0].id,
        name: users[0].name,
        email: users[0].email,
        role: users[0].role,
        isEmailVerified: users[0].is_email_verified
      } : null
    });

  } catch (error) {
    console.error('❌ USER CHECK ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check user'
    });
  }
};

// Get user profile from existing schema
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const [users] = await pool.execute(`
      SELECT 
        id, name, email, phone, role, avatar_url, 
        is_email_verified, address, emergency_contact, 
        travel_history, preferences, created_at, updated_at
      FROM users 
      WHERE id = ? AND is_active = TRUE
    `, [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatar_url,
        isEmailVerified: user.is_email_verified,
        address: user.address,
        emergencyContact: user.emergency_contact,
        travelHistory: user.travel_history ? JSON.parse(user.travel_history) : [],
        preferences: user.preferences ? JSON.parse(user.preferences) : {},
        memberSince: user.created_at,
        lastUpdated: user.updated_at
      }
    });

  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

module.exports = { registerUser, loginUser, checkUserExists, getUserProfile };
