-- =========================================================================
-- DATABASE SETUP SCRIPT FOR KHANG PHUC (MYSQL FORMAT)
-- Source: prisma/schema.prisma & prisma/seed.ts
-- =========================================================================

-- Create database if not exists and select it
CREATE DATABASE IF NOT EXISTS `khangphuc_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `khangphuc_db`;

-- Set variables to ensure constraints work properly
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables in reverse dependency order to avoid constraint issues
DROP TABLE IF EXISTS `heavy_shipping_rules`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `wholesale_profiles`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `combo_items`;
DROP TABLE IF EXISTS `combos`;
DROP TABLE IF EXISTS `inventory_levels`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `warehouses`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================================
-- 1. TABLE STRUCTURES (DDL)
-- =========================================================================

-- Table structure for `users`
CREATE TABLE `users` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) DEFAULT NULL,
  `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `warehouses`
CREATE TABLE `warehouses` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `address` VARCHAR(191) NOT NULL,
  `city` VARCHAR(191) NOT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `warehouses_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `products`
CREATE TABLE `products` (
  `id` VARCHAR(191) NOT NULL,
  `sku` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `weight` DOUBLE NOT NULL,
  `deliveryType` ENUM('LIGHT', 'HEAVY') NOT NULL DEFAULT 'LIGHT',
  `price` DOUBLE NOT NULL DEFAULT 0,
  `agentPrice` DOUBLE NOT NULL DEFAULT 0,
  `category` VARCHAR(191) NOT NULL DEFAULT 'other',
  `subCategory` VARCHAR(191) DEFAULT NULL,
  `brand` VARCHAR(191) DEFAULT NULL,
  `image` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `features` TEXT DEFAULT NULL,
  `specs` TEXT DEFAULT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_sku_key` (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `inventory_levels`
CREATE TABLE `inventory_levels` (
  `productId` VARCHAR(191) NOT NULL,
  `warehouseId` VARCHAR(191) NOT NULL,
  `stockQty` INT NOT NULL DEFAULT 0,
  `reservedQty` INT NOT NULL DEFAULT 0,
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`productId`, `warehouseId`),
  CONSTRAINT `inventory_levels_product_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inventory_levels_warehouse_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `combos`
CREATE TABLE `combos` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `discountPercentage` DOUBLE NOT NULL DEFAULT 0,
  `description` TEXT DEFAULT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `combos_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `combo_items`
CREATE TABLE `combo_items` (
  `comboId` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `isOptional` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`comboId`, `productId`),
  CONSTRAINT `combo_items_combo_fkey` FOREIGN KEY (`comboId`) REFERENCES `combos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `combo_items_product_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `customers`
CREATE TABLE `customers` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `companyName` VARCHAR(191) DEFAULT NULL,
  `taxCode` VARCHAR(191) DEFAULT NULL,
  `customerType` ENUM('RETAIL', 'WHOLESALE') NOT NULL DEFAULT 'RETAIL',
  PRIMARY KEY (`id`),
  UNIQUE KEY `customers_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `wholesale_profiles`
CREATE TABLE `wholesale_profiles` (
  `customerId` VARCHAR(191) NOT NULL,
  `creditLimit` DOUBLE NOT NULL,
  `outstandingBalance` DOUBLE NOT NULL DEFAULT 0,
  `paymentTermsDays` INT NOT NULL DEFAULT 30,
  `approvedAt` DATETIME(3) DEFAULT NULL,
  `approvedByUserId` INT DEFAULT NULL,
  PRIMARY KEY (`customerId`),
  CONSTRAINT `wholesale_profiles_customer_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `invoices`
CREATE TABLE `invoices` (
  `id` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `customerId` VARCHAR(191) NOT NULL,
  `invoiceAmount` DOUBLE NOT NULL,
  `dueDate` DATETIME(3) NOT NULL,
  `status` ENUM('UNPAID', 'PARTIALLY_PAID', 'PAID', 'OVERDUE') NOT NULL DEFAULT 'UNPAID',
  `paidAmount` DOUBLE NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `invoices_customer_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `heavy_shipping_rules`
CREATE TABLE `heavy_shipping_rules` (
  `id` VARCHAR(191) NOT NULL,
  `warehouseId` VARCHAR(191) NOT NULL,
  `vehicleType` ENUM('TRUCK_1_5T', 'TRUCK_5T') NOT NULL,
  `maxWeightKg` DOUBLE NOT NULL,
  `baseFare` DOUBLE NOT NULL,
  `perKmRate` DOUBLE NOT NULL,
  `minDistanceKm` DOUBLE NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `heavy_shipping_rules_warehouse_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================================================
-- 2. SEED INITIAL DATA (DML)
-- =========================================================================

-- Seed default Users (Password hashes are SHA-256 for: admin123 and user123)
-- Admin: admin@khangphuc.com / admin123
-- User: user@khangphuc.com / user123
INSERT INTO `users` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES
('admin-uuid-01', 'admin@khangphuc.com', '240be518abb07208f1a2ec77e57a62e190c310224066eec50b7d528ab86df7e6', 'Khang Phúc Admin', 'ADMIN', NOW(3), NOW(3)),
('user-uuid-01', 'user@khangphuc.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Đại lý Khang Phúc B2B', 'USER', NOW(3), NOW(3));

-- Seed Warehouses
INSERT INTO `warehouses` (`id`, `name`, `code`, `address`, `city`, `isActive`, `createdAt`) VALUES
('KHO_HCM', 'Kho Khang Phúc TP. Hồ Chí Minh', 'KHO_HCM', '124 Lũy Bán Bích, Tân Thới Hòa, Tân Phú, TP. HCM', 'Ho Chi Minh', 1, NOW(3)),
('KHO_HN', 'Kho Khang Phúc Hà Nội', 'KHO_HN', 'Ngõ 286 Nguyễn Xiển, Thanh Xuân, Hà Nội', 'Ha Noi', 1, NOW(3));

-- Seed Heavy Shipping Rules
INSERT INTO `heavy_shipping_rules` (`id`, `warehouseId`, `vehicleType`, `maxWeightKg`, `baseFare`, `perKmRate`, `minDistanceKm`, `createdAt`) VALUES
('RULE_HCM_1_5T', 'KHO_HCM', 'TRUCK_1_5T', 1500.0, 500000.0, 20000.0, 5.0, NOW(3)),
('RULE_HCM_5T', 'KHO_HCM', 'TRUCK_5T', 5000.0, 1200000.0, 35000.0, 5.0, NOW(3)),
('RULE_HN_1_5T', 'KHO_HN', 'TRUCK_1_5T', 1500.0, 450000.0, 18000.0, 5.0, NOW(3)),
('RULE_HN_5T', 'KHO_HN', 'TRUCK_5T', 5000.0, 1100000.0, 32000.0, 5.0, NOW(3));

-- Seed Customers
INSERT INTO `customers` (`id`, `email`, `companyName`, `taxCode`, `customerType`) VALUES
('cust_wholesale_01', 'agency@khangphuc.com', 'Tổng Công Ty Xây Dựng & Thi Công Sàn Delta Việt Nam', '0102030405', 'WHOLESALE'),
('cust_retail_01', 'khachle@gmail.com', 'Cơ sở Thi công Nhà xưởng Bình Dương', NULL, 'RETAIL');

-- Seed Wholesale Profiles
INSERT INTO `wholesale_profiles` (`customerId`, `creditLimit`, `outstandingBalance`, `paymentTermsDays`, `approvedAt`, `approvedByUserId`) VALUES
('cust_wholesale_01', 500000000.0, 120000000.0, 30, NOW(3), NULL);

-- Seed Invoices
INSERT INTO `invoices` (`id`, `orderId`, `customerId`, `invoiceAmount`, `dueDate`, `status`, `paidAmount`, `createdAt`) VALUES
('INV_2026_0001', '10452', 'cust_wholesale_01', 120000000.0, DATE_ADD(NOW(3), INTERVAL 15 DAY), 'UNPAID', 0.0, NOW(3));
