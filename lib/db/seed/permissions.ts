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
    id: 'transfers:delete',
    name: 'Transfers Delete',
    description: 'Transfers Delete',
  },
];

// TODO: complete this
export const rolePermissions = [
  {
    roleId: roleIds.admin,
    permissionId: permissionIds.users.read,
  },
  {
    roleId: roleIds.admin,
    permissionId: permissionIds.users.create,
  },
  {
    roleId: roleIds.admin,
    permissionId: permissionIds.users.update,
  },
  {
    roleId: roleIds.admin,
    permissionId: permissionIds.users.delete,
  },
];

// TODO: complete this
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
    roleId: roleIds.importManager,
  },
];
