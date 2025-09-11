ALTER TABLE `delivery_notes` ADD `quotation_id` varchar(36);--> statement-breakpoint
ALTER TABLE `delivery_notes` ADD CONSTRAINT `fk_delivery_notes_quotation` FOREIGN KEY (`quotation_id`) REFERENCES `quotations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `quotation_id_idx` ON `delivery_notes` (`quotation_id`);