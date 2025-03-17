/**
 * Unified Authentication Controller
 * 
 * This controller handles authentication-related endpoints for both AnythingLLM and LibreChat.
 * It provides endpoints for login, registration, logout, token verification, etc.
 */

const {
  loginUser,
  registerUser,
  logoutUser,
  verifyToken,
  setUnifiedAuthTokens,
} = require('./unifiedAuthService');
const { logger } = require('../../core/librechat/api/config');

/**
 * Login controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await loginUser({ email, password }, res);
    return res.status(200).json(result);
  } catch (error) {
    logger.error('[loginController]', error);
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};

/**
 * Registration controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const registrationController = async (req, res) => {
  try {
    const { email, password, name, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await registerUser({ email, password, name, username });
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    logger.error('[registrationController]', error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Logout controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logoutController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const result = await logoutUser(req, refreshToken);
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    logger.error('[logoutController]', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

/**
 * Verify token controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const verifyTokenController = async (req, res) => {
  try {
    const auth = req.header('Authorization');
    const token = auth ? auth.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ valid: false });
    }

    const user = await verifyToken(token);

    if (!user) {
      return res.status(401).json({ valid: false });
    }

    return res.status(200).json({ valid: true, user });
  } catch (error) {
    logger.error('[verifyTokenController]', error);
    return res.status(401).json({ valid: false });
  }
};

/**
 * Refresh token controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }

    // Verify the refresh token
    const jwt = require('jsonwebtoken');
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    if (!payload || !payload.id) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Find the session with the refresh token
    const { findSession } = require('../../core/librechat/api/models');
    const session = await findSession({ userId: payload.id, refreshToken });

    if (!session || session.expiration < new Date()) {
      return res.status(401).json({ message: 'Refresh token expired or not found' });
    }

    // Get user
    const { getUserById } = require('../../core/librechat/api/models/userMethods');
    const user = await getUserById(payload.id, '-password -__v -totpSecret');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Set new auth tokens
    const token = await setUnifiedAuthTokens(payload.id, res);
    
    return res.status(200).json({ token, user });
  } catch (error) {
    logger.error('[refreshTokenController]', error);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

/**
 * Two-factor authentication verification controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const verifyTwoFactorController = async (req, res) => {
  try {
    const { token, code } = req.body;

    if (!token || !code) {
      return res.status(400).json({ message: 'Token and code are required' });
    }

    // Verify the temporary token
    const jwt = require('jsonwebtoken');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!payload || !payload.id || !payload.temp) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Get user
    const { getUserById } = require('../../core/librechat/api/models/userMethods');
    const user = await getUserById(payload.id, '+totpSecret');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Verify the 2FA code
    const speakeasy = require('speakeasy');
    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: code,
    });

    if (!verified) {
      return res.status(401).json({ message: 'Invalid 2FA code' });
    }

    // Set auth tokens
    const authToken = await setUnifiedAuthTokens(payload.id, res);
    
    // Return user info without sensitive data
    const { password: _p, totpSecret: _t, __v, ...safeUser } = user.toObject ? 
      user.toObject() : user;
    
    safeUser.id = safeUser._id.toString();

    return res.status(200).json({ token: authToken, user: safeUser });
  } catch (error) {
    logger.error('[verifyTwoFactorController]', error);
    return res.status(401).json({ message: 'Invalid token or code' });
  }
};

module.exports = {
  loginController,
  registrationController,
  logoutController,
  verifyTokenController,
  refreshTokenController,
  verifyTwoFactorController,
}; 