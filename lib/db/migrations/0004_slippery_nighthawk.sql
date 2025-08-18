RENAME TABLE `model_number` TO `model_numbers`;--> statement-breakpoint
RENAME TABLE `part_number` TO `part_numbers`;--> statement-breakpoint
ALTER TABLE `model_numbers` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `part_numbers` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `model_numbers` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `part_numbers` ADD PRIMARY KEY(`id`);