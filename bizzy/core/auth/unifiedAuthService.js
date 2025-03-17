/**
 * Unified Authentication Service
 * 
 * This service integrates the authentication systems of AnythingLLM and LibreChat
 * to provide a seamless authentication experience across both platforms.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { webcrypto } = require('node:crypto');
const { EncryptionManager } = require('../../core/anythingllm/server/utils/EncryptionManager');
const EncryptionMgr = new EncryptionManager();

// Import AnythingLLM models and utilities
const { User: AnythingLLMUser } = require('../../core/anythingllm/server/models/user');
const { SystemSettings } = require('../../core/anythingllm/server/models/systemSettings');

// Import LibreChat models and utilities
const {
  findUser,
  createUser,
  updateUser,
  getUserById,
  generateToken,
} = require('../../core/librechat/api/models/userMethods');
const {
  createToken,
  findToken,
  deleteTokens,
  findSession,
  deleteSession,
  createSession,
  generateRefreshToken,
} = require('../../core/librechat/api/models');

/**
 * Unified User object that combines properties from both systems
 * @typedef {Object} UnifiedUser
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} name - User name
 * @property {string} username - User username
 * @property {string} role - User role
 * @property {string} provider - Authentication provider
 * @property {boolean} emailVerified - Whether email is verified
 * @property {boolean} twoFactorEnabled - Whether 2FA is enabled
 * @property {Object} anythingLLMUser - Original AnythingLLM user object
 * @property {Object} libreChatUser - Original LibreChat user object
 */

/**
 * Generate a unified JWT token that works with both systems
 * @param {UnifiedUser} user - The unified user object
 * @returns {Promise<string>} - JWT token
 */
const generateUnifiedToken = async (user) => {
  // Create a payload that works with both systems
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    // AnythingLLM specific encrypted payload
    p: EncryptionMgr.encrypt(`${process.env.JWT_SECRET}:${process.env.JWT_SECRET}`),
  };

  // Sign with JWT_SECRET that both systems will recognize
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

/**
 * Set authentication tokens for both systems
 * @param {string} userId - User ID
 * @param {Object} res - Express response object
 * @returns {Promise<string>} - JWT token
 */
const setUnifiedAuthTokens = async (userId, res) => {
  try {
    // Get user from LibreChat
    const libreChatUser = await getUserById(userId, '-password -__v -totpSecret');
    
    if (!libreChatUser) {
      throw new Error('User not found');
    }

    // Create a session in LibreChat
    const result = await createSession(userId);
    const session = result.session;
    const refreshToken = result.refreshToken;
    const refreshTokenExpires = session.expiration.getTime();

    // Set refresh token cookie for LibreChat
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(refreshTokenExpires),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Get or create user in AnythingLLM
    let anythingLLMUser = await AnythingLLMUser.get({ email: libreChatUser.email });
    
    if (!anythingLLMUser) {
      // Create user in AnythingLLM if it doesn't exist
      anythingLLMUser = await AnythingLLMUser.create({
        email: libreChatUser.email,
        username: libreChatUser.username || libreChatUser.email,
        name: libreChatUser.name || libreChatUser.username || libreChatUser.email,
        role: libreChatUser.role,
        password: libreChatUser.password, // This should be hashed already
      });
    }

    // Create unified user object
    const unifiedUser = {
      id: userId,
      email: libreChatUser.email,
      name: libreChatUser.name || libreChatUser.username || libreChatUser.email,
      username: libreChatUser.username || libreChatUser.email,
      role: libreChatUser.role,
      provider: libreChatUser.provider || 'local',
      emailVerified: libreChatUser.emailVerified || false,
      twoFactorEnabled: libreChatUser.twoFactorEnabled || false,
      anythingLLMUser,
      libreChatUser,
    };

    // Generate unified token
    const token = await generateUnifiedToken(unifiedUser);

    return token;
  } catch (error) {
    console.error('[setUnifiedAuthTokens] Error in setting authentication tokens:', error);
    throw error;
  }
};

/**
 * Login a user with email and password
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Login result with token and user
 */
