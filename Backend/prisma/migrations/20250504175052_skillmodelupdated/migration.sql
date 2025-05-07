-- CreateTable
CREATE TABLE `_SkillToSkillItem` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SkillToSkillItem_AB_unique`(`A`, `B`),
    INDEX `_SkillToSkillItem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_SkillToSkillItem` ADD CONSTRAINT `_SkillToSkillItem_A_fkey` FOREIGN KEY (`A`) REFERENCES `Skill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SkillToSkillItem` ADD CONSTRAINT `_SkillToSkillItem_B_fkey` FOREIGN KEY (`B`) REFERENCES `SkillItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
