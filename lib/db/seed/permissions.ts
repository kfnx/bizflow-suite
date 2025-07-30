import { userIds } from './users';

export const roles = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Admin',
  },
  {
    id: 'staff',
    name: 'Staff',
    description: 'Staff',
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Manager',
  },
  {
    id: 'import-manager',
    name: 'Import Manager',
    description: 'Import Manager',
  },
  {
    id: 'director',
    name: 'Director',
  },
];

// Permissions table
export const permission = [
  { id: 'users:read', name: 'Users Read', description: 'Users Read' },
  { id: 'users:create', name: 'Users Create', description: 'Users Create' },
  { id: 'users:update', name: 'Users Update', description: 'Users Update' },
  { id: 'users:delete', name: 'Users Delete', description: 'Users Delete' },
  { id: 'branches:read', name: 'Branches Read', description: 'Branches Read' },
  {
    id: 'branches:create',
    name: 'Branches Create',
    description: 'Branches Create',
  },
  {
    id: 'branches:update',
    name: 'Branches Update',
    description: 'Branches Update',
  },
  {
    id: 'branches:delete',
    name: 'Branches Delete',
    description: 'Branches Delete',
  },
  {
    id: 'quotations:read',
    name: 'Quotations Read',
    description: 'Quotations Read',
  },
  {
    id: 'quotations:create',
    name: 'Quotations Create',
    description: 'Quotations Create',
  },
  {
    id: 'quotations:update',
    name: 'Quotations Update',
    description: 'Quotations Update',
  },
  {
    id: 'quotations:delete',
    name: 'Quotations Delete',
    description: 'Quotations Delete',
  },
  {
    id: 'quotations:approve',
    name: 'Quotations Approve',
    description: 'Quotations Approve',
  },
  { id: 'invoices:read', name: 'Invoices Read', description: 'Invoices Read' },
  {
    id: 'invoices:create',
    name: 'Invoices Create',
    description: 'Invoices Create',
  },
  {
    id: 'invoices:update',
    name: 'Invoices Update',
    description: 'Invoices Update',
  },
  {
    id: 'invoices:delete',
    name: 'Invoices Delete',
    description: 'Invoices Delete',
  },
  {
    id: 'deliveries:read',
    name: 'Deliveries Read',
    description: 'Deliveries Read',
  },
  {
    id: 'deliveries:create',
    name: 'Deliveries Create',
    description: 'Deliveries Create',
  },
  {
    id: 'deliveries:update',
    name: 'Deliveries Update',
    description: 'Deliveries Update',
  },
  {
    id: 'deliveries:delete',
    name: 'Deliveries Delete',
    description: 'Deliveries Delete',
  },
  { id: 'imports:read', name: 'Imports Read', description: 'Imports Read' },
  {
    id: 'imports:create',
    name: 'Imports Create',
    description: 'Imports Create',
  },
  {
    id: 'imports:update',
    name: 'Imports Update',
    description: 'Imports Update',
  },
  {
    id: 'imports:delete',
    name: 'Imports Delete',
    description: 'Imports Delete',
  },
  {
    id: 'imports:verify',
    name: 'Imports Verify',
    description: 'Imports Verify',
  },
  { id: 'products:read', name: 'Products Read', description: 'Products Read' },
  {
    id: 'products:create',
    name: 'Products Create',
    description: 'Products Create',
  },
  {
    id: 'products:update',
    name: 'Products Update',
    description: 'Products Update',
  },
  {
    id: 'products:delete',
    name: 'Products Delete',
    description: 'Products Delete',
  },
  {
    id: 'suppliers:read',
    name: 'Suppliers Read',
    description: 'Suppliers Read',
  },
  {
    id: 'suppliers:create',
    name: 'Suppliers Create',
    description: 'Suppliers Create',
  },
  {
    id: 'suppliers:update',
    name: 'Suppliers Update',
    description: 'Suppliers Update',
  },
  {
    id: 'suppliers:delete',
    name: 'Suppliers Delete',
    description: 'Suppliers Delete',
  },
  {
    id: 'customers:read',
    name: 'Customers Read',
    description: 'Customers Read',
  },
  {
    id: 'customers:create',
    name: 'Customers Create',
    description: 'Customers Create',
  },
  {
    id: 'customers:update',
    name: 'Customers Update',
    description: 'Customers Update',
  },
  {
    id: 'customers:delete',
    name: 'Customers Delete',
    description: 'Customers Delete',
  },
  {
    id: 'warehouses:read',
    name: 'Warehouses Read',
    description: 'Warehouses Read',
  },
  {
    id: 'warehouses:create',
    name: 'Warehouses Create',
    description: 'Warehouses Create',
  },
  {
    id: 'warehouses:update',
    name: 'Warehouses Update',
    description: 'Warehouses Update',
  },
  {
    id: 'warehouses:delete',
    name: 'Warehouses Delete',
    description: 'Warehouses Delete',
  },
  {
    id: 'transfers:read',
    name: 'Transfers Read',
    description: 'Transfers Read',
  },
  {
    id: 'transfers:create',
    name: 'Transfers Create',
    description: 'Transfers Create',
  },
  {
    id: 'transfers:update',
    name: 'Transfers Update',
    description: 'Transfers Update',
  },
  {
    id: 'transfers:delete',
    name: 'Transfers Delete',
    description: 'Transfers Delete',
  },
];

export const rolePermissions = [
  {
    roleId: roles.find((role) => role.id === 'admin')?.id,
    permissionId: permission.find(
      (permission) => permission.id === 'users:read',
    )?.id,
  },
  {
    roleId: roles.find((role) => role.id === 'admin')?.id,
    permissionId: permission.find(
      (permission) => permission.id === 'users:create',
    )?.id,
  },
  {
    roleId: roles.find((role) => role.id === 'admin')?.id,
    permissionId: permission.find(
      (permission) => permission.id === 'users:update',
    )?.id,
  },
  {
    roleId: roles.find((role) => role.id === 'admin')?.id,
    permissionId: permission.find(
      (permission) => permission.id === 'users:delete',
    )?.id,
  },
];

export const userRoles = [
  {
    userId: userIds.admin_ho_jakarta,
    roleId: roles.find((role) => role.id === 'admin')?.id,
  },
  {
    userId: userIds.manager_kendari,
    roleId: roles.find((role) => role.id === 'manager')?.id,
  },
  {
    userId: userIds.staff_pekanbaru,
    roleId: roles.find((role) => role.id === 'import-manager')?.id,
  },
];
