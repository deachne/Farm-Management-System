// Set up environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret';
process.env.ALLOW_REGISTRATION = 'true';
process.env.NODE_ENV = 'test';

// Suppress console output during tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock EncryptionManager
jest.mock('../../core/anythingllm/server/utils/EncryptionManager', () => {
  return {
    EncryptionManager: jest.fn().mockImplementation(() => {
      return {
        encrypt: jest.fn().mockImplementation((text) => `encrypted-${text}`),
        decrypt: jest.fn().mockImplementation((text) => text.replace('encrypted-', '')),
      };
    }),
  };
}); 