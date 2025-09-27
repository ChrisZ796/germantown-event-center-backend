/*
  Warnings:

  - You are about to drop the column `favoriteOrgs` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `favoriteOrgs`;

-- CreateTable
CREATE TABLE `_userFavorites` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_userFavorites_AB_unique`(`A`, `B`),
    INDEX `_userFavorites_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_userFavorites` ADD CONSTRAINT `_userFavorites_A_fkey` FOREIGN KEY (`A`) REFERENCES `Organization`(`orgID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_userFavorites` ADD CONSTRAINT `_userFavorites_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
