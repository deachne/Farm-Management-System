/**
 * User Management Interface Types
 * 
 * This file contains TypeScript types/interfaces for the User Management component.
 */

/**
 * Represents a user in the system with unified properties from both AnythingLLM and LibreChat
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  role: UserRole;
  provider: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLogin?: string;
  status: UserStatus;
  anythingLLMUser?: Record<string, any>;
  libreChatUser?: Record<string, any>;
}

/**
 * Role types for user permissions
 */
export type UserRole = 'admin' | 'user' | 'moderator';

/**
 * User status in the system
 */
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

/**
 * Filter options for the user listing
 */
export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  sortBy?: 'name' | 'email' | 'role' | 'lastLogin' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Form data for creating a new user
 */
export interface CreateUserForm {
  email: string;
  password: string;
  name?: string;
  username?: string;
  role: UserRole;
}

/**
 * Form data for updating an existing user
 */
export interface UpdateUserForm {
  name?: string;
  username?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  password?: string;
  twoFactorEnabled?: boolean;
}

/**
 * Response structure for user management API calls
 */
export interface UserManagementResponse {
  success: boolean;
  message: string;
  data?: User | User[] | null;
  error?: string;
}

/**
 * Pagination parameters for the user list
 */
export interface UserPagination {
  page: number;
  limit: number;
  total: number;
} 