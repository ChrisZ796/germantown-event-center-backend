/*
  Warnings:

  - You are about to drop the column `postPostID` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_postID_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_postPostID_fkey`;

-- DropIndex
DROP INDEX `User_postPostID_fkey` ON `user`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `orgID` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `postPostID`;

-- CreateTable
CREATE TABLE `_userRegistrations` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_userRegistrations_AB_unique`(`A`, `B`),
    INDEX `_userRegistrations_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_orgID_fkey` FOREIGN KEY (`orgID`) REFERENCES `Organization`(`orgID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_userRegistrations` ADD CONSTRAINT `_userRegistrations_A_fkey` FOREIGN KEY (`A`) REFERENCES `Post`(`postID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_userRegistrations` ADD CONSTRAINT `_userRegistrations_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
