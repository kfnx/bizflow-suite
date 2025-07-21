ALTER TABLE `delivery_notes` ADD `branch_id` varchar(36);--> statement-breakpoint
ALTER TABLE `invoices` ADD `branch_id` varchar(36);--> statement-breakpoint
ALTER TABLE `delivery_notes` ADD CONSTRAINT `fk_delivery_notes_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoices` ADD CONSTRAINT `fk_invoices_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE no action ON UPDATE no action;