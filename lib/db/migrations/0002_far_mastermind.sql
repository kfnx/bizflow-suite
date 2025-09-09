ALTER TABLE `users` DROP FOREIGN KEY `fk_users_role`;
--> statement-breakpoint
DROP INDEX `role_id_idx` ON `users`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `role_id`;