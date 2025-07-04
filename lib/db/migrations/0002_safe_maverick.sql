ALTER TABLE `products` RENAME COLUMN `location` TO `warehouse_id`;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `warehouse_id` varchar(36);--> statement-breakpoint
ALTER TABLE `quotations` MODIFY COLUMN `approver_id` varchar(36);