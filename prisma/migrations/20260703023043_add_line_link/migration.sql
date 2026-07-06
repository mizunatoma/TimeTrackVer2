/*
  Warnings:

  - A unique constraint covering the columns `[lineUserId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Profile` ADD COLUMN `lineUserId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `LineLinkToken` (
    `id` VARCHAR(191) NOT NULL,
    `profileId` VARCHAR(191) NOT NULL,
    `expireAt` DATETIME(3) NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `LineLinkToken_profileId_key`(`profileId`),
    UNIQUE INDEX `LineLinkToken_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Profile_lineUserId_key` ON `Profile`(`lineUserId`);

-- AddForeignKey
ALTER TABLE `LineLinkToken` ADD CONSTRAINT `LineLinkToken_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
