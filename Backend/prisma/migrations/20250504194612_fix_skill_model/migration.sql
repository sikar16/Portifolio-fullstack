/*
  Warnings:

  - You are about to drop the `_skilltoskillitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `skillitem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_skilltoskillitem` DROP FOREIGN KEY `_SkillToSkillItem_A_fkey`;

-- DropForeignKey
ALTER TABLE `_skilltoskillitem` DROP FOREIGN KEY `_SkillToSkillItem_B_fkey`;

-- DropForeignKey
ALTER TABLE `skill` DROP FOREIGN KEY `Skill_skillCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `skill` DROP FOREIGN KEY `Skill_userId_fkey`;

-- DropForeignKey
ALTER TABLE `skillitem` DROP FOREIGN KEY `SkillItem_skillCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `skillitem` DROP FOREIGN KEY `SkillItem_userId_fkey`;

-- DropTable
DROP TABLE `_skilltoskillitem`;

-- DropTable
DROP TABLE `skill`;

-- DropTable
DROP TABLE `skillitem`;

-- CreateTable
CREATE TABLE `Skills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `proficiency` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `skillCategoryId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Skills` ADD CONSTRAINT `Skills_skillCategoryId_fkey` FOREIGN KEY (`skillCategoryId`) REFERENCES `SkillCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Skills` ADD CONSTRAINT `Skills_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
