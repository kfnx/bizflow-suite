ALTER TABLE `delivery_note_items` MODIFY COLUMN `quantity` int NOT NULL;--> statement-breakpoint
ALTER TABLE `delivery_note_items` MODIFY COLUMN `delivered_quantity` int;--> statement-breakpoint
ALTER TABLE `delivery_note_items` MODIFY COLUMN `delivered_quantity` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `invoice_items` MODIFY COLUMN `quantity` int NOT NULL;--> statement-breakpoint
ALTER TABLE `quotation_items` MODIFY COLUMN `quantity` int NOT NULL;