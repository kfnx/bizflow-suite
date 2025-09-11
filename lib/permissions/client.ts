// Client-side permission utilities (no database access)
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
  | 'imports:approve'
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

// Client-side permission checking (using permissions from session/props)
export function hasPermission(
  userPermissions: Permission[],
  permission: Permission,
  isAdmin?: boolean,
): boolean {
  if (isAdmin) return true;
  return userPermissions.includes(permission);
}

export function hasAnyPermission(
  userPermissions: Permission[],
  permissions: Permission[],
  isAdmin?: boolean,
): boolean {
  if (isAdmin) return true;
  return permissions.some((permission) => userPermissions.includes(permission));
}

export function hasAllPermissions(
  userPermissions: Permission[],
  permissions: Permission[],
  isAdmin?: boolean,
): boolean {
  if (isAdmin) return true;
  return permissions.every((permission) =>
    userPermissions.includes(permission),
  );
}

export function hasRole(
  userRoles: string[],
  roleName: string,
  isAdmin?: boolean,
): boolean {
  if (isAdmin) return true;
  return userRoles.includes(roleName);
}

export function hasAnyRole(
  userRoles: string[],
  roleNames: string[],
  isAdmin?: boolean,
): boolean {
  if (isAdmin) return true;
  return roleNames.some((roleName) => userRoles.includes(roleName));
}
