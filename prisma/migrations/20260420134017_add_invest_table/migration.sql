/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - The values [GOLD] on the enum `Wallet_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `isInvestment` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `emailVerified`;

-- AlterTable
ALTER TABLE `Wallet` ADD COLUMN `color` VARCHAR(191) NULL,
    MODIFY `type` ENUM('CASH', 'E_WALLET', 'BANK') NOT NULL DEFAULT 'CASH';

-- CreateTable
CREATE TABLE `Investment` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `assetName` VARCHAR(191) NOT NULL DEFAULT 'Gold',
    `totalGrams` DECIMAL(10, 3) NOT NULL DEFAULT 0,
    `avgBuyPrice` DECIMAL(20, 2) NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Investment_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoldPriceHistory` (
    `id` VARCHAR(191) NOT NULL,
    `price` DECIMAL(20, 2) NOT NULL,
    `buyPrice` DECIMAL(20, 2) NULL,
    `sellPrice` DECIMAL(20, 2) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `GoldPriceHistory_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Transaction_date_idx` ON `Transaction`(`date`);

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_toWalletId_fkey` FOREIGN KEY (`toWalletId`) REFERENCES `Wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Investment` ADD CONSTRAINT `Investment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
