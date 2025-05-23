-- DropForeignKey
ALTER TABLE `EmployeeProject` DROP FOREIGN KEY `EmployeeProject_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `EmployeeProject` DROP FOREIGN KEY `EmployeeProject_projectId_fkey`;

-- AlterTable
ALTER TABLE `Project` ADD COLUMN `addressId` INTEGER NULL,
    ADD COLUMN `priority` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    ADD COLUMN `responsibleId` INTEGER NULL,
    MODIFY `startDate` DATETIME(3) NULL,
    MODIFY `status` ENUM('NOT_STARTED', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED') NULL;

-- CreateIndex
CREATE INDEX `Project_addressId_fkey` ON `Project`(`addressId`);

-- CreateIndex
CREATE INDEX `Project_responsibleId_fkey` ON `Project`(`responsibleId`);

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_responsibleId_fkey` FOREIGN KEY (`responsibleId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeProject` ADD CONSTRAINT `EmployeeProject_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeProject` ADD CONSTRAINT `EmployeeProject_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
