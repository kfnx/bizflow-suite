ALTER TABLE `import_items` MODIFY COLUMN `quantity` int NOT NULL DEFAULT 1;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `price` decimal(15,2) NOT NULL DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `stock_movements` MODIFY COLUMN `warehouse_id_from` varchar(36);