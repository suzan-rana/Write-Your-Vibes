/*
  Warnings:

  - You are about to drop the `manypostmanycategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `manypostmanycategory` DROP FOREIGN KEY `ManyPostManyCategory_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `manypostmanycategory` DROP FOREIGN KEY `ManyPostManyCategory_postId_fkey`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `categoryId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `manypostmanycategory`;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
