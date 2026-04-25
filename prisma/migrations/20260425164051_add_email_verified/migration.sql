/*
  Warnings:

  - You are about to drop the column `type` on the `Investment` table. All the data in the column will be lost.
  - Added the required column `provider` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `fk_transaction_wallet_from`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `fk_transaction_wallet_to`;

-- AlterTable
ALTER TABLE `Investment` DROP COLUMN `type`,
    ADD COLUMN `provider` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `isInvestment` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `emailVerified` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_toWalletId_fkey` FOREIGN KEY (`toWalletId`) REFERENCES `Wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
