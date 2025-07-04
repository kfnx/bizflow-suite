ALTER TABLE `quotations` RENAME COLUMN `approver_id` TO `approver_by`;--> statement-breakpoint
ALTER TABLE `quotations` DROP FOREIGN KEY `fk_quotations_approver`;
--> statement-breakpoint
ALTER TABLE `quotations` ADD CONSTRAINT `fk_quotations_approver` FOREIGN KEY (`approver_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;