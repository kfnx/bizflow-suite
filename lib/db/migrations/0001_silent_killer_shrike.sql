ALTER TABLE `users` RENAME COLUMN `role` TO `role_id`;--> statement-breakpoint
DROP INDEX `role_idx` ON `users`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `role_id_idx` ON `users` (`role_id`);