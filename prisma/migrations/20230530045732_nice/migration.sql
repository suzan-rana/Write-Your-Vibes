/*
  Warnings:

  - A unique constraint covering the columns `[category_name]` on the table `category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `category_category_name_key` ON `category`(`category_name`);
