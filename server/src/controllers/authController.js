// Single Official Administrator Account for Laxmi Niwas
const ENTERPRISE_USER = {
  id: 'usr_admin_001',
  name: 'Laxmi Niwas Admin',
  username: 'admin',
  email: 'admin@laxminiwas.in',
  role: 'Super Admin',
  badge: '👑 Executive Clearance',
  department: 'Administration & Risk Management',
  password: 'admin123',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  permissions: ['all'],
  clearanceLevel: 'LEVEL 5 — MASTER ACCESS'
};

/**
 * Handles user authentication
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please enter both your identifier and password.'
      });
    }

    const inputId = email.trim().toLowerCase();
    const inputPassword = password.trim();

    // Check single admin identifier
    const isIdValid =
      inputId === ENTERPRISE_USER.email.toLowerCase() ||
      inputId === ENTERPRISE_USER.username.toLowerCase();

    if (!isIdValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or username. Please check your credentials.'
      });
    }

    // Verify Password
    if (inputPassword !== ENTERPRISE_USER.password) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password. Please verify and try again.'
      });
    }

    // Generate JWT Token
    const token = `lxn_jwt_${Buffer.from(JSON.stringify({
      id: ENTERPRISE_USER.id,
      email: ENTERPRISE_USER.email,
      role: ENTERPRISE_USER.role,
      exp: Date.now() + 24 * 60 * 60 * 1000
    })).toString('base64')}`;

    const sessionPayload = {
      token,
      user: {
        id: ENTERPRISE_USER.id,
        name: ENTERPRISE_USER.name,
        email: ENTERPRISE_USER.email,
        username: ENTERPRISE_USER.username,
        role: ENTERPRISE_USER.role,
        badge: ENTERPRISE_USER.badge,
        department: ENTERPRISE_USER.department,
        avatar: ENTERPRISE_USER.avatar,
        permissions: ENTERPRISE_USER.permissions,
        clearanceLevel: ENTERPRISE_USER.clearanceLevel,
        lastLogin: new Date().toISOString(),
        sessionDuration: '24 Hours'
      }
    };

    return res.status(200).json({
      success: true,
      message: 'Authentication successful. Welcome to Laxmi Niwas.',
      ...sessionPayload
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal authentication service error.'
    });
  }
};

/**
 * Returns current authenticated user profile
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No active session token provided.' });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: ENTERPRISE_USER.id,
      name: ENTERPRISE_USER.name,
      email: ENTERPRISE_USER.email,
      username: ENTERPRISE_USER.username,
      role: ENTERPRISE_USER.role,
      badge: ENTERPRISE_USER.badge,
      department: ENTERPRISE_USER.department,
      avatar: ENTERPRISE_USER.avatar,
      permissions: ENTERPRISE_USER.permissions,
      clearanceLevel: ENTERPRISE_USER.clearanceLevel,
      lastLogin: new Date().toISOString()
    }
  });
};

/**
 * Handles logout
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};
