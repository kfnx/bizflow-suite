ALTER TABLE `invoices` MODIFY COLUMN `status` enum('draft','sent','paid','void','overdue') DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `password` varchar(255) NOT NULL DEFAULT 'SandiRumitSTI';--> statement-breakpoint
ALTER TABLE `quotations` ADD `revision_version` int DEFAULT 1;