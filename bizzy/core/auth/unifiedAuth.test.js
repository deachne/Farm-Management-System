/**
 * Unified Authentication System Integration Tests
 * 
 * This file contains integration tests for the unified authentication system.
 * It tests the authentication flow between AnythingLLM and LibreChat.
 */

const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const unifiedAuthRoutes = require('./unifiedAuthRoutes');

// Mock dependencies
jest.mock('../../core/anythingllm/server/models/user', () => ({
  User: {
    get: jest.fn().mockImplementation((query) => {
      if (query.email === 'test@example.com') {
        return {
          id: 'anythingllm-user-id',
          email: 'test@example.com',
          name: 'Test User',
          username: 'testuser',
          role: 'user',
        };
      }
      return null;
    }),
    create: jest.fn().mockImplementation((userData) => ({
      id: 'anythingllm-user-id',
      ...userData,
    })),
  },
}));

jest.mock('../../core/anythingllm/server/models/systemSettings', () => ({
  SystemSettings: {
    isMultiUserMode: jest.fn().mockResolvedValue(true),
  },
}));

jest.mock('../../core/librechat/api/models/userMethods', () => ({
  findUser: jest.fn().mockImplementation((query) => {
    if (query.email === 'test@example.com') {
      return {
        _id: 'librechat-user-id',
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser',
        role: 'user',
        password: '$2a$10$XQQUBBBVzZoHwVRxMKdJjeJX/U/CVmvCzjwqIgYdwRbS0SSBwEyLW', // hashed 'password'
        toObject: () => ({
          _id: 'librechat-user-id',
          email: 'test@example.com',
          name: 'Test User',
          username: 'testuser',
          role: 'user',
        }),
      };
    }
    return null;
  }),
  getUserById: jest.fn().mockImplementation((id) => {
    if (id === 'librechat-user-id') {
      return {
        _id: 'librechat-user-id',
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser',
        role: 'user',
        toObject: () => ({
          _id: 'librechat-user-id',
          email: 'test@example.com',
          name: 'Test User',
          username: 'testuser',
          role: 'user',
        }),
      };
    }
    return null;
  }),
  createUser: jest.fn().mockImplementation((userData) => ({
    _id: 'librechat-user-id',
    ...userData,
  })),
  generateToken: jest.fn().mockResolvedValue('mock-jwt-token'),
}));

jest.mock('../../core/librechat/api/models', () => ({
  createSession: jest.fn().mockResolvedValue({
    session: {
      _id: 'session-id',
      expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    refreshToken: 'mock-refresh-token',
  }),
  findSession: jest.fn().mockResolvedValue({
    _id: 'session-id',
    expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }),
  deleteSession: jest.fn().mockResolvedValue(true),
}));

jest.mock('../../core/librechat/api/server/utils', () => ({
  isEnabled: jest.fn().mockReturnValue(true),
}));

jest.mock('../../core/librechat/api/config', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue({
    id: 'librechat-user-id',
    email: 'test@example.com',
    role: 'user',
  }),
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn().mockResolvedValue(true),
  genSaltSync: jest.fn().mockReturnValue('mock-salt'),
  hashSync: jest.fn().mockReturnValue('hashed-password'),
}));

// Create Express app for testing
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/auth', unifiedAuthRoutes);

describe('Unified Authentication System', () => {
  describe('Login', () => {
    it('should login a user with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password',
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token');
      expect(response.body).to.have.property('user');
      expect(response.body.user.email).to.equal('test@example.com');
    });

    it('should return 400 if email or password is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Email and password are required');
    });
  });

  describe('Registration', () => {
    it('should register a new user', async () => {
      // Mock findUser to return null for this test
      require('../../core/librechat/api/models/userMethods').findUser.mockImplementationOnce(() => null);

      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password',
          name: 'New User',
          username: 'newuser',
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('User registered successfully');
    });

    it('should return 400 if email or password is missing', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'newuser@example.com',
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Email and password are required');
    });
  });

  describe('Token Verification', () => {
    it('should verify a valid token', async () => {
      const response = await request(app)
        .get('/auth/verify-token')
        .set('Authorization', 'Bearer mock-jwt-token');

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('valid');
      expect(response.body.valid).to.equal(true);
    });

    it('should return 401 for an invalid token', async () => {
      // Mock verifyToken to return null for this test
      require('jsonwebtoken').verify.mockImplementationOnce(() => null);

      const response = await request(app)
        .get('/auth/verify-token')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('valid');
      expect(response.body.valid).to.equal(false);
    });
  });

  describe('Logout', () => {
    it('should logout a user', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'Bearer mock-jwt-token');

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Logout successful');
    });
  });
}); 