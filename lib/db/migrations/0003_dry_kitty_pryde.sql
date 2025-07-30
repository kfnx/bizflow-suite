ALTER TABLE `permissions` MODIFY COLUMN `id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `roles` MODIFY COLUMN `id` varchar(36) NOT NULL;