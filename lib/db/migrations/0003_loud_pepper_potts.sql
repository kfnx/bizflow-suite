ALTER TABLE `products` DROP FOREIGN KEY `fk_products_supplier`;
--> statement-breakpoint
DROP INDEX `supplier_id_idx` ON `products`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `supplier_id`;