// Define permission types
export type Permission =
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  | 'approvers:read'
  | 'quotations:read'
  | 'quotations:create'
  | 'quotations:update'
  | 'quotations:delete'
  | 'quotations:approve'
  | 'invoices:read'
  | 'invoices:create'
  | 'invoices:update'
  | 'invoices:delete'
  | 'products:read'
  | 'products:create'
  | 'products:update'
  | 'products:delete'
  | 'warehouses:read'
  | 'warehouses:create'
  | 'warehouses:update'
  | 'warehouses:delete'
  | 'reports:view'
  | 'settings:manage';

// Role hierarchy and permissions
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  staff: [
    'quotations:read',
    'quotations:create',
    'quotations:update',
    'invoices:read',
    'products:read',
    'warehouses:read',
  ],
  manager: [
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'quotations:read',
    'quotations:create',
    'quotations:update',
    'quotations:approve',
    'invoices:read',
    'invoices:create',
    'invoices:update',
    'products:read',
    'products:create',
    'products:update',
    'warehouses:read',
    'warehouses:create',
    'warehouses:update',
    'reports:view',
  ],
  director: [
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'quotations:read',
    'quotations:create',
    'quotations:update',
    'quotations:delete',
    'quotations:approve',
    'invoices:read',
    'invoices:create',
    'invoices:update',
    'invoices:delete',
    'products:read',
    'products:create',
    'products:update',
    'products:delete',
    'warehouses:read',
    'warehouses:create',
    'warehouses:update',
    'warehouses:delete',
    'reports:view',
    'settings:manage',
  ],
};

// Permission checking utilities
export function hasPermission(
  userRole: string,
  permission: Permission,
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

export function hasAnyPermission(
  userRole: string,
  permissions: Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission));
}

export function hasAllPermissions(
  userRole: string,
  permissions: Permission[],
): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission));
}

// Role hierarchy for inheritance
export const ROLE_HIERARCHY: Record<string, string[]> = {
  staff: [],
  manager: ['staff'],
  director: ['manager', 'staff'],
};

export function hasRoleOrHigher(
  userRole: string,
  requiredRole: string,
): boolean {
  if (userRole === requiredRole) return true;

  const hierarchy = ROLE_HIERARCHY[userRole] || [];
  return hierarchy.includes(requiredRole);
}

// Check if user can create a specific role
export function canCreateRole(userRole: string, targetRole: string): boolean {
  const roleOrder = ['staff', 'manager', 'director'];
  const userRoleIndex = roleOrder.indexOf(userRole);
  const targetRoleIndex = roleOrder.indexOf(targetRole);

  // Can only create roles lower than or equal to their own
  return userRoleIndex >= targetRoleIndex;
}

// Get available roles for creation based on user's role
export function getAvailableRolesForCreation(userRole: string): string[] {
  const roleOrder = ['staff', 'manager', 'director'];
  const userRoleIndex = roleOrder.indexOf(userRole);

  return roleOrder.slice(0, userRoleIndex + 1);
}
