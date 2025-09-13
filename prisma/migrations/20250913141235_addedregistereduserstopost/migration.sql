/*
  Warnings:

  - You are about to drop the column `orgID` on the `post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_orgID_fkey`;

-- DropIndex
DROP INDEX `Post_orgID_fkey` ON `post`;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `orgID`,
    ADD COLUMN `finished` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `postPostID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_postPostID_fkey` FOREIGN KEY (`postPostID`) REFERENCES `Post`(`postID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_postID_fkey` FOREIGN KEY (`postID`) REFERENCES `Organization`(`orgID`) ON DELETE RESTRICT ON UPDATE CASCADE;
