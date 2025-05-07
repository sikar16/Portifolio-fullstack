/*
  Warnings:

  - You are about to drop the column `tecnology` on the `project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `tecnology`,
    ADD COLUMN `technology` VARCHAR(191) NULL;
