-- CreateTable
CREATE TABLE `User` (
    `userID` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `pswd` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `school` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `volunteerHours` INTEGER NOT NULL DEFAULT 0,
    `eventsAttended` INTEGER NOT NULL DEFAULT 0,
    `pfpPath` VARCHAR(191) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organization` (
    `orgID` INTEGER NOT NULL AUTO_INCREMENT,
    `orgName` VARCHAR(191) NOT NULL,
    `pswd` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `linkedin` VARCHAR(191) NULL,
    `pfpPath` VARCHAR(191) NULL,

    UNIQUE INDEX `Organization_email_key`(`email`),
    PRIMARY KEY (`orgID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `postID` INTEGER NOT NULL AUTO_INCREMENT,
    `orgID` INTEGER NOT NULL DEFAULT 1,
    `eventDate` DATETIME(3) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `hours` DOUBLE NOT NULL DEFAULT 0,
    `postDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `eventLocation` VARCHAR(191) NOT NULL,
    `numberInterested` INTEGER NOT NULL DEFAULT 0,
    `thumbnailPath` VARCHAR(191) NULL,
    `finished` BOOLEAN NOT NULL DEFAULT false,
    `updates` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`postID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_userFavorites` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_userFavorites_AB_unique`(`A`, `B`),
    INDEX `_userFavorites_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `_userFavorites` ADD CONSTRAINT `_userFavorites_A_fkey` FOREIGN KEY (`A`) REFERENCES `Organization`(`orgID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_userFavorites` ADD CONSTRAINT `_userFavorites_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_userRegistrations` ADD CONSTRAINT `_userRegistrations_A_fkey` FOREIGN KEY (`A`) REFERENCES `Post`(`postID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_userRegistrations` ADD CONSTRAINT `_userRegistrations_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
