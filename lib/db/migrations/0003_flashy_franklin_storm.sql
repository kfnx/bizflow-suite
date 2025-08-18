CREATE TABLE `model_number` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `model_number_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `part_number` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `part_number_id` PRIMARY KEY(`id`)
);