const loginUser = async (credentials, res) => {
  const { email, password } = credentials;

  // First, try to find the user in LibreChat
  const libreChatUser = await findUser({ email }, '+password');

  if (!libreChatUser) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, libreChatUser.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Check if 2FA is enabled
  if (libreChatUser.twoFactorEnabled) {
    // Return a temporary token for 2FA verification
    const tempToken = jwt.sign(
      { id: libreChatUser._id, temp: true },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );
    
    return {
      twoFAPending: true,
      tempToken,
      user: {
        id: libreChatUser._id.toString(),
        email: libreChatUser.email,
      },
    };
  }

  // Set auth tokens
  const token = await setUnifiedAuthTokens(libreChatUser._id.toString(), res);

  // Return user info without sensitive data
  const { password: _p, totpSecret: _t, __v, ...safeUser } = libreChatUser.toObject ? 
    libreChatUser.toObject() : libreChatUser;
  
  safeUser.id = safeUser._id.toString();

  return {
    token,
    user: safeUser,
  };
};

/**
 * Register a new user
 * @param {Object} userData - User data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.name - User name
 * @param {string} userData.username - User username
 * @returns {Promise<Object>} - Registration result
 */
const registerUser = async (userData) => {
  const { email, password, name, username } = userData;

  // Check if user exists in LibreChat
  const existingUser = await findUser({ email }, 'email _id');

  if (existingUser) {
    return { 
      status: 409, 
      message: 'User with this email already exists' 
    };
  }

  // Check if multi-user mode is enabled in AnythingLLM
  const multiUserMode = await SystemSettings.isMultiUserMode();
  
  if (!multiUserMode) {
    return { 
      status: 403, 
      message: 'Registration is not allowed in single-user mode' 
    };
  }

  // Determine if this is the first registered user
  const isFirstRegisteredUser = (await findUser({}, 'email')).length === 0;

  // Create salt and hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Create user in LibreChat
  const newUserData = {
    provider: 'local',
    email,
    username: username || email,
    name: name || username || email,
    role: isFirstRegisteredUser ? 'admin' : 'user',
    password: hashedPassword,
    emailVerified: !process.env.EMAIL_VERIFICATION_REQUIRED || false,
  };

  const libreChatUser = await createUser(newUserData);

  // Create user in AnythingLLM
  await AnythingLLMUser.create({
    email,
    username: username || email,
    name: name || username || email,
    role: isFirstRegisteredUser ? 'admin' : 'user',
    password: hashedPassword,
  });

  return {
    status: 200,
    message: 'User registered successfully',
    user: {
      id: libreChatUser._id.toString(),
      email: libreChatUser.email,
      name: libreChatUser.name,
      username: libreChatUser.username,
      role: libreChatUser.role,
    },
  };
};

/**
 * Logout a user
 * @param {Object} req - Express request object
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} - Logout result
 */
const logoutUser = async (req, refreshToken) => {
  try {
    const userId = req.user._id || req.user.id;
    
    // Find and delete LibreChat session
    const session = await findSession({ userId, refreshToken });
    if (session) {
      await deleteSession({ sessionId: session._id });
    }

    // Clear cookies
    req.res.clearCookie('refreshToken');

    return { status: 200, message: 'Logout successful' };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token
 * @returns {Promise<UnifiedUser|null>} - Unified user object or null if invalid
 */
const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // If it's a temporary token for 2FA, return null
    if (decoded.temp) {
      return null;
    }

    // Get user from LibreChat
    const libreChatUser = await getUserById(decoded.id, '-password -__v -totpSecret');
    
    if (!libreChatUser) {
      return null;
    }

    // Get user from AnythingLLM
    const anythingLLMUser = await AnythingLLMUser.get({ email: libreChatUser.email });

    // Create unified user object
    return {
      id: libreChatUser._id.toString(),
      email: libreChatUser.email,
      name: libreChatUser.name || libreChatUser.username || libreChatUser.email,
      username: libreChatUser.username || libreChatUser.email,
      role: libreChatUser.role,
      provider: libreChatUser.provider || 'local',
      emailVerified: libreChatUser.emailVerified || false,
      twoFactorEnabled: libreChatUser.twoFactorEnabled || false,
      anythingLLMUser,
      libreChatUser,
    };
  } catch (error) {
    console.error('[verifyToken] Error verifying token:', error);
    return null;
  }
};

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  verifyToken,
  setUnifiedAuthTokens,
  generateUnifiedToken,
}; 