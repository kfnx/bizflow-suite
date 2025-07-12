ALTER TABLE `imports` ADD `verified_by` varchar(36);--> statement-breakpoint
ALTER TABLE `imports` ADD `verified_at` timestamp;--> statement-breakpoint
ALTER TABLE `imports` ADD CONSTRAINT `fk_imports_verified_by` FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;