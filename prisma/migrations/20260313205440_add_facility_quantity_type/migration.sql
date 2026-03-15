-- AlterTable
ALTER TABLE `facilities` ADD COLUMN `quantity_type` ENUM('jumlah', 'kapasitas') NOT NULL DEFAULT 'jumlah';
