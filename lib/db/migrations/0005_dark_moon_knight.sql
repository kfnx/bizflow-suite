RENAME TABLE `model_numbers` TO `machine_model`;--> statement-breakpoint
ALTER TABLE `machine_model` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `machine_model` ADD PRIMARY KEY(`id`);