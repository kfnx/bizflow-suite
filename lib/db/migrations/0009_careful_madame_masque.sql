ALTER TABLE `import_items` MODIFY COLUMN `price_rmb` decimal(17,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `import_items` MODIFY COLUMN `total` decimal(17,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `imports` MODIFY COLUMN `total` decimal(17,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `invoice_items` MODIFY COLUMN `unit_price` decimal(17,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `invoice_items` MODIFY COLUMN `total` decimal(17,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` MODIFY COLUMN `subtotal` decimal(17,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `invoices` MODIFY COLUMN `tax` decimal(17,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `invoices` MODIFY COLUMN `total` decimal(17,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `price` decimal(17,2) NOT NULL DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `quotation_items` MODIFY COLUMN `unit_price` decimal(17,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `quotation_items` MODIFY COLUMN `total` decimal(17,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `quotations` MODIFY COLUMN `branch_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `quotations` MODIFY COLUMN `subtotal` decimal(17,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `quotations` MODIFY COLUMN `tax` decimal(17,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `quotations` MODIFY COLUMN `total` decimal(17,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `quotations` MODIFY COLUMN `revision_version` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `quotations` MODIFY COLUMN `revision_version` int NOT NULL;