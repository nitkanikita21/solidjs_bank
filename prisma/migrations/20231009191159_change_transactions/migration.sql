/*
  Warnings:

  - The values [IN,OUT] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `inCardId` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('TRANSFER', 'SYSTEM');
ALTER TABLE "Transaction" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "TransactionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_inCardId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "inCardId",
ADD COLUMN     "toCardId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toCardId_fkey" FOREIGN KEY ("toCardId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;
