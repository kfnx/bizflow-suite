CREATE TABLE `transfer_items` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`transfer_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity` int NOT NULL,
	`quantity_transferred` int DEFAULT 0,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `transfer_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transfers` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`transfer_number` varchar(50) NOT NULL,
	`warehouse_id_from` varchar(36),
	`warehouse_id_to` varchar(36) NOT NULL,
	`movement_type` varchar(20) NOT NULL,
	`status` varchar(20) DEFAULT 'pending',
	`transfer_date` date NOT NULL,
	`invoice_id` varchar(50),
	`delivery_id` varchar(50),
	`notes` text,
	`created_by` varchar(36) NOT NULL,
	`approved_by` varchar(36),
	`approved_at` timestamp,
	`completed_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transfers_id` PRIMARY KEY(`id`),
	CONSTRAINT `transfers_transfer_number_unique` UNIQUE(`transfer_number`)
);
--> statement-breakpoint
DROP TABLE `stock_movements`;--> statement-breakpoint
ALTER TABLE `imports` ADD `bill_of_lading_number` varchar(50);--> statement-breakpoint
ALTER TABLE `imports` ADD `bill_of_lading_date` date;--> statement-breakpoint
ALTER TABLE `warehouses` ADD `bill_of_lading_number` varchar(100);--> statement-breakpoint
ALTER TABLE `warehouses` ADD `bill_of_lading_date` date;--> statement-breakpoint
ALTER TABLE `transfer_items` ADD CONSTRAINT `fk_transfer_items_transfer` FOREIGN KEY (`transfer_id`) REFERENCES `transfers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transfer_items` ADD CONSTRAINT `fk_transfer_items_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transfers` ADD CONSTRAINT `fk_transfers_warehouse_from` FOREIGN KEY (`warehouse_id_from`) REFERENCES `warehouses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transfers` ADD CONSTRAINT `fk_transfers_warehouse_to` FOREIGN KEY (`warehouse_id_to`) REFERENCES `warehouses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transfers` ADD CONSTRAINT `fk_transfers_created_by` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transfers` ADD CONSTRAINT `fk_transfers_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `transfer_id_idx` ON `transfer_items` (`transfer_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `transfer_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `transfer_number_idx` ON `transfers` (`transfer_number`);--> statement-breakpoint
CREATE INDEX `warehouse_id_from_idx` ON `transfers` (`warehouse_id_from`);--> statement-breakpoint
CREATE INDEX `warehouse_id_to_idx` ON `transfers` (`warehouse_id_to`);--> statement-breakpoint
CREATE INDEX `movement_type_idx` ON `transfers` (`movement_type`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `transfers` (`status`);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `transfers` (`created_by`);