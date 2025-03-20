/**
 * User Management Service
 * 
 * This service handles API interactions for user management operations.
 * It communicates with the unified authentication API to perform CRUD operations.
 */

import { 
  User, 
  UserFilters, 
  CreateUserForm, 
  UpdateUserForm, 
  UserManagementResponse,
  UserPagination 
} from './types';

const API_BASE_URL = '/api/v1';

/**
 * Fetches users with optional filtering and pagination
 */
export const getUsers = async (
  filters?: UserFilters,
  pagination?: Partial<UserPagination>
): Promise<{users: User[], pagination: UserPagination}> => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filter parameters if provided
    if (filters) {
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortDirection) queryParams.append('sortDirection', filters.sortDirection);
    }
    
    // Add pagination parameters if provided
    if (pagination) {
      if (pagination.page) queryParams.append('page', pagination.page.toString());
      if (pagination.limit) queryParams.append('limit', pagination.limit.toString());
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/admin/users${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    }
    
    const data = await response.json();
    return {
      users: data.data || [],
      pagination: {
        page: data.pagination?.page || 1,
        limit: data.pagination?.limit || 10,
        total: data.pagination?.total || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Fetches a single user by ID
 */
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

/**
 * Creates a new user
 */
export const createUser = async (userData: CreateUserForm): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create user');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Updates an existing user
 */
export const updateUser = async (userId: string, userData: UpdateUserForm): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

/**
 * Deletes a user
 */
export const deleteUser = async (userId: string): Promise<UserManagementResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

/**
 * Changes user status (activate/deactivate/suspend)
 */
export const changeUserStatus = async (userId: string, status: string): Promise<User> => {
  return updateUser(userId, { status: status as any });
};

/**
 * Reset user password (admin function)
 */
export const resetUserPassword = async (userId: string, newPassword: string): Promise<UserManagementResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ password: newPassword }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to reset password');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error resetting password for user ${userId}:`, error);
    throw error;
  }
}; 