ALTER TABLE `import_items` ADD `part_number` varchar(100);--> statement-breakpoint
ALTER TABLE `import_items` ADD CONSTRAINT `import_items_serial_number_unique` UNIQUE(`serial_number`);--> statement-breakpoint
ALTER TABLE `import_items` DROP COLUMN `year`;--> statement-breakpoint
ALTER TABLE `import_items` DROP COLUMN `model_or_part_number`;--> statement-breakpoint
ALTER TABLE `import_items` DROP COLUMN `model`;--> statement-breakpoint
ALTER TABLE `import_items` DROP COLUMN `engine_model`;--> statement-breakpoint
ALTER TABLE `import_items` DROP COLUMN `engine_power`;--> statement-breakpoint
ALTER TABLE `import_items` DROP COLUMN `operating_weight`;