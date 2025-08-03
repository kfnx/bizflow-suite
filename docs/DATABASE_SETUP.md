# MySQL + Drizzle ORM Setup Guide

This guide will help you set up MySQL with Drizzle ORM in your Next.js business document generation application.

## Prerequisites

1. MySQL server installed and running
2. Node.js and pnpm installed
3. Basic knowledge of SQL and TypeScript

## Installation

The required dependencies have already been installed:

```bash
# Core dependencies
pnpm add drizzle-orm mysql2 bcryptjs zod

# Development dependencies
pnpm add -D drizzle-kit @types/mysql tsx
```

## Environment Configuration

Create a `.env.local` file in your project root with the following variables:

```env
# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bizdocgen
```

## Database Setup

1. **Create the database:**

   ```sql
   CREATE DATABASE bizdocgen;
   ```

2. **Generate migrations:**

   ```bash
   pnpm db:generate
   ```

3. **Run migrations:**

   ```bash
   pnpm db:migrate
   ```

4. **Seed the database (optional):**
   ```bash
   pnpm db:seed
   ```

## Database Schema

The application includes the following tables:

### Core Tables

- **users**: User accounts with authentication and roles
- **suppliers**: Supplier information and contact details
- **warehouses**: Warehouse locations and management
- **products**: Product catalog with pricing and supplier relationships

### Document Tables

- **quotations**: Customer quotations with line items
- **quotation_items**: Line items for quotations
- **invoices**: Customer invoices with line items
- **invoice_items**: Line items for invoices
- **delivery_notes**: Delivery documentation
- **delivery_note_items**: Line items for delivery notes

### Inventory Management

- **imports**: Goods received from suppliers
- **import_items**: Line items for imports
- **transfers**: Warehouse-to-warehouse transfers
- **transfer_items**: Line items for transfers

## API Endpoints

### Users

- `GET /api/users` - Get all users (with pagination)
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Suppliers

- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create a new supplier
- `GET /api/suppliers/[id]` - Get supplier by ID
- `PUT /api/suppliers/[id]` - Update supplier
- `DELETE /api/suppliers/[id]` - Delete supplier

### Products

- `GET /api/products` - Get all products (with filters)
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Quotations

- `GET /api/quotations` - Get all quotations (with filters)
- `POST /api/quotations` - Create a new quotation
- `GET /api/quotations/[id]` - Get quotation by ID
- `PUT /api/quotations/[id]` - Update quotation
- `DELETE /api/quotations/[id]` - Delete quotation

### Invoices

- `GET /api/invoices` - Get all invoices (with filters)
- `POST /api/invoices` - Create a new invoice
- `GET /api/invoices/[id]` - Get invoice by ID
- `PUT /api/invoices/[id]` - Update invoice
- `DELETE /api/invoices/[id]` - Delete invoice

### Delivery Notes

- `GET /api/delivery-notes` - Get all delivery notes (with filters)
- `POST /api/delivery-notes` - Create a new delivery note
- `GET /api/delivery-notes/[id]` - Get delivery note by ID
- `PUT /api/delivery-notes/[id]` - Update delivery note
- `DELETE /api/delivery-notes/[id]` - Delete delivery note

### Imports

- `GET /api/imports` - Get all imports (with filters)
- `POST /api/imports` - Create a new import
- `GET /api/imports/[id]` - Get import by ID
- `PUT /api/imports/[id]` - Update import
- `DELETE /api/imports/[id]` - Delete import

### Transfers

- `GET /api/transfers` - Get all transfers (with filters)
- `POST /api/transfers` - Create a new transfer
- `GET /api/transfers/[id]` - Get transfer by ID
- `PUT /api/transfers/[id]` - Update transfer
- `DELETE /api/transfers/[id]` - Delete transfer

## Usage Examples

### Creating a User

```typescript
const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+6281234567890',
    role: 'user',
  }),
});
```

### Creating a Quotation

```typescript
const response = await fetch('/api/quotations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    quotationNumber: 'QT-2024-001',
    customerName: 'PT Customer Pertama',
    customerEmail: 'contact@customerpertama.com',
    customerPhone: '+6281234567897',
    customerAddress: 'Jl. Customer No. 1, Jakarta',
    quotationDate: '2024-01-15',
    validUntil: '2024-02-15',
    items: [
      {
        productId: 'product-1',
        quantity: 1,
        unitPrice: 15000000,
        notes: 'Laptop for office use',
      },
    ],
  }),
});
```

### Creating an Invoice

```typescript
const response = await fetch('/api/invoices', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    invoiceNumber: 'INV-2024-001',
    quotationId: 'quotation-1',
    customerName: 'PT Customer Pertama',
    customerEmail: 'contact@customerpertama.com',
    customerPhone: '+6281234567897',
    customerAddress: 'Jl. Customer No. 1, Jakarta',
    invoiceDate: '2024-01-20',
    dueDate: '2024-02-20',
    paymentTerms: 'Bank Transfer',
    items: [
      {
        productId: 'product-1',
        quantity: 1,
        unitPrice: 15000000,
        notes: 'Laptop for office use',
      },
    ],
  }),
});
```

## Development Commands

- `pnpm db:generate` - Generate new migrations
- `pnpm db:migrate` - Run pending migrations
- `pnpm db:studio` - Open Drizzle Studio (database GUI)
- `pnpm db:seed` - Seed the database with sample data

## Features

- **Type Safety**: Full TypeScript support with Drizzle ORM
- **Relationships**: Proper foreign key relationships between tables
- **Validation**: Zod schemas for API input validation
- **Error Handling**: Comprehensive error handling and proper HTTP status codes
- **Pagination**: Built-in pagination for list endpoints
- **Security**: Password hashing with bcrypt
- **Scalability**: Proper indexing and database optimization
- **Business Logic**: Complete document generation workflow
- **Inventory Management**: Import and transfer functionality

## Business Workflow

1. **Product Management**: Add products with supplier information
2. **Quotation Process**: Create quotations for customers
3. **Invoice Generation**: Convert quotations to invoices
4. **Delivery Management**: Create delivery notes for shipments
5. **Inventory Control**: Manage imports and warehouse transfers

## Troubleshooting

### Common Issues

1. **Connection refused**: Make sure MySQL is running and the connection details are correct
2. **Migration errors**: Check that the database exists and you have proper permissions
3. **Type errors**: Ensure all dependencies are properly installed

### Getting Help

- Check the Drizzle ORM documentation: https://orm.drizzle.team/
- Review the MySQL documentation: https://dev.mysql.com/doc/
- Check the console for detailed error messages

## Next Steps

1. Set up authentication middleware
2. Add more complex business logic
3. Implement document generation (PDF/Excel)
4. Add comprehensive testing
5. Set up production deployment
6. Implement real-time notifications
7. Add reporting and analytics
