ALTER TABLE `branches` ADD `created_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `brands` ADD `created_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `machine_types` ADD `created_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `unit_of_measures` ADD `created_at` timestamp DEFAULT (now());