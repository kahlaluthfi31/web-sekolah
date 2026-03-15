-- AlterTable
ALTER TABLE `principal_histories` ADD COLUMN `bidang` VARCHAR(255) NULL,
    ADD COLUMN `end_reason` VARCHAR(100) NULL;

-- CreateTable
CREATE TABLE `page_headers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `page_key` VARCHAR(100) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `subtitle` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `page_headers_page_key_key`(`page_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wakil_bidang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `wakil_bidang_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
