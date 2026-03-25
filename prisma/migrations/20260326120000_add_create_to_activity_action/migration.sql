-- AlterEnum
ALTER TABLE `activity_logs` MODIFY `action` ENUM('CREATE', 'EDIT', 'DELETE') NOT NULL;
