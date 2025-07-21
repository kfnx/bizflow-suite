CREATE TABLE `branches` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `branches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `quotations` ADD `branch_id` varchar(36);--> statement-breakpoint
ALTER TABLE `users` ADD `branch_id` varchar(36);--> statement-breakpoint
ALTER TABLE `quotations` ADD CONSTRAINT `fk_quotations_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `fk_users_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customers` DROP COLUMN `is_ppn`;