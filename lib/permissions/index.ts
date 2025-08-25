import { User } from 'next-auth';

// Define permission types
export type Permission =
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  | 'branches:read'
  | 'branches:create'
  | 'branches:update'
  | 'branches:delete'
  | 'quotations:read'
  | 'quotations:create'
  | 'quotations:update'
  | 'quotations:delete'
  | 'quotations:approve'
  | 'invoices:read'
  | 'invoices:create'
  | 'invoices:update'
  | 'invoices:delete'
  | 'deliveries:read'
  | 'deliveries:create'
  | 'deliveries:update'
  | 'deliveries:delete'
  | 'imports:read'
  | 'imports:create'
  | 'imports:update'
  | 'imports:delete'
  | 'imports:verify'
  | 'products:read'
  | 'products:create'
  | 'products:update'
  | 'products:delete'
  | 'suppliers:read'
  | 'suppliers:create'
  | 'suppliers:update'
  | 'suppliers:delete'
  | 'customers:read'
  | 'customers:create'
  | 'customers:update'
  | 'customers:delete'
  | 'warehouses:read'
  | 'warehouses:create'
  | 'warehouses:update'
  | 'warehouses:delete'
  | 'transfers:read'
  | 'transfers:create'
  | 'transfers:update'
  | 'transfers:delete';

// Role hierarchy and permissions
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  staff: [
    'quotations:read',
    'quotations:create',
    'quotations:update',
    'invoices:read',
    'invoices:create',
    'invoices:update',
    'invoices:read',
    'deliveries:read',
    'deliveries:create',
    'deliveries:update',
    'transfers:read',
    'products:read',
    'customers:read',
    'customers:create',
    'customers:update',
    'customers:delete',
    'warehouses:read',
  ],
  'import-manager': [
    'products:read',
    'warehouses:read',
    'imports:read',
    'imports:create',
    'imports:update',
    'imports:delete',
    'imports:verify',
    'transfers:read',
    'transfers:create',
    'transfers:update',
    'suppliers:read',
  ],
  manager: [
    'users:read',
    'users:create',
    'users:update',
    'branches:read',
    'branches:create',
    'branches:update',
    'quotations:read',
    'quotations:create',
    'quotations:update',
    'quotations:approve',
    'invoices:read',
    'invoices:create',
    'invoices:update',
    'deliveries:read',
    'deliveries:create',
    'deliveries:update',
    'imports:read',
    'imports:create',
    'imports:update',
    'imports:delete',
    'transfers:read',
    'products:read',
    'products:create',
    'products:update',
    'suppliers:read',
    'suppliers:create',
    'suppliers:update',
    'suppliers:delete',
    'customers:read',
    'customers:create',
    'customers:update',
    'customers:delete',
    'warehouses:read',
    'warehouses:create',
    'warehouses:update',
  ],
  director: [
    'users:read',
    'users:create',
    'users:update',
    'branches:read',
    'branches:create',
    'branches:update',
    'branches:delete',
    'quotations:read',
    'quotations:create',
    'quotations:update',
    'quotations:delete',
    'quotations:approve',
    'invoices:read',
    'invoices:create',
    'invoices:update',
    'invoices:delete',
    'deliveries:read',
    'deliveries:create',
    'deliveries:update',
    'deliveries:delete',
    'imports:read',
    'imports:create',
    'imports:update',
    'imports:delete',
    'imports:verify',
    'transfers:read',
    'products:read',
    'products:create',
    'products:update',
    'products:delete',
    'suppliers:read',
    'suppliers:create',
    'suppliers:update',
    'suppliers:delete',
    'customers:read',
    'customers:create',
    'customers:update',
    'customers:delete',
    'warehouses:read',
    'warehouses:create',
    'warehouses:update',
    'warehouses:delete',
  ],
};

// Permission checking utilities
export function hasPermission(user: User, permission: Permission): boolean {
  const isAdmin = user.isAdmin;
  if (isAdmin) return true;

  const userRole = user.role;
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

export function hasAnyPermission(
  user: User,
  permissions: Permission[],
): boolean {
  const isAdmin = user.isAdmin;
  if (isAdmin) return true;

  return permissions.some((permission) => hasPermission(user, permission));
}

export function hasAllPermissions(
  user: User,
  permissions: Permission[],
): boolean {
  const isAdmin = user.isAdmin;
  if (isAdmin) return true;

  const userRole = user.role;
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.every((permission) =>
    rolePermissions.includes(permission),
  );
}

// Role hierarchy for inheritance
export const ROLE_HIERARCHY: Record<string, string[]> = {
  staff: [],
  'import-manager': ['staff'],
  manager: ['staff'],
  director: ['manager', 'import-manager', 'staff'],
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
export function canCreateRole(user: User, targetRole: string): boolean {
  const isAdmin = user.isAdmin;
  if (isAdmin) return true;

  const userRole = user.role;
  const roleOrder = ['staff', 'import-manager', 'manager', 'director'];
  const userRoleIndex = roleOrder.indexOf(userRole);
  const targetRoleIndex = roleOrder.indexOf(targetRole);

  // Directors can create all roles, managers can create staff and import-manager
  if (userRole === 'director') return true;
  if (
    userRole === 'manager' &&
    ['staff', 'import-manager'].includes(targetRole)
  )
    return true;
  if (userRole === 'import-manager' && targetRole === 'staff') return true;

  return userRoleIndex >= targetRoleIndex;
}

// Get available roles for creation based on user's role
export function getAvailableRolesForCreation(
  userRole: string,
  isAdmin: boolean,
): string[] {
  if (isAdmin) return ['staff', 'import-manager', 'manager', 'director'];

  switch (userRole) {
    case 'director':
      return ['staff', 'import-manager', 'manager', 'director'];
    case 'manager':
      return ['staff', 'import-manager', 'manager'];
    case 'import-manager':
      return ['staff', 'import-manager'];
    default:
      return ['staff'];
  }
}
