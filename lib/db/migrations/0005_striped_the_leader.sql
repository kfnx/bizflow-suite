ALTER TABLE `branches` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
CREATE INDEX `name_id_idx` ON `products` (`name`);