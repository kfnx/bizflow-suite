ALTER TABLE `invoices` ADD `payment_terms` varchar(100);--> statement-breakpoint
ALTER TABLE `invoices` DROP COLUMN `payment_term`;