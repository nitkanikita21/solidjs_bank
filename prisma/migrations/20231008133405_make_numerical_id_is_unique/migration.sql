/*
  Warnings:

  - A unique constraint covering the columns `[numericalId]` on the table `Card` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Card_numericalId_key" ON "Card"("numericalId");
