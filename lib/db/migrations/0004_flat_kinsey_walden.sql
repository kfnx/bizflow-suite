ALTER TABLE `products` DROP FOREIGN KEY `fk_products_warehouse`;
--> statement-breakpoint
DROP INDEX `status_idx` ON `products`;--> statement-breakpoint
DROP INDEX `warehouse_id_idx` ON `products`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `quantity`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `status`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `condition`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `warehouse_id`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `import_notes`;