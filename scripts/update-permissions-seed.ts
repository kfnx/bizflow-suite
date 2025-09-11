// Script to generate updated permissions with resources and actions
import { readFileSync, writeFileSync } from 'fs';

const permissionData = [
  // Users
  {
    resource: 'users',
    action: 'read',
    description: 'View and read user accounts',
  },
  {
    resource: 'users',
    action: 'create',
    description: 'Create new user accounts',
  },
  {
    resource: 'users',
    action: 'update',
    description: 'Edit and update user accounts',
  },
  { resource: 'users', action: 'delete', description: 'Delete user accounts' },

  // Branches
  {
    resource: 'branches',
    action: 'read',
    description: 'View and read branch information',
  },
  {
    resource: 'branches',
    action: 'create',
    description: 'Create new branches',
  },
  {
    resource: 'branches',
    action: 'update',
    description: 'Edit and update branch information',
  },
  { resource: 'branches', action: 'delete', description: 'Delete branches' },

  // Quotations
  {
    resource: 'quotations',
    action: 'read',
    description: 'View and read quotations',
  },
  {
    resource: 'quotations',
    action: 'create',
    description: 'Create new quotations',
  },
  {
    resource: 'quotations',
    action: 'update',
    description: 'Edit and update quotations',
  },
  {
    resource: 'quotations',
    action: 'delete',
    description: 'Delete quotations',
  },
  {
    resource: 'quotations',
    action: 'approve',
    description: 'Approve quotations',
  },

  // Invoices
  {
    resource: 'invoices',
    action: 'read',
    description: 'View and read invoices',
  },
  {
    resource: 'invoices',
    action: 'create',
    description: 'Create new invoices',
  },
  {
    resource: 'invoices',
    action: 'update',
    description: 'Edit and update invoices',
  },
  { resource: 'invoices', action: 'delete', description: 'Delete invoices' },

  // Deliveries
  {
    resource: 'deliveries',
    action: 'read',
    description: 'View and read delivery notes',
  },
  {
    resource: 'deliveries',
    action: 'create',
    description: 'Create new delivery notes',
  },
  {
    resource: 'deliveries',
    action: 'update',
    description: 'Edit and update delivery notes',
  },
  {
    resource: 'deliveries',
    action: 'delete',
    description: 'Delete delivery notes',
  },

  // Imports
  {
    resource: 'imports',
    action: 'read',
    description: 'View and read import records',
  },
  {
    resource: 'imports',
    action: 'create',
    description: 'Create new import records',
  },
  {
    resource: 'imports',
    action: 'update',
    description: 'Edit and update import records',
  },
  {
    resource: 'imports',
    action: 'delete',
    description: 'Delete import records',
  },
  {
    resource: 'imports',
    action: 'verify',
    description: 'Verify and approve imports',
  },

  // Products
  {
    resource: 'products',
    action: 'read',
    description: 'View and read product catalog',
  },
  {
    resource: 'products',
    action: 'create',
    description: 'Create new products',
  },
  {
    resource: 'products',
    action: 'update',
    description: 'Edit and update products',
  },
  { resource: 'products', action: 'delete', description: 'Delete products' },

  // Suppliers
  {
    resource: 'suppliers',
    action: 'read',
    description: 'View and read supplier information',
  },
  {
    resource: 'suppliers',
    action: 'create',
    description: 'Create new suppliers',
  },
  {
    resource: 'suppliers',
    action: 'update',
    description: 'Edit and update suppliers',
  },
  { resource: 'suppliers', action: 'delete', description: 'Delete suppliers' },

  // Customers
  {
    resource: 'customers',
    action: 'read',
    description: 'View and read customer information',
  },
  {
    resource: 'customers',
    action: 'create',
    description: 'Create new customers',
  },
  {
    resource: 'customers',
    action: 'update',
    description: 'Edit and update customers',
  },
  { resource: 'customers', action: 'delete', description: 'Delete customers' },

  // Warehouses
  {
    resource: 'warehouses',
    action: 'read',
    description: 'View and read warehouse information',
  },
  {
    resource: 'warehouses',
    action: 'create',
    description: 'Create new warehouses',
  },
  {
    resource: 'warehouses',
    action: 'update',
    description: 'Edit and update warehouses',
  },
  {
    resource: 'warehouses',
    action: 'delete',
    description: 'Delete warehouses',
  },

  // Transfers
  {
    resource: 'transfers',
    action: 'read',
    description: 'View and read stock transfers',
  },
  {
    resource: 'transfers',
    action: 'create',
    description: 'Create new stock transfers',
  },
  {
    resource: 'transfers',
    action: 'update',
    description: 'Edit and update stock transfers',
  },
  {
    resource: 'transfers',
    action: 'delete',
    description: 'Delete stock transfers',
  },

  // Roles
  {
    resource: 'roles',
    action: 'read',
    description: 'View and read user roles',
  },
  { resource: 'roles', action: 'create', description: 'Create new user roles' },
  {
    resource: 'roles',
    action: 'update',
    description: 'Edit and update user roles',
  },
  { resource: 'roles', action: 'delete', description: 'Delete user roles' },

  // Permissions
  {
    resource: 'permissions',
    action: 'read',
    description: 'View and read permissions',
  },
  {
    resource: 'permissions',
    action: 'create',
    description: 'Create new permissions',
  },
  {
    resource: 'permissions',
    action: 'update',
    description: 'Edit and update permissions',
  },
  {
    resource: 'permissions',
    action: 'delete',
    description: 'Delete permissions',
  },
];

// Generate the permissions array
const permissionsArray = permissionData
  .map(
    ({ resource, action, description }) => `  {
    id: permissionIds.${resource}.${action},
    name: '${resource}:${action}',
    description: '${description}',
    resources: '${resource}',
    actions: '${action}',
  }`,
  )
  .join(',\n');

const newPermissionsSection = `export const permissions = [
${permissionsArray}
];`;

// Read the current file
const currentContent = readFileSync(
  '/home/kafin/bizdocgen/lib/db/seed/permissions.ts',
  'utf8',
);

// Replace the permissions array
const updatedContent = currentContent.replace(
  /export const permissions = \[[\s\S]*?\];/,
  newPermissionsSection,
);

// Write the updated file
writeFileSync(
  '/home/kafin/bizdocgen/lib/db/seed/permissions.ts',
  updatedContent,
);

console.log('✅ Updated permissions seed file with resources and actions');
