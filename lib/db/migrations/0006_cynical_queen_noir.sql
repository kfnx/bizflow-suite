ALTER TABLE `delivery_notes` DROP FOREIGN KEY `fk_delivery_notes_delivered_by`;
--> statement-breakpoint
ALTER TABLE `delivery_notes` DROP FOREIGN KEY `fk_delivery_notes_received_by`;
--> statement-breakpoint
ALTER TABLE `delivery_notes` DROP COLUMN `delivered_by`;--> statement-breakpoint
ALTER TABLE `delivery_notes` DROP COLUMN `received_by`;