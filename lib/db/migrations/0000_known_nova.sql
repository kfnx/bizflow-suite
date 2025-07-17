CREATE TABLE `accounts` (
	`userId` varchar(36) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `accounts_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `brands` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `brands_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customer_contact_persons` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`customer_id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(255),
	`phone` varchar(20),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `customer_contact_persons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(50) NOT NULL DEFAULT 'individual',
	`npwp` varchar(50),
	`npwp16` varchar(50),
	`billing_address` text,
	`shipping_address` text,
	`address` text,
	`city` varchar(100),
	`province` varchar(100),
	`country` varchar(100),
	`postal_code` varchar(20),
	`payment_terms` varchar(100),
	`is_ppn` boolean DEFAULT false,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `customers_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `delivery_note_items` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`delivery_note_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity` int NOT NULL,
	`delivered_quantity` int DEFAULT 0,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `delivery_note_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `delivery_notes` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`delivery_number` varchar(50) NOT NULL,
	`invoice_id` varchar(36),
	`customer_id` varchar(36) NOT NULL,
	`delivery_date` date NOT NULL,
	`delivery_method` varchar(100),
	`driver_name` varchar(100),
	`vehicle_number` varchar(20),
	`status` enum('pending','in_transit','delivered','cancelled') DEFAULT 'pending',
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
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`import_id` varchar(36) NOT NULL,
	`product_id` varchar(36),
	`price_rmb` decimal(15,2) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`notes` text,
	`category` enum('serialized','non_serialized','bulk') NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`brand_id` varchar(36),
	`condition` varchar(50) DEFAULT 'new',
	`year` int,
	`machine_type_id` varchar(36),
	`unit_of_measure_id` varchar(36),
	`model_or_part_number` varchar(100),
	`machine_number` varchar(100),
	`engine_number` varchar(100),
	`serial_number` varchar(100),
	`model` varchar(100),
	`engine_model` varchar(100),
	`engine_power` varchar(50),
	`operating_weight` varchar(50),
	`batch_or_lot_number` varchar(100),
	`model_number` varchar(100),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `import_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `imports` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`supplier_id` varchar(36) NOT NULL,
	`warehouse_id` varchar(36) NOT NULL,
	`import_date` date NOT NULL,
	`invoice_number` varchar(50) NOT NULL,
	`invoice_date` date NOT NULL,
	`exchange_rate_rmb_to_idr` decimal(15,2) NOT NULL,
	`total` decimal(15,2) DEFAULT '0.00',
	`status` enum('pending','verified') DEFAULT 'pending',
	`notes` text,
	`created_by` varchar(36) NOT NULL,
	`verified_by` varchar(36),
	`verified_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `imports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoice_items` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`invoice_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity` int NOT NULL,
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
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`invoice_number` varchar(50) NOT NULL,
	`quotation_id` varchar(36),
	`invoice_date` date NOT NULL,
	`due_date` date NOT NULL,
	`customer_id` varchar(36) NOT NULL,
	`subtotal` decimal(15,2) DEFAULT '0.00',
	`tax` decimal(15,2) DEFAULT '0.00',
	`total` decimal(15,2) DEFAULT '0.00',
	`currency` varchar(3) DEFAULT 'IDR',
	`status` enum('draft','sent','paid','void','overdue') DEFAULT 'draft',
	`payment_method` varchar(100),
	`notes` text,
	`created_by` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoice_number_unique` UNIQUE(`invoice_number`)
);
--> statement-breakpoint
CREATE TABLE `machine_types` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `machine_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`code` varchar(100) NOT NULL,
	`category` enum('serialized','non_serialized','bulk') NOT NULL,
	`machine_type_id` varchar(36),
	`unit_of_measure_id` varchar(36),
	`model_number` varchar(100),
	`machine_number` varchar(100),
	`engine_number` varchar(100),
	`batch_or_lot_number` varchar(100),
	`brand_id` varchar(36),
	`name` varchar(100) NOT NULL,
	`description` text,
	`serial_number` varchar(100),
	`model` varchar(100),
	`year` int,
	`condition` varchar(50) DEFAULT 'new',
	`status` varchar(50) DEFAULT 'in_stock',
	`price` decimal(15,2) NOT NULL DEFAULT '0.00',
	`engine_model` varchar(100),
	`engine_power` varchar(50),
	`operating_weight` varchar(50),
	`warehouse_id` varchar(36),
	`supplier_id` varchar(36),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `quotation_items` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`quotation_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity` int NOT NULL,
	`unit_price` decimal(15,2) NOT NULL,
	`total` decimal(15,2) NOT NULL,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `quotation_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotations` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`quotation_number` varchar(50) NOT NULL,
	`quotation_date` date NOT NULL,
	`valid_until` date NOT NULL,
	`customer_id` varchar(36),
	`is_include_ppn` boolean DEFAULT false,
	`subtotal` decimal(15,2) DEFAULT '0.00',
	`tax` decimal(15,2) DEFAULT '0.00',
	`total` decimal(15,2) DEFAULT '0.00',
	`currency` varchar(3) DEFAULT 'IDR',
	`status` enum('draft','submitted','approved','sent','accepted','rejected','revised') DEFAULT 'draft',
	`notes` text,
	`terms_and_conditions` text,
	`created_by` varchar(36) NOT NULL,
	`approver_by` varchar(36),
	`customer_response_date` timestamp,
	`customer_response_notes` text,
	`customer_acceptance_info` text,
	`rejection_reason` text,
	`revision_reason` text,
	`revision_version` int DEFAULT 1,
	`invoiced_at` timestamp,
	`invoice_id` varchar(36),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotations_id` PRIMARY KEY(`id`),
	CONSTRAINT `quotations_quotation_number_unique` UNIQUE(`quotation_number`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(36) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `sessions_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `stock_movements` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`warehouse_id_from` varchar(36),
	`warehouse_id_to` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity` int NOT NULL,
	`movement_type` varchar(20) NOT NULL,
	`invoice_id` varchar(50),
	`delivery_id` varchar(50),
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stock_movements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supplier_contact_persons` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`supplier_id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(255),
	`phone` varchar(20),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `supplier_contact_persons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`city` varchar(100),
	`province` varchar(100),
	`country` varchar(100),
	`postal_code` varchar(20),
	`transaction_currency` varchar(3) DEFAULT 'USD',
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`),
	CONSTRAINT `suppliers_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `unit_of_measures` (
	`id` varchar(36) NOT NULL,
	`abbreviation` varchar(10) NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `unit_of_measures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`code` varchar(50) NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100),
	`nik` varchar(50) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL DEFAULT 'SandiRumitSTI',
	`job_title` varchar(100),
	`join_date` date NOT NULL,
	`type` varchar(50) DEFAULT 'full-time',
	`phone` varchar(20),
	`avatar` varchar(500),
	`role` varchar(50) NOT NULL DEFAULT 'staff',
	`signature` varchar(500),
	`is_active` boolean DEFAULT true,
	`is_admin` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_code_unique` UNIQUE(`code`),
	CONSTRAINT `users_nik_unique` UNIQUE(`nik`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verificationToken_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE TABLE `warehouse_stocks` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`warehouse_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`condition` varchar(20) NOT NULL,
	`quantity` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `warehouse_stocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `warehouses` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`name` varchar(255) NOT NULL,
	`address` text,
	`manager_id` varchar(36),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `warehouses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `customer_contact_persons` ADD CONSTRAINT `fk_customer_contact_persons_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `delivery_note_items` ADD CONSTRAINT `fk_delivery_note_items_delivery_note` FOREIGN KEY (`delivery_note_id`) REFERENCES `delivery_notes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `delivery_note_items` ADD CONSTRAINT `fk_delivery_note_items_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `delivery_notes` ADD CONSTRAINT `fk_delivery_notes_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `delivery_notes` ADD CONSTRAINT `fk_delivery_notes_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `delivery_notes` ADD CONSTRAINT `fk_delivery_notes_created_by` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `delivery_notes` ADD CONSTRAINT `fk_delivery_notes_delivered_by` FOREIGN KEY (`delivered_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `delivery_notes` ADD CONSTRAINT `fk_delivery_notes_received_by` FOREIGN KEY (`received_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `import_items` ADD CONSTRAINT `fk_import_items_import` FOREIGN KEY (`import_id`) REFERENCES `imports`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `import_items` ADD CONSTRAINT `fk_import_items_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `import_items` ADD CONSTRAINT `fk_import_items_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `import_items` ADD CONSTRAINT `fk_import_items_machine_type` FOREIGN KEY (`machine_type_id`) REFERENCES `machine_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `import_items` ADD CONSTRAINT `fk_import_items_unit_of_measure` FOREIGN KEY (`unit_of_measure_id`) REFERENCES `unit_of_measures`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `imports` ADD CONSTRAINT `fk_imports_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `imports` ADD CONSTRAINT `fk_imports_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `imports` ADD CONSTRAINT `fk_imports_created_by` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `imports` ADD CONSTRAINT `fk_imports_verified_by` FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoice_items` ADD CONSTRAINT `fk_invoice_items_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoice_items` ADD CONSTRAINT `fk_invoice_items_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoices` ADD CONSTRAINT `fk_invoices_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoices` ADD CONSTRAINT `fk_invoices_created_by` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `fk_products_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `fk_products_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `fk_products_machine_type` FOREIGN KEY (`machine_type_id`) REFERENCES `machine_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `fk_products_unit_of_measure` FOREIGN KEY (`unit_of_measure_id`) REFERENCES `unit_of_measures`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quotation_items` ADD CONSTRAINT `fk_quotation_items_quotation` FOREIGN KEY (`quotation_id`) REFERENCES `quotations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quotation_items` ADD CONSTRAINT `fk_quotation_items_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quotations` ADD CONSTRAINT `fk_quotations_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quotations` ADD CONSTRAINT `fk_quotations_created_by` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quotations` ADD CONSTRAINT `fk_quotations_approver` FOREIGN KEY (`approver_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stock_movements` ADD CONSTRAINT `fk_stock_movements_warehouse_from` FOREIGN KEY (`warehouse_id_from`) REFERENCES `warehouses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stock_movements` ADD CONSTRAINT `fk_stock_movements_warehouse_to` FOREIGN KEY (`warehouse_id_to`) REFERENCES `warehouses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stock_movements` ADD CONSTRAINT `fk_stock_movements_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplier_contact_persons` ADD CONSTRAINT `fk_supplier_contact_persons_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `warehouse_stocks` ADD CONSTRAINT `fk_warehouse_stocks_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `warehouse_stocks` ADD CONSTRAINT `fk_warehouse_stocks_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `warehouses` ADD CONSTRAINT `fk_warehouses_manager` FOREIGN KEY (`manager_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `userId_idx` ON `accounts` (`userId`);--> statement-breakpoint
CREATE INDEX `customer_id_idx` ON `customer_contact_persons` (`customer_id`);--> statement-breakpoint
CREATE INDEX `code_idx` ON `customers` (`code`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `customers` (`name`);--> statement-breakpoint
CREATE INDEX `delivery_note_id_idx` ON `delivery_note_items` (`delivery_note_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `delivery_note_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `delivery_number_idx` ON `delivery_notes` (`delivery_number`);--> statement-breakpoint
CREATE INDEX `invoice_id_idx` ON `delivery_notes` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `customer_id_idx` ON `delivery_notes` (`customer_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `delivery_notes` (`status`);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `delivery_notes` (`created_by`);--> statement-breakpoint
CREATE INDEX `import_id_idx` ON `import_items` (`import_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `import_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `import_items` (`category`);--> statement-breakpoint
CREATE INDEX `machine_number_idx` ON `import_items` (`machine_number`);--> statement-breakpoint
CREATE INDEX `invoice_number_idx` ON `imports` (`invoice_number`);--> statement-breakpoint
CREATE INDEX `supplier_id_idx` ON `imports` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `warehouse_id_idx` ON `imports` (`warehouse_id`);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `imports` (`created_by`);--> statement-breakpoint
CREATE INDEX `invoice_id_idx` ON `invoice_items` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `invoice_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `invoice_number_idx` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE INDEX `quotation_id_idx` ON `invoices` (`quotation_id`);--> statement-breakpoint
CREATE INDEX `customer_id_idx` ON `invoices` (`customer_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `invoices` (`status`);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `invoices` (`created_by`);--> statement-breakpoint
CREATE INDEX `brand_id_idx` ON `products` (`brand_id`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `products` (`category`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `products` (`status`);--> statement-breakpoint
CREATE INDEX `supplier_id_idx` ON `products` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `warehouse_id_idx` ON `products` (`warehouse_id`);--> statement-breakpoint
CREATE INDEX `quotation_id_idx` ON `quotation_items` (`quotation_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `quotation_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `quotation_number_idx` ON `quotations` (`quotation_number`);--> statement-breakpoint
CREATE INDEX `customer_id_idx` ON `quotations` (`customer_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `quotations` (`status`);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `quotations` (`created_by`);--> statement-breakpoint
CREATE INDEX `warehouse_id_from_idx` ON `stock_movements` (`warehouse_id_from`);--> statement-breakpoint
CREATE INDEX `warehouse_id_to_idx` ON `stock_movements` (`warehouse_id_to`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `stock_movements` (`product_id`);--> statement-breakpoint
CREATE INDEX `movement_type_idx` ON `stock_movements` (`movement_type`);--> statement-breakpoint
CREATE INDEX `supplier_id_idx` ON `supplier_contact_persons` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `code_idx` ON `suppliers` (`code`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `suppliers` (`name`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `role_idx` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `warehouse_id_idx` ON `warehouse_stocks` (`warehouse_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `warehouse_stocks` (`product_id`);--> statement-breakpoint
CREATE INDEX `condition_idx` ON `warehouse_stocks` (`condition`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `warehouses` (`name`);--> statement-breakpoint
CREATE INDEX `manager_id_idx` ON `warehouses` (`manager_id`);