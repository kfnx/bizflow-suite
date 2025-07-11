CREATE TABLE `brands` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `brands_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `machine_types` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `machine_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `unit_of_measures` (
	`id` varchar(36) NOT NULL,
	`abbreviation` varchar(10) NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `unit_of_measures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `transfer_items`;--> statement-breakpoint
ALTER TABLE `warehouses` DROP INDEX `warehouses_code_unique`;--> statement-breakpoint
ALTER TABLE `stock_movements` DROP FOREIGN KEY `fk_stock_movements_machine`;
--> statement-breakpoint
ALTER TABLE `warehouse_stocks` DROP FOREIGN KEY `fk_warehouse_stocks_machine`;
--> statement-breakpoint
DROP INDEX `brand_idx` ON `products`;--> statement-breakpoint
DROP INDEX `machine_id_idx` ON `stock_movements`;--> statement-breakpoint
DROP INDEX `machine_id_idx` ON `warehouse_stocks`;--> statement-breakpoint
DROP INDEX `code_idx` ON `warehouses`;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `category` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `machine_type_id` varchar(36);--> statement-breakpoint
ALTER TABLE `products` ADD `unit_of_measure_id` varchar(36);--> statement-breakpoint
ALTER TABLE `products` ADD `brand_id` varchar(36);--> statement-breakpoint
ALTER TABLE `products` ADD `model_number` varchar(100);--> statement-breakpoint
ALTER TABLE `products` ADD `machine_number` varchar(100);--> statement-breakpoint
ALTER TABLE `products` ADD `engine_number` varchar(100);--> statement-breakpoint
ALTER TABLE `products` ADD `item_name` varchar(100);--> statement-breakpoint
ALTER TABLE `products` ADD `batch_number` varchar(100);--> statement-breakpoint
ALTER TABLE `products` ADD `item_description` varchar(255);--> statement-breakpoint
ALTER TABLE `products` ADD `serial_number` varchar(100);--> statement-breakpoint
ALTER TABLE `stock_movements` ADD `product_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `warehouse_stocks` ADD `product_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `warehouses` ADD `manager_id` varchar(36);--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `fk_products_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `fk_products_machine_type` FOREIGN KEY (`machine_type_id`) REFERENCES `machine_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `fk_products_unit_of_measure` FOREIGN KEY (`unit_of_measure_id`) REFERENCES `unit_of_measures`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stock_movements` ADD CONSTRAINT `fk_stock_movements_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `warehouse_stocks` ADD CONSTRAINT `fk_warehouse_stocks_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `warehouses` ADD CONSTRAINT `fk_warehouses_manager` FOREIGN KEY (`manager_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `brand_id_idx` ON `products` (`brand_id`);--> statement-breakpoint
CREATE INDEX `warehouse_id_idx` ON `products` (`warehouse_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `stock_movements` (`product_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `warehouse_stocks` (`product_id`);--> statement-breakpoint
CREATE INDEX `manager_id_idx` ON `warehouses` (`manager_id`);--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `brand`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `unit`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `currency`;--> statement-breakpoint
ALTER TABLE `stock_movements` DROP COLUMN `machine_id`;--> statement-breakpoint
ALTER TABLE `warehouse_stocks` DROP COLUMN `machine_id`;--> statement-breakpoint
ALTER TABLE `warehouse_stocks` DROP COLUMN `last_check`;--> statement-breakpoint
ALTER TABLE `warehouses` DROP COLUMN `code`;--> statement-breakpoint
ALTER TABLE `warehouses` DROP COLUMN `city`;--> statement-breakpoint
ALTER TABLE `warehouses` DROP COLUMN `country`;--> statement-breakpoint
ALTER TABLE `warehouses` DROP COLUMN `manager`;--> statement-breakpoint
ALTER TABLE `warehouses` DROP COLUMN `phone`;