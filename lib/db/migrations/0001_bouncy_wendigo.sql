DROP TABLE `import_items`;--> statement-breakpoint
ALTER TABLE `imports` DROP INDEX `imports_import_number_unique`;--> statement-breakpoint
DROP INDEX `import_number_idx` ON `imports`;--> statement-breakpoint
DROP INDEX `status_idx` ON `imports`;--> statement-breakpoint
ALTER TABLE `imports` ADD `invoice_number` varchar(50);--> statement-breakpoint
ALTER TABLE `imports` ADD `invoice_date` date NOT NULL;--> statement-breakpoint
ALTER TABLE `imports` ADD `product_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `imports` ADD `exchange_rate_rmb` decimal(15,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `imports` ADD `price_rmb` decimal(15,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `imports` ADD `quantity` int NOT NULL;--> statement-breakpoint
ALTER TABLE `imports` ADD CONSTRAINT `fk_imports_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `invoice_number_idx` ON `imports` (`invoice_number`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `imports` (`product_id`);--> statement-breakpoint
ALTER TABLE `imports` DROP COLUMN `import_number`;--> statement-breakpoint
ALTER TABLE `imports` DROP COLUMN `expected_date`;--> statement-breakpoint
ALTER TABLE `imports` DROP COLUMN `subtotal`;--> statement-breakpoint
ALTER TABLE `imports` DROP COLUMN `tax`;--> statement-breakpoint
ALTER TABLE `imports` DROP COLUMN `currency`;--> statement-breakpoint
ALTER TABLE `imports` DROP COLUMN `status`;