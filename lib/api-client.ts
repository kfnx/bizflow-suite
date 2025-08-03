/**
 * Centralized API client with session validation handling
 */

import { signOut } from '@/lib/auth';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  code?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data: ApiResponse<T> = await response.json().catch(() => ({}));

    // Handle session invalidation
    if (response.status === 401 && data.code === 'SESSION_INVALID') {
      console.log('Session invalid, redirecting to login');
      // Force sign out and redirect to login
      await signOut({ redirectTo: '/login' });
      throw new Error('Session expired - redirecting to login');
    }

    if (!response.ok) {
      throw new Error(
        data.error || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return data as T;
  }

  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, body?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(url: string, body?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    return this.handleResponse<T>(response);
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Export the class for creating custom instances
export { ApiClient };
