# Unified Authentication System

This module provides a unified authentication system for both AnythingLLM and LibreChat. It allows users to authenticate once and access features from both systems without needing to log in separately.

## Features

- Single sign-on for both AnythingLLM and LibreChat
- JWT-based authentication with refresh tokens
- Support for two-factor authentication
- User synchronization between both systems
- Role-based access control
- API key authentication

## Architecture

The Unified Authentication System consists of the following components:

- **Unified Auth Service**: Core service that handles authentication logic for both systems.
- **Unified Auth Middleware**: Middleware that validates authentication for both systems.
- **Unified Auth Controller**: Controllers that handle authentication-related endpoints.
- **Unified Auth Routes**: Routes that define the authentication-related endpoints.

## Usage

### Setup

1. Import the unified authentication module:

```javascript
const unifiedAuth = require('./core/auth');
```

2. Use the authentication routes in your Express app:

```javascript
app.use('/auth', unifiedAuth.routes);
```

3. Use the authentication middleware to protect routes:

```javascript
app.use('/api', unifiedAuth.middleware.unifiedAuthMiddleware, apiRoutes);
```

### Authentication Flow

1. **Login**:

```javascript
// Client-side
const response = await fetch('/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password',
  }),
});

const { token, user } = await response.json();
```

2. **Using the token**:

```javascript
// Client-side
const response = await fetch('/api/resource', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

3. **Refreshing the token**:

```javascript
// Client-side
const response = await fetch('/auth/refresh-token', {
  method: 'POST',
  credentials: 'include', // Important for cookies
});

const { token } = await response.json();
```

## Configuration

The Unified Authentication System uses the following environment variables:

- `JWT_SECRET`: Secret key for JWT token generation and verification
- `JWT_REFRESH_SECRET`: Secret key for refresh token generation and verification
- `ALLOW_REGISTRATION`: Whether to allow user registration
- `EMAIL_VERIFICATION_REQUIRED`: Whether email verification is required for new users

## API Endpoints

### Public Endpoints

- `POST /auth/login`: Login with email and password
- `POST /auth/register`: Register a new user
- `POST /auth/refresh-token`: Refresh JWT token using refresh token
- `POST /auth/verify-2fa`: Verify two-factor authentication code

### Protected Endpoints

- `POST /auth/logout`: Logout user
- `GET /auth/verify-token`: Verify JWT token
- `GET /auth/me`: Get current user information

### Admin Endpoints

- `GET /auth/admin/users`: Get list of users (admin only)

## Testing

There are several ways to run the tests for the unified authentication system:

### Using the test script

The simplest way is to use the provided shell script:

```bash
./run-tests.sh
```

This script will install any necessary dependencies and run the tests.

### Using npm

If you prefer to use npm, you can run:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Using Jest directly

You can also run Jest directly:

```bash
npx jest --config jest.config.js
```

### Test Coverage

The tests cover the following functionality:

- User login with valid and invalid credentials
- User registration with valid and invalid data
- Token verification
- Logout functionality
- Two-factor authentication
- API key validation
- Role-based access control

## Documentation

For more detailed documentation, see [BP05-Unified-Authentication-System.md](../../docs/bp05-Unified-Authentication-System.md). 