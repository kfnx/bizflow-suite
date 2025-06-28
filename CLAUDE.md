# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BizDocGen Santraktor is a business document generation application built for PT San Traktor Indonesia. It's a Next.js application with MySQL database using Drizzle ORM, implementing a complete business document workflow for quotations, invoices, delivery notes, and inventory management.

## Development Commands

### Package Manager
Use `pnpm` for all package management operations.

### Core Development
- `pnpm dev` - Start development server on http://localhost:3000
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format:write` - Format code with Prettier

### Database Operations
- `pnpm db:generate` - Generate new Drizzle migrations
- `pnpm db:migrate` - Run pending migrations
- `pnpm db:push` - Push schema changes directly to database
- `pnpm db:studio` - Open Drizzle Studio (database GUI)
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:reset` - Drop, migrate, and seed database (full reset)
- `pnpm db:drop` - Drop all database tables

### Docker Operations
- `./scripts/docker-setup.sh` - Automated Docker setup with database initialization
- `docker-compose up -d --build` - Build and start all services
- `docker-compose logs -f` - View logs
- `docker-compose down` - Stop services

## Architecture Overview

### Application Structure
- **App Router**: Uses Next.js 14 App Router with TypeScript
- **Layout Groups**: 
  - `(auth)` - Authentication pages (login, register, verification)
  - `(main)` - Main application with sidebar layout
- **Database**: MySQL with Drizzle ORM for type-safe database operations
- **UI Framework**: AlignUI Design System with Radix UI components and Tailwind CSS
- **State Management**: Jotai for global state, component-level state with React hooks

### Database Schema
Complete business document workflow with proper foreign key relationships:

**Core Entities:**
- `users` - User accounts with roles (admin, manager, user)
- `customers` - Customer information
- `suppliers` - Supplier management
- `warehouses` - Warehouse locations
- `products` - Product catalog with supplier relationships

**Document Flow:**
- `quotations` + `quotation_items` - Customer quotations
- `invoices` + `invoice_items` - Invoices (can be generated from quotations)
- `delivery_notes` + `delivery_note_items` - Delivery documentation
- `imports` + `import_items` - Goods received from suppliers
- `transfers` + `transfer_items` - Warehouse-to-warehouse transfers

### Key Components
- **Sidebar Navigation**: `/components/sidebar.tsx` - Main navigation
- **Header Components**: `/components/header.tsx` and `/components/header-mobile.tsx`
- **UI Components**: `/components/ui/` - Reusable UI components based on AlignUI
- **Search System**: `/components/search.tsx` - Global command menu
- **Data Tables**: Uses TanStack Table for data display

## Environment Configuration

Required environment variables (see `DATABASE_SETUP.md` for details):
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Database configuration
- `JWT_SECRET` - For authentication
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET` - NextAuth configuration

## Key Development Patterns

### Database Queries
- Use Drizzle ORM with TypeScript for all database operations
- Schema defined in `/lib/db/schema.ts` with proper relations
- Database connection in `/lib/db/index.ts`

### Styling
- Tailwind CSS with custom AlignUI design system
- Custom color palette and typography defined in `tailwind.config.ts`
- Theme support with next-themes

### API Routes
- RESTful API structure in `/app/api/`
- Zod schemas for validation in `/lib/validations/`
- Proper HTTP status codes and error handling

### Component Development
- Follow existing AlignUI component patterns in `/components/ui/`
- Use TypeScript with proper prop interfaces
- Implement responsive design with mobile-first approach

## Business Logic

The application follows a standard business document workflow:
1. **Product Management** - Add products with supplier information
2. **Quotation Process** - Create quotations for customers with line items
3. **Invoice Generation** - Convert quotations to invoices or create standalone invoices
4. **Delivery Management** - Create delivery notes for shipments
5. **Inventory Control** - Manage imports from suppliers and warehouse transfers

## Testing and Quality

Always run these commands before committing:
- `pnpm lint` - Check for linting errors
- `pnpm build` - Ensure the application builds successfully
- Test database operations with `pnpm db:studio` to verify schema changes

## Docker Environment

The application is fully dockerized with:
- Production build optimization (`output: 'standalone'`)
- MySQL database with initialization scripts
- Environment variable configuration for container deployment
- Development and production profiles in docker-compose.yml

Default seeded users:
- `admin@bizdocgen.com` / `password123` (Admin)
- `manager@bizdocgen.com` / `password123` (Manager)  
- `user@bizdocgen.com` / `password123` (User)