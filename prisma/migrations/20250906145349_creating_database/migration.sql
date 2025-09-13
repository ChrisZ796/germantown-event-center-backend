-- CreateTable
CREATE TABLE `User` (
    `userID` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `pswd` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `school` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `volunteerHours` JSON NOT NULL,
    `eventsAttended` INTEGER NOT NULL DEFAULT 0,
    `favoriteOrgs` JSON NOT NULL,
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
    `eventDate` DATETIME(3) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `postDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `eventLocation` VARCHAR(191) NOT NULL,
    `numberInterested` INTEGER NOT NULL DEFAULT 0,
    `thumbnailPath` VARCHAR(191) NULL,

    PRIMARY KEY (`postID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_postID_fkey` FOREIGN KEY (`postID`) REFERENCES `Organization`(`orgID`) ON DELETE RESTRICT ON UPDATE CASCADE;
