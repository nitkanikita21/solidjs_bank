/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `Card` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Card_ownerId_key" ON "Card"("ownerId");
