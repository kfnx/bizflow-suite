CREATE TABLE `customers` (
	`id` varchar(36) NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255),
	`phone` varchar(20),
	`address` text,
	`city` varchar(100),
	`country` varchar(100),
	`tax_number` varchar(50),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `customers_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `delivery_note_items` (
	`id` varchar(36) NOT NULL,
	`delivery_note_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity` decimal(10,2) NOT NULL,
	`delivered_quantity` decimal(10,2) DEFAULT '0.00',
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `delivery_note_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `delivery_notes` (
	`id` varchar(36) NOT NULL,
	`delivery_number` varchar(50) NOT NULL,
	`invoice_id` varchar(36),
	`customer_id` varchar(36) NOT NULL,
	`delivery_date` date NOT NULL,
	`delivery_method` varchar(100),
	`driver_name` varchar(100),
	`vehicle_number` varchar(20),
	`status` varchar(50) DEFAULT 'pending',
	`delivered_by` varchar(36),
	`received_by` varchar(36),
	`notes` text,
	`created_by` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `delivery_notes_id` PRIMARY KEY(`id`),
	CONSTRAINT `delivery_notes_delivery_number_unique` UNIQUE(`delivery_number`)
);
--> statement-breakpoint
CREATE TABLE `import_items` (
	`id` varchar(36) NOT NULL,
	`import_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity` decimal(10,2) NOT NULL,
	`received_quantity` decimal(10,2) DEFAULT '0.00',
	`unit_price` decimal(15,2) NOT NULL,
	`total` decimal(15,2) NOT NULL,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `import_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `imports` (
	`id` varchar(36) NOT NULL,
	`import_number` varchar(50) NOT NULL,
	`supplier_id` varchar(36) NOT NULL,
	`warehouse_id` varchar(36) NOT NULL,
	`import_date` date NOT NULL,
	`expected_date` date NOT NULL,
	`subtotal` decimal(15,2) DEFAULT '0.00',
	`tax` decimal(15,2) DEFAULT '0.00',
	`total` decimal(15,2) DEFAULT '0.00',
	`currency` varchar(3) DEFAULT 'IDR',
	`status` varchar(50) DEFAULT 'pending',
	`notes` text,
	`created_by` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `imports_id` PRIMARY KEY(`id`),
	CONSTRAINT `imports_import_number_unique` UNIQUE(`import_number`)
);
--> statement-breakpoint
CREATE TABLE `invoice_items` (
	`id` varchar(36) NOT NULL,
	`invoice_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity` decimal(10,2) NOT NULL,
	`unit_price` decimal(15,2) NOT NULL,
	`total` decimal(15,2) NOT NULL,
	`payment_terms` varchar(100),
	`terms_and_conditions` text,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `invoice_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` varchar(36) NOT NULL,
	`invoice_number` varchar(50) NOT NULL,
	`quotation_id` varchar(36),
	`invoice_date` date NOT NULL,
	`due_date` date NOT NULL,
	`customer_id` varchar(36) NOT NULL,
	`subtotal` decimal(15,2) DEFAULT '0.00',
	`tax` decimal(15,2) DEFAULT '0.00',
	`total` decimal(15,2) DEFAULT '0.00',
	`currency` varchar(3) DEFAULT 'IDR',
	`status` varchar(50) DEFAULT 'draft',
	`payment_method` varchar(100),
	`notes` text,
	`created_by` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoice_number_unique` UNIQUE(`invoice_number`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(36) NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`unit` varchar(20) NOT NULL,
	`price` decimal(15,2) DEFAULT '0.00',
	`currency` varchar(3) DEFAULT 'IDR',
	`supplier_id` varchar(36),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `quotation_items` (
	`id` varchar(36) NOT NULL,
	`quotation_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity` decimal(10,2) NOT NULL,
	`unit_price` decimal(15,2) NOT NULL,
	`total` decimal(15,2) NOT NULL,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `quotation_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotations` (
	`id` varchar(36) NOT NULL,
	`quotation_number` varchar(50) NOT NULL,
	`quotation_date` date NOT NULL,
	`valid_until` date NOT NULL,
	`customer_id` varchar(36) NOT NULL,
	`approver_id` varchar(36),
	`is_include_ppn` boolean DEFAULT false,
	`subtotal` decimal(15,2) DEFAULT '0.00',
	`tax` decimal(15,2) DEFAULT '0.00',
	`total` decimal(15,2) DEFAULT '0.00',
	`currency` varchar(3) DEFAULT 'IDR',
	`status` varchar(50) DEFAULT 'draft',
	`notes` text,
	`terms_and_conditions` text,
	`created_by` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotations_id` PRIMARY KEY(`id`),
	CONSTRAINT `quotations_quotation_number_unique` UNIQUE(`quotation_number`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` varchar(36) NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`contact_person` varchar(100),
	`email` varchar(255),
	`phone` varchar(20),
	`address` text,
	`city` varchar(100),
	`country` varchar(100),
	`tax_number` varchar(50),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`),
	CONSTRAINT `suppliers_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `transfer_items` (
	`id` varchar(36) NOT NULL,
	`transfer_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity` decimal(10,2) NOT NULL,
	`transferred_quantity` decimal(10,2) DEFAULT '0.00',
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `transfer_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transfers` (
	`id` varchar(36) NOT NULL,
	`transfer_number` varchar(50) NOT NULL,
	`from_warehouse_id` varchar(36) NOT NULL,
	`to_warehouse_id` varchar(36) NOT NULL,
	`transfer_date` date NOT NULL,
	`expected_date` date NOT NULL,
	`status` varchar(50) DEFAULT 'pending',
	`notes` text,
	`created_by` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transfers_id` PRIMARY KEY(`id`),
	CONSTRAINT `transfers_transfer_number_unique` UNIQUE(`transfer_number`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`phone` varchar(20),
	`avatar` varchar(500),
	`role` varchar(50) DEFAULT 'user',
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `warehouses` (
	`id` varchar(36) NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`city` varchar(100),
	`country` varchar(100),
	`manager` varchar(100),
	`phone` varchar(20),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `warehouses_id` PRIMARY KEY(`id`),
	CONSTRAINT `warehouses_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE INDEX `code_idx` ON `customers` (`code`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `customers` (`name`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `customers` (`email`);--> statement-breakpoint
CREATE INDEX `delivery_note_id_idx` ON `delivery_note_items` (`delivery_note_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `delivery_note_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `delivery_number_idx` ON `delivery_notes` (`delivery_number`);--> statement-breakpoint
CREATE INDEX `invoice_id_idx` ON `delivery_notes` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `customer_id_idx` ON `delivery_notes` (`customer_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `delivery_notes` (`status`);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `delivery_notes` (`created_by`);--> statement-breakpoint
CREATE INDEX `import_id_idx` ON `import_items` (`import_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `import_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `import_number_idx` ON `imports` (`import_number`);--> statement-breakpoint
CREATE INDEX `supplier_id_idx` ON `imports` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `warehouse_id_idx` ON `imports` (`warehouse_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `imports` (`status`);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `imports` (`created_by`);--> statement-breakpoint
CREATE INDEX `invoice_id_idx` ON `invoice_items` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `invoice_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `invoice_number_idx` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE INDEX `quotation_id_idx` ON `invoices` (`quotation_id`);--> statement-breakpoint
CREATE INDEX `customer_id_idx` ON `invoices` (`customer_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `invoices` (`status`);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `invoices` (`created_by`);--> statement-breakpoint
CREATE INDEX `code_idx` ON `products` (`code`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `products` (`name`);--> statement-breakpoint
CREATE INDEX `supplier_id_idx` ON `products` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `quotation_id_idx` ON `quotation_items` (`quotation_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `quotation_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `quotation_number_idx` ON `quotations` (`quotation_number`);--> statement-breakpoint
CREATE INDEX `customer_id_idx` ON `quotations` (`customer_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `quotations` (`status`);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `quotations` (`created_by`);--> statement-breakpoint
CREATE INDEX `code_idx` ON `suppliers` (`code`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `suppliers` (`name`);--> statement-breakpoint
CREATE INDEX `transfer_id_idx` ON `transfer_items` (`transfer_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `transfer_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `transfer_number_idx` ON `transfers` (`transfer_number`);--> statement-breakpoint
CREATE INDEX `from_warehouse_id_idx` ON `transfers` (`from_warehouse_id`);--> statement-breakpoint
CREATE INDEX `to_warehouse_id_idx` ON `transfers` (`to_warehouse_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `transfers` (`status`);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `transfers` (`created_by`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `role_idx` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `code_idx` ON `warehouses` (`code`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `warehouses` (`name`);