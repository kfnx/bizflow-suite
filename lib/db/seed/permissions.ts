import { userIds } from './users';

export const roleIds = {
  admin: 'admin',
  staff: 'staff',
  manager: 'manager',
  importManager: 'import-manager',
  director: 'director',
};

export const roles = [
  {
    id: roleIds.admin,
    name: 'Admin',
    description: 'Admin',
  },
  {
    id: roleIds.staff,
    name: 'Staff',
    description: 'Staff',
  },
  {
    id: roleIds.manager,
    name: 'Manager',
    description: 'Manager',
  },
  {
    id: roleIds.importManager,
    name: 'Import Manager',
    description: 'Import Manager',
  },
  {
    id: roleIds.director,
    name: 'Director',
  },
];

export const permissionIds = {
  users: {
    read: 'users:read',
    create: 'users:create',
    update: 'users:update',
    delete: 'users:delete',
  },
  branches: {
    read: 'branches:read',
    create: 'branches:create',
    update: 'branches:update',
    delete: 'branches:delete',
  },
  permissions: {
    read: 'permissions:read',
    create: 'permissions:create',
    update: 'permissions:update',
    delete: 'permissions:delete',
  },
  roles: {
    read: 'roles:read',
    create: 'roles:create',
    update: 'roles:update',
    delete: 'roles:delete',
  },
  quotations: {
    read: 'quotations:read',
    create: 'quotations:create',
    update: 'quotations:update',
    delete: 'quotations:delete',
    approve: 'quotations:approve',
  },
  invoices: {
    read: 'invoices:read',
    create: 'invoices:create',
    update: 'invoices:update',
    delete: 'invoices:delete',
  },
  deliveries: {
    read: 'deliveries:read',
    create: 'deliveries:create',
    update: 'deliveries:update',
    delete: 'deliveries:delete',
  },
  imports: {
    read: 'imports:read',
    create: 'imports:create',
    update: 'imports:update',
    delete: 'imports:delete',
    verify: 'imports:verify',
  },
  products: {
    read: 'products:read',
    create: 'products:create',
    update: 'products:update',
    delete: 'products:delete',
  },
  suppliers: {
    read: 'suppliers:read',
    create: 'suppliers:create',
    update: 'suppliers:update',
    delete: 'suppliers:delete',
  },
  customers: {
    read: 'customers:read',
    create: 'customers:create',
    update: 'customers:update',
    delete: 'customers:delete',
  },
  warehouses: {
    read: 'warehouses:read',
    create: 'warehouses:create',
    update: 'warehouses:update',
    delete: 'warehouses:delete',
  },
  transfers: {
    read: 'transfers:read',
    create: 'transfers:create',
    update: 'transfers:update',
    delete: 'transfers:delete',
  },
};

export const permissions = [
  {
    id: permissionIds.users.read,
    name: 'Users Read',
    description: 'Users Read',
  },
  {
    id: permissionIds.users.create,
    name: 'Users Create',
    description: 'Users Create',
  },
  {
    id: permissionIds.users.update,
    name: 'Users Update',
    description: 'Users Update',
  },
  {
    id: permissionIds.users.delete,
    name: 'Users Delete',
    description: 'Users Delete',
  },
  {
    id: permissionIds.branches.read,
    name: 'Branches Read',
    description: 'Branches Read',
  },
  {
    id: permissionIds.branches.create,
    name: 'Branches Create',
    description: 'Branches Create',
  },
  {
    id: permissionIds.branches.update,
    name: 'Branches Update',
    description: 'Branches Update',
  },
  {
    id: permissionIds.branches.delete,
    name: 'Branches Delete',
    description: 'Branches Delete',
  },
  {
    id: permissionIds.quotations.read,
    name: 'Quotations Read',
    description: 'Quotations Read',
  },
  {
    id: permissionIds.quotations.create,
    name: 'Quotations Create',
    description: 'Quotations Create',
  },
  {
    id: permissionIds.quotations.update,
    name: 'Quotations Update',
    description: 'Quotations Update',
  },
  {
    id: permissionIds.quotations.delete,
    name: 'Quotations Delete',
    description: 'Quotations Delete',
  },
  {
    id: permissionIds.quotations.approve,
    name: 'Quotations Approve',
    description: 'Quotations Approve',
  },
  {
    id: permissionIds.invoices.read,
    name: 'Invoices Read',
    description: 'Invoices Read',
  },
  {
    id: permissionIds.invoices.create,
    name: 'Invoices Create',
    description: 'Invoices Create',
  },
  {
    id: permissionIds.invoices.update,
    name: 'Invoices Update',
    description: 'Invoices Update',
  },
  {
    id: permissionIds.invoices.delete,
    name: 'Invoices Delete',
    description: 'Invoices Delete',
  },
  {
    id: permissionIds.deliveries.read,
    name: 'Deliveries Read',
    description: 'Deliveries Read',
  },
  {
    id: permissionIds.deliveries.create,
    name: 'Deliveries Create',
    description: 'Deliveries Create',
  },
  {
    id: permissionIds.deliveries.update,
    name: 'Deliveries Update',
    description: 'Deliveries Update',
  },
  {
    id: permissionIds.deliveries.delete,
    name: 'Deliveries Delete',
    description: 'Deliveries Delete',
  },
  {
    id: permissionIds.imports.read,
    name: 'Imports Read',
    description: 'Imports Read',
  },
  {
    id: permissionIds.imports.create,
    name: 'Imports Create',
    description: 'Imports Create',
  },
  {
    id: permissionIds.imports.update,
    name: 'Imports Update',
    description: 'Imports Update',
  },
  {
    id: permissionIds.imports.delete,
    name: 'Imports Delete',
    description: 'Imports Delete',
  },
  {
    id: permissionIds.imports.verify,
    name: 'Imports Verify',
    description: 'Imports Verify',
  },
  {
    id: permissionIds.products.read,
    name: 'Products Read',
    description: 'Products Read',
  },
  {
    id: permissionIds.products.create,
    name: 'Products Create',
    description: 'Products Create',
  },
  {
    id: permissionIds.products.update,
    name: 'Products Update',
    description: 'Products Update',
  },
  {
    id: permissionIds.products.delete,
    name: 'Products Delete',
    description: 'Products Delete',
  },
  {
    id: permissionIds.suppliers.read,
    name: 'Suppliers Read',
    description: 'Suppliers Read',
  },
  {
    id: permissionIds.suppliers.create,
    name: 'Suppliers Create',
    description: 'Suppliers Create',
  },
  {
    id: permissionIds.suppliers.update,
    name: 'Suppliers Update',
    description: 'Suppliers Update',
  },
  {
    id: permissionIds.suppliers.delete,
    name: 'Suppliers Delete',
    description: 'Suppliers Delete',
  },
  {
    id: permissionIds.customers.read,
    name: 'Customers Read',
    description: 'Customers Read',
  },
  {
    id: permissionIds.customers.create,
    name: 'Customers Create',
    description: 'Customers Create',
  },
  {
    id: permissionIds.customers.update,
    name: 'Customers Update',
    description: 'Customers Update',
  },
  {
    id: permissionIds.customers.delete,
    name: 'Customers Delete',
    description: 'Customers Delete',
  },
  {
    id: permissionIds.warehouses.read,
    name: 'Warehouses Read',
    description: 'Warehouses Read',
  },
  {
    id: permissionIds.warehouses.create,
    name: 'Warehouses Create',
    description: 'Warehouses Create',
  },
  {
    id: permissionIds.warehouses.update,
    name: 'Warehouses Update',
    description: 'Warehouses Update',
  },
  {
    id: permissionIds.warehouses.delete,
    name: 'Warehouses Delete',
    description: 'Warehouses Delete',
  },
  {
    id: permissionIds.transfers.read,
    name: 'Transfers Read',
    description: 'Transfers Read',
  },
  {
    id: permissionIds.transfers.create,
    name: 'Transfers Create',
    description: 'Transfers Create',
  },
  {
    id: permissionIds.transfers.update,
    name: 'Transfers Update',
    description: 'Transfers Update',
  },
  {
    id: permissionIds.transfers.delete,
    name: 'Transfers Delete',
    description: 'Transfers Delete',
  },
  // Roles permissions
  {
    id: permissionIds.roles.read,
    name: 'Roles Read',
    description: 'Read roles',
  },
  {
    id: permissionIds.roles.create,
    name: 'Roles Create',
    description: 'Create roles',
  },
  {
    id: permissionIds.roles.update,
    name: 'Roles Update',
    description: 'Update roles',
  },
  {
    id: permissionIds.roles.delete,
    name: 'Roles Delete',
    description: 'Delete roles',
  },
  // Permissions permissions
  {
    id: permissionIds.permissions.read,
    name: 'Permissions Read',
    description: 'Read permissions',
  },
  {
    id: permissionIds.permissions.create,
    name: 'Permissions Create',
    description: 'Create permissions',
  },
  {
    id: permissionIds.permissions.update,
    name: 'Permissions Update',
    description: 'Update permissions',
  },
  {
    id: permissionIds.permissions.delete,
    name: 'Permissions Delete',
    description: 'Delete permissions',
  },
];

// Complete role permissions mapping
export const rolePermissions = [
  // Admin - Full permissions for everything
  { roleId: roleIds.admin, permissionId: permissionIds.users.read },
  { roleId: roleIds.admin, permissionId: permissionIds.users.create },
  { roleId: roleIds.admin, permissionId: permissionIds.users.update },
  { roleId: roleIds.admin, permissionId: permissionIds.users.delete },
  { roleId: roleIds.admin, permissionId: permissionIds.branches.read },
  { roleId: roleIds.admin, permissionId: permissionIds.branches.create },
  { roleId: roleIds.admin, permissionId: permissionIds.branches.update },
  { roleId: roleIds.admin, permissionId: permissionIds.branches.delete },
  { roleId: roleIds.admin, permissionId: permissionIds.roles.read },
  { roleId: roleIds.admin, permissionId: permissionIds.roles.create },
  { roleId: roleIds.admin, permissionId: permissionIds.roles.update },
  { roleId: roleIds.admin, permissionId: permissionIds.roles.delete },
  { roleId: roleIds.admin, permissionId: permissionIds.permissions.read },
  { roleId: roleIds.admin, permissionId: permissionIds.permissions.create },
  { roleId: roleIds.admin, permissionId: permissionIds.permissions.update },
  { roleId: roleIds.admin, permissionId: permissionIds.permissions.delete },
  { roleId: roleIds.admin, permissionId: permissionIds.quotations.read },
  { roleId: roleIds.admin, permissionId: permissionIds.quotations.create },
  { roleId: roleIds.admin, permissionId: permissionIds.quotations.update },
  { roleId: roleIds.admin, permissionId: permissionIds.quotations.delete },
  { roleId: roleIds.admin, permissionId: permissionIds.quotations.approve },
  { roleId: roleIds.admin, permissionId: permissionIds.invoices.read },
  { roleId: roleIds.admin, permissionId: permissionIds.invoices.create },
  { roleId: roleIds.admin, permissionId: permissionIds.invoices.update },
  { roleId: roleIds.admin, permissionId: permissionIds.invoices.delete },
  { roleId: roleIds.admin, permissionId: permissionIds.deliveries.read },
  { roleId: roleIds.admin, permissionId: permissionIds.deliveries.create },
  { roleId: roleIds.admin, permissionId: permissionIds.deliveries.update },
  { roleId: roleIds.admin, permissionId: permissionIds.deliveries.delete },
  { roleId: roleIds.admin, permissionId: permissionIds.imports.read },
  { roleId: roleIds.admin, permissionId: permissionIds.imports.create },
  { roleId: roleIds.admin, permissionId: permissionIds.imports.update },
  { roleId: roleIds.admin, permissionId: permissionIds.imports.delete },
  { roleId: roleIds.admin, permissionId: permissionIds.imports.verify },
  { roleId: roleIds.admin, permissionId: permissionIds.products.read },
  { roleId: roleIds.admin, permissionId: permissionIds.products.create },
  { roleId: roleIds.admin, permissionId: permissionIds.products.update },
  { roleId: roleIds.admin, permissionId: permissionIds.products.delete },
  { roleId: roleIds.admin, permissionId: permissionIds.suppliers.read },
  { roleId: roleIds.admin, permissionId: permissionIds.suppliers.create },
  { roleId: roleIds.admin, permissionId: permissionIds.suppliers.update },
  { roleId: roleIds.admin, permissionId: permissionIds.suppliers.delete },
  { roleId: roleIds.admin, permissionId: permissionIds.customers.read },
  { roleId: roleIds.admin, permissionId: permissionIds.customers.create },
  { roleId: roleIds.admin, permissionId: permissionIds.customers.update },
  { roleId: roleIds.admin, permissionId: permissionIds.customers.delete },
  { roleId: roleIds.admin, permissionId: permissionIds.warehouses.read },
  { roleId: roleIds.admin, permissionId: permissionIds.warehouses.create },
  { roleId: roleIds.admin, permissionId: permissionIds.warehouses.update },
  { roleId: roleIds.admin, permissionId: permissionIds.warehouses.delete },
  { roleId: roleIds.admin, permissionId: permissionIds.transfers.read },
  { roleId: roleIds.admin, permissionId: permissionIds.transfers.create },
  { roleId: roleIds.admin, permissionId: permissionIds.transfers.update },
  { roleId: roleIds.admin, permissionId: permissionIds.transfers.delete },

  // Manager - Business operations permissions
  { roleId: roleIds.manager, permissionId: permissionIds.quotations.read },
  { roleId: roleIds.manager, permissionId: permissionIds.quotations.create },
  { roleId: roleIds.manager, permissionId: permissionIds.quotations.update },
  { roleId: roleIds.manager, permissionId: permissionIds.quotations.approve },
  { roleId: roleIds.manager, permissionId: permissionIds.invoices.read },
  { roleId: roleIds.manager, permissionId: permissionIds.invoices.create },
  { roleId: roleIds.manager, permissionId: permissionIds.invoices.update },
  { roleId: roleIds.manager, permissionId: permissionIds.deliveries.read },
  { roleId: roleIds.manager, permissionId: permissionIds.deliveries.create },
  { roleId: roleIds.manager, permissionId: permissionIds.deliveries.update },
  { roleId: roleIds.manager, permissionId: permissionIds.products.read },
  { roleId: roleIds.manager, permissionId: permissionIds.products.create },
  { roleId: roleIds.manager, permissionId: permissionIds.products.update },
  { roleId: roleIds.manager, permissionId: permissionIds.suppliers.read },
  { roleId: roleIds.manager, permissionId: permissionIds.customers.read },
  { roleId: roleIds.manager, permissionId: permissionIds.customers.create },
  { roleId: roleIds.manager, permissionId: permissionIds.customers.update },
  { roleId: roleIds.manager, permissionId: permissionIds.warehouses.read },
  { roleId: roleIds.manager, permissionId: permissionIds.transfers.read },
  { roleId: roleIds.manager, permissionId: permissionIds.transfers.create },
  { roleId: roleIds.manager, permissionId: permissionIds.transfers.update },

  // Import Manager - Import and warehouse management
  { roleId: roleIds.importManager, permissionId: permissionIds.imports.read },
  { roleId: roleIds.importManager, permissionId: permissionIds.imports.create },
  { roleId: roleIds.importManager, permissionId: permissionIds.imports.update },
  { roleId: roleIds.importManager, permissionId: permissionIds.imports.verify },
  { roleId: roleIds.importManager, permissionId: permissionIds.products.read },
  { roleId: roleIds.importManager, permissionId: permissionIds.products.create },
  { roleId: roleIds.importManager, permissionId: permissionIds.products.update },
  { roleId: roleIds.importManager, permissionId: permissionIds.suppliers.read },
  { roleId: roleIds.importManager, permissionId: permissionIds.warehouses.read },
  { roleId: roleIds.importManager, permissionId: permissionIds.transfers.read },
  { roleId: roleIds.importManager, permissionId: permissionIds.transfers.create },
  { roleId: roleIds.importManager, permissionId: permissionIds.transfers.update },

  // Director - High-level approvals and reports
  { roleId: roleIds.director, permissionId: permissionIds.quotations.read },
  { roleId: roleIds.director, permissionId: permissionIds.quotations.approve },
  { roleId: roleIds.director, permissionId: permissionIds.invoices.read },
  { roleId: roleIds.director, permissionId: permissionIds.deliveries.read },
  { roleId: roleIds.director, permissionId: permissionIds.imports.read },
  { roleId: roleIds.director, permissionId: permissionIds.products.read },
  { roleId: roleIds.director, permissionId: permissionIds.suppliers.read },
  { roleId: roleIds.director, permissionId: permissionIds.customers.read },
  { roleId: roleIds.director, permissionId: permissionIds.warehouses.read },
  { roleId: roleIds.director, permissionId: permissionIds.transfers.read },

  // Staff - Limited read permissions
  { roleId: roleIds.staff, permissionId: permissionIds.quotations.read },
  { roleId: roleIds.staff, permissionId: permissionIds.quotations.create },
  { roleId: roleIds.staff, permissionId: permissionIds.invoices.read },
  { roleId: roleIds.staff, permissionId: permissionIds.deliveries.read },
  { roleId: roleIds.staff, permissionId: permissionIds.products.read },
  { roleId: roleIds.staff, permissionId: permissionIds.suppliers.read },
  { roleId: roleIds.staff, permissionId: permissionIds.customers.read },
  { roleId: roleIds.staff, permissionId: permissionIds.warehouses.read },
];

// Complete user role assignments
export const userRoles = [
  {
    userId: userIds.admin_ho_jakarta,
    roleId: roleIds.admin,
  },
  {
    userId: userIds.manager_kendari,
    roleId: roleIds.manager,
  },
  {
    userId: userIds.staff_pekanbaru,
    roleId: roleIds.staff,
  },
  {
    userId: userIds.user4, // Director
    roleId: roleIds.director,
  },
  {
    userId: userIds.user5, // Staff
    roleId: roleIds.staff,
  },
  {
    userId: userIds.user6, // Import Manager
    roleId: roleIds.importManager,
  },
  {
    userId: userIds.user7, // Inactive Staff
    roleId: roleIds.staff,
  },
];
