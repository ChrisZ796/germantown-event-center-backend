/*
  Warnings:

  - Added the required column `orgID` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_postID_fkey`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `orgID` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_orgID_fkey` FOREIGN KEY (`orgID`) REFERENCES `Organization`(`orgID`) ON DELETE RESTRICT ON UPDATE CASCADE;
