'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { hasPermission, hasRole, hasAnyPermission, Permission } from '@/lib/permissions';

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
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkPermission() {
      if (!session?.user) {
        setIsAllowed(false);
        return;
      }

      // Admins bypass permission checks
      if (session.user.isAdmin) {
        setIsAllowed(true);
        return;
      }

      // Check permission asynchronously
      const allowed = await hasPermission(session.user, permission);
      setIsAllowed(allowed);
    }

    checkPermission();
  }, [session, permission]);

  // Show fallback while loading or if not authenticated
  if (!session?.user || isAllowed === null || !isAllowed) {
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
  const [hasRoleAccess, setHasRoleAccess] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkRole() {
      if (!session?.user) {
        setHasRoleAccess(false);
        return;
      }

      // Admins bypass role checks
      if (session.user.isAdmin) {
        setHasRoleAccess(true);
        return;
      }

      // Check role asynchronously
      const hasAccess = await hasRole(session.user, role);
      setHasRoleAccess(hasAccess);
    }

    checkRole();
  }, [session, role]);

  // Show fallback while loading or if not authorized
  if (!session?.user || hasRoleAccess === null || !hasRoleAccess) {
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
  const [hasAny, setHasAny] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkPermissions() {
      if (!session?.user) {
        setHasAny(false);
        return;
      }

      // Admins bypass permission checks
      if (session.user.isAdmin) {
        setHasAny(true);
        return;
      }

      // Check permissions asynchronously
       const result = await hasAnyPermission(session.user, permissions);
       setHasAny(result);
    }

    checkPermissions();
  }, [session, permissions]);

  // Show fallback while loading or if not authorized
  if (!session?.user || hasAny === null || !hasAny) {
    return fallback;
  }

  return <>{children}</>;
}
