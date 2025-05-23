-- AlterTable
ALTER TABLE `Project` ADD COLUMN `userId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Project_userId_fkey` ON `Project`(`userId`);

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
