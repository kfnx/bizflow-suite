/**
 * Utility functions for managing user sessions
 */

import { clearSessionValidationCache } from './authorization';

/**
 * Call this function when user data (role, branch, active status) changes
 * to ensure their session gets re-validated on the next API call
 */
export function invalidateUserSession(userId: string) {
  console.log(`Invalidating session cache for user: ${userId}`);
  clearSessionValidationCache(userId);
}

/**
 * Call this function when multiple users' data changes (e.g., bulk operations)
 * to clear all session validation cache
 */
export function invalidateAllSessions() {
  console.log('Invalidating all session caches');
  clearSessionValidationCache();
}

/**
 * Call this when a branch is deleted to invalidate all sessions for users in that branch
 */
export function invalidateBranchSessions(branchId: string) {
  console.log(`Invalidating session cache for branch: ${branchId}`);
  // For now, clear all cache since we don't store branch mapping
  // In a more sophisticated implementation, we could track users by branch
  clearSessionValidationCache();
}