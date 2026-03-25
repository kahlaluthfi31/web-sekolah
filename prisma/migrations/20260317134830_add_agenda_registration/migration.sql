-- AlterTable
ALTER TABLE `agendas` ADD COLUMN `has_registration` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `registration_url` VARCHAR(500) NULL;
