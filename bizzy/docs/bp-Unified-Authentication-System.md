# BP05: Unified Authentication System

## Overview

The Unified Authentication System provides a seamless authentication experience across both AnythingLLM and LibreChat platforms. It integrates the authentication systems of both platforms to allow users to authenticate once and access features from both systems without needing to log in separately.

## Architecture

The Unified Authentication System consists of the following components:

1. **Unified Auth Service**: Core service that handles authentication logic for both systems.
2. **Unified Auth Middleware**: Middleware that validates authentication for both systems.
3. **Unified Auth Controller**: Controllers that handle authentication-related endpoints.
4. **Unified Auth Routes**: Routes that define the authentication-related endpoints.

## Integration Points

### AnythingLLM Integration

- Uses AnythingLLM's user model for user management
- Maintains compatibility with AnythingLLM's JWT token format
- Preserves AnythingLLM's multi-user mode functionality
- Integrates with AnythingLLM's API key system

### LibreChat Integration

- Uses LibreChat's user model as the primary user store
- Leverages LibreChat's session management for refresh tokens
- Supports LibreChat's two-factor authentication
- Maintains compatibility with LibreChat's social login providers

## Authentication Flow

1. **Login**:
   - User provides credentials (email/password)
   - System validates credentials against LibreChat's user store
   - If valid, system creates a session in LibreChat and generates a JWT token
   - System checks if user exists in AnythingLLM, creates if not
   - System returns JWT token and user information

2. **Token Verification**:
   - System verifies JWT token against both AnythingLLM and LibreChat
   - If valid, system returns user information

3. **Logout**:
   - System invalidates session in LibreChat
   - System clears cookies

4. **Registration**:
   - System checks if registration is allowed
   - System creates user in both LibreChat and AnythingLLM
   - System returns success message

5. **Two-Factor Authentication**:
   - If 2FA is enabled, system returns temporary token after login
   - User provides 2FA code
   - System verifies code and issues full JWT token

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

## Configuration

The Unified Authentication System uses the following environment variables:

- `JWT_SECRET`: Secret key for JWT token generation and verification
- `JWT_REFRESH_SECRET`: Secret key for refresh token generation and verification
- `ALLOW_REGISTRATION`: Whether to allow user registration
- `EMAIL_VERIFICATION_REQUIRED`: Whether email verification is required for new users

## Implementation Details

### User Synchronization

The system maintains user data in both AnythingLLM and LibreChat. When a user logs in or registers, the system ensures that the user exists in both systems with consistent information.

### Token Format

The JWT token includes a payload that is compatible with both systems:

```json
{
  "id": "user_id",
  "email": "user_email",
  "role": "user_role",
  "p": "encrypted_payload_for_anythingllm"
}
```

### Session Management

The system uses LibreChat's session management for refresh tokens. When a user logs in, the system creates a session in LibreChat and sets a refresh token cookie. The refresh token can be used to obtain a new JWT token when the current one expires.

### Two-Factor Authentication

The system supports LibreChat's two-factor authentication. If a user has 2FA enabled, they must provide a valid 2FA code after login to obtain a JWT token.

## Security Considerations

- JWT tokens are signed with a secret key and include an expiration time
- Refresh tokens are stored in HTTP-only cookies to prevent XSS attacks
- Passwords are hashed using bcrypt before storage
- Two-factor authentication adds an extra layer of security
- API keys are validated against both systems

## Future Enhancements

- Support for social login providers (Google, GitHub, etc.)
- Enhanced user management features (password reset, email verification, etc.)
- Integration with additional authentication methods (LDAP, OpenID Connect, etc.)
- Improved session management with device tracking and session invalidation
- Enhanced security features (rate limiting, IP blocking, etc.) 