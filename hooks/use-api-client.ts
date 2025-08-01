/**
 * React hook for using the API client with automatic session handling
 */

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

import { apiClient } from '@/lib/api-client';

export function useApi() {
  const router = useRouter();

  // Create a custom API client instance that handles session invalidation
  const api = {
    get: async <T>(url: string, options?: RequestInit): Promise<T> => {
      try {
        return await apiClient.get<T>(url, options);
      } catch (error) {
        if (error instanceof Error && error.message.includes('Session expired')) {
          // The API client already handled the signOut, just redirect
          router.push('/login');
        }
        throw error;
      }
    },

    post: async <T>(url: string, body?: any, options?: RequestInit): Promise<T> => {
      try {
        return await apiClient.post<T>(url, body, options);
      } catch (error) {
        if (error instanceof Error && error.message.includes('Session expired')) {
          router.push('/login');
        }
        throw error;
      }
    },

    put: async <T>(url: string, body?: any, options?: RequestInit): Promise<T> => {
      try {
        return await apiClient.put<T>(url, body, options);
      } catch (error) {
        if (error instanceof Error && error.message.includes('Session expired')) {
          router.push('/login');
        }
        throw error;
      }
    },

    delete: async <T>(url: string, options?: RequestInit): Promise<T> => {
      try {
        return await apiClient.delete<T>(url, options);
      } catch (error) {
        if (error instanceof Error && error.message.includes('Session expired')) {
          router.push('/login');
        }
        throw error;
      }
    },
  };

  return api;
}