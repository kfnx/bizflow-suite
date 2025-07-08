ALTER TABLE `quotations` MODIFY COLUMN `status` enum('draft','submitted','approved','sent','accepted','rejected','revised') DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE `quotations` ADD `customer_response_date` timestamp;--> statement-breakpoint
ALTER TABLE `quotations` ADD `customer_response_notes` text;--> statement-breakpoint
ALTER TABLE `quotations` ADD `customer_acceptance_info` text;--> statement-breakpoint
ALTER TABLE `quotations` ADD `rejection_reason` text;--> statement-breakpoint
ALTER TABLE `quotations` ADD `revision_reason` text;