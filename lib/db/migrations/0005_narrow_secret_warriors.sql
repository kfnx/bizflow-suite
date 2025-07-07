ALTER TABLE `customers` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `delivery_note_items` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `delivery_notes` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `import_items` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `imports` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `invoice_items` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `invoices` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `quotation_items` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `quotations` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `stock_movements` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `suppliers` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `transfer_items` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `transfers` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `warehouse_stocks` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `warehouses` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());