ALTER TABLE `quotations` ADD `invoiced_at` timestamp;--> statement-breakpoint
ALTER TABLE `quotations` ADD `invoice_id` varchar(36);--> statement-breakpoint
ALTER TABLE `quotations` ADD CONSTRAINT `fk_quotations_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE no action ON UPDATE no action;