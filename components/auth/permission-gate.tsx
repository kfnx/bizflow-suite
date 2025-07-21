'use client';

import { useSession } from 'next-auth/react';

import { hasPermission, Permission } from '@/lib/permissions';

interface PermissionGateProps {
  children: React.ReactNode;
  permission: Permission;
  fallback?: React.ReactNode;
}

export function PermissionGate({
  children,
  permission,
  fallback = null,
}: PermissionGateProps) {
  const { data: session } = useSession();

  // no session no permission
  const isAuthenticated = session?.user;
  if (!isAuthenticated) {
    return fallback;
  }

  // Admins bypass permission checks
  const isAdmin = session.user.isAdmin;
  if (isAdmin) {
    return children;
  }

  // check authorization
  const isAllowed = hasPermission(session.user.role, permission);
  if (!isAllowed) {
    return fallback;
  }

  return children;
}

interface RoleGateProps {
  children: React.ReactNode;
  role: string;
  fallback?: React.ReactNode;
}

export function RoleGate({ children, role, fallback = null }: RoleGateProps) {
  const { data: session } = useSession();

  if (!session?.user) {
    return fallback;
  }

  if (session.user.role !== role) {
    return fallback;
  }

  return <>{children}</>;
}

interface AnyPermissionGateProps {
  children: React.ReactNode;
  permissions: Permission[];
  fallback?: React.ReactNode;
}

export function AnyPermissionGate({
  children,
  permissions,
  fallback = null,
}: AnyPermissionGateProps) {
  const { data: session } = useSession();

  if (!session?.user) {
    return fallback;
  }

  const hasAny = permissions.some((permission) =>
    hasPermission(session.user.role, permission),
  );

  if (!hasAny) {
    return fallback;
  }

  return <>{children}</>;
}
