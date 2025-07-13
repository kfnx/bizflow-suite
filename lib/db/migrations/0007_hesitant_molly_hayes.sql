CREATE TABLE `import_items` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`import_id` varchar(36) NOT NULL,
	`product_id` varchar(36),
	`price_rmb` decimal(15,2) NOT NULL,
	`quantity` int NOT NULL,
	`total` decimal(15,2) NOT NULL,
	`product_code` varchar(100),
	`product_name` varchar(255),
	`product_description` text,
	`product_category` varchar(100),
	`machine_type_id` varchar(36),
	`unit_of_measure_id` varchar(36),
	`brand_id` varchar(36),
	`model_or_part_number` varchar(100),
	`machine_number` varchar(100),
	`engine_number` varchar(100),
	`item_name` varchar(100),
	`batch_or_lot_number` varchar(100),
	`item_description` varchar(255),
	`serial_number` varchar(100),
	`model` varchar(100),
	`year` int,
	`condition` varchar(50) DEFAULT 'new',
	`engine_model` varchar(100),
	`engine_power` varchar(50),
	`operating_weight` varchar(50),
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `import_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `imports` DROP FOREIGN KEY `fk_imports_product`;
--> statement-breakpoint
DROP INDEX `product_id_idx` ON `imports`;--> statement-breakpoint
ALTER TABLE `imports` ADD `subtotal` decimal(15,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `products` ADD `batch_or_lot_number` varchar(100);--> statement-breakpoint
ALTER TABLE `import_items` ADD CONSTRAINT `fk_import_items_import` FOREIGN KEY (`import_id`) REFERENCES `imports`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `import_items` ADD CONSTRAINT `fk_import_items_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `import_items` ADD CONSTRAINT `fk_import_items_machine_type` FOREIGN KEY (`machine_type_id`) REFERENCES `machine_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `import_items` ADD CONSTRAINT `fk_import_items_unit_of_measure` FOREIGN KEY (`unit_of_measure_id`) REFERENCES `unit_of_measures`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `import_items` ADD CONSTRAINT `fk_import_items_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `import_id_idx` ON `import_items` (`import_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `import_items` (`product_id`);--> statement-breakpoint
ALTER TABLE `imports` DROP COLUMN `product_id`;--> statement-breakpoint
ALTER TABLE `imports` DROP COLUMN `price_rmb`;--> statement-breakpoint
ALTER TABLE `imports` DROP COLUMN `quantity`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `batch_number`;