/*
  Warnings:

  - You are about to alter the column `name` on the `Activity` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `name` on the `Contacts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `displayName` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `name` on the `Routine` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `title` on the `RoutineItem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `memo` on the `TimeLog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(190)`.
  - You are about to alter the column `title` on the `Todo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `TodoList` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- DropIndex
DROP INDEX `User_email_idx` ON `User`;

-- AlterTable
ALTER TABLE `Activity` MODIFY `name` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `Contacts` MODIFY `name` VARCHAR(50) NOT NULL,
    MODIFY `email` VARCHAR(254) NOT NULL,
    MODIFY `message` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `Profile` MODIFY `displayName` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `Routine` MODIFY `name` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `RoutineItem` MODIFY `title` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `TimeLog` MODIFY `memo` VARCHAR(190) NULL;

-- AlterTable
ALTER TABLE `Todo` MODIFY `title` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `TodoList` MODIFY `name` VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE INDEX `TimeLog_activityId_endAt_idx` ON `TimeLog`(`activityId`, `endAt`);

-- CreateIndex
CREATE INDEX `Todo_todoListId_deletedAt_createdAt_idx` ON `Todo`(`todoListId`, `deletedAt`, `createdAt`);

-- CreateIndex
CREATE INDEX `TodoList_profileId_deletedAt_sortOrder_idx` ON `TodoList`(`profileId`, `deletedAt`, `sortOrder`);
