// Temporary build fix - re-export from client file
export type { Permission } from './client';
export { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, hasAnyRole } from './client';

// Stub functions for server-side database operations (will be restored after build fix)
export async function getRolePermissions(_roleId: string): Promise<any[]> {
  throw new Error('Database operations temporarily disabled for build fix');
}

export async function getRoleDetails(_roleId: string): Promise<any> {
  throw new Error('Database operations temporarily disabled for build fix');
}

export async function getUserPermissions(_userId: string): Promise<any[]> {
  throw new Error('Database operations temporarily disabled for build fix');
}

export async function getUserRoles(_userId: string): Promise<string[]> {
  throw new Error('Database operations temporarily disabled for build fix');
}