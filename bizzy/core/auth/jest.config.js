module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/../../core/librechat/api/$1',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  testTimeout: 10000,
}; 