/*
  Warnings:

  - You are about to drop the column `goldWeight` on the `Wallet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Investment` will be added. If there are existing duplicate values, this will fail.
  - Made the column `color` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Category` MODIFY `color` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `buyPrice` DECIMAL(20, 2) NULL,
    ADD COLUMN `sellPrice` DECIMAL(20, 2) NULL;

-- AlterTable
ALTER TABLE `Wallet` DROP COLUMN `goldWeight`;

-- CreateIndex
CREATE UNIQUE INDEX `Investment_userId_key` ON `Investment`(`userId`);
