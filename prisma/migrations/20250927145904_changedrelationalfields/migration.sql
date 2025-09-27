/*
  Warnings:

  - You are about to drop the `_userfavorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_userregistrations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_userfavorites` DROP FOREIGN KEY `_userFavorites_A_fkey`;

-- DropForeignKey
ALTER TABLE `_userfavorites` DROP FOREIGN KEY `_userFavorites_B_fkey`;

-- DropForeignKey
ALTER TABLE `_userregistrations` DROP FOREIGN KEY `_userRegistrations_A_fkey`;

-- DropForeignKey
ALTER TABLE `_userregistrations` DROP FOREIGN KEY `_userRegistrations_B_fkey`;

-- AlterTable
ALTER TABLE `post` ALTER COLUMN `orgID` DROP DEFAULT;

-- DropTable
DROP TABLE `_userfavorites`;

-- DropTable
DROP TABLE `_userregistrations`;

-- CreateTable
CREATE TABLE `UserFavorites` (
    `userID` INTEGER NOT NULL,
    `orgID` INTEGER NOT NULL,

    PRIMARY KEY (`userID`, `orgID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRegistrations` (
    `userID` INTEGER NOT NULL,
    `postID` INTEGER NOT NULL,

    PRIMARY KEY (`userID`, `postID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserFavorites` ADD CONSTRAINT `UserFavorites_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserFavorites` ADD CONSTRAINT `UserFavorites_orgID_fkey` FOREIGN KEY (`orgID`) REFERENCES `Organization`(`orgID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRegistrations` ADD CONSTRAINT `UserRegistrations_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRegistrations` ADD CONSTRAINT `UserRegistrations_postID_fkey` FOREIGN KEY (`postID`) REFERENCES `Post`(`postID`) ON DELETE RESTRICT ON UPDATE CASCADE;
