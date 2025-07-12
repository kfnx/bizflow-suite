DROP TABLE `transfers`;--> statement-breakpoint
ALTER TABLE `stock_movements` DROP FOREIGN KEY `fk_stock_movements_warehouse_stock`;
--> statement-breakpoint
ALTER TABLE `stock_movements` DROP FOREIGN KEY `fk_stock_movements_warehouse`;
--> statement-breakpoint
DROP INDEX `warehouse_stock_id_idx` ON `stock_movements`;--> statement-breakpoint
DROP INDEX `warehouse_id_idx` ON `stock_movements`;--> statement-breakpoint
ALTER TABLE `stock_movements` ADD `warehouse_id_from` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `stock_movements` ADD `warehouse_id_to` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `stock_movements` ADD CONSTRAINT `fk_stock_movements_warehouse_from` FOREIGN KEY (`warehouse_id_from`) REFERENCES `warehouses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stock_movements` ADD CONSTRAINT `fk_stock_movements_warehouse_to` FOREIGN KEY (`warehouse_id_to`) REFERENCES `warehouses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `warehouse_id_from_idx` ON `stock_movements` (`warehouse_id_from`);--> statement-breakpoint
CREATE INDEX `warehouse_id_to_idx` ON `stock_movements` (`warehouse_id_to`);--> statement-breakpoint
ALTER TABLE `stock_movements` DROP COLUMN `warehouse_stock_id`;--> statement-breakpoint
ALTER TABLE `stock_movements` DROP COLUMN `warehouse_id`;