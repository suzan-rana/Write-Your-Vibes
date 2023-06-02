/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId]` on the table `reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `reaction_postId_userId_key` ON `reaction`(`postId`, `userId`);
