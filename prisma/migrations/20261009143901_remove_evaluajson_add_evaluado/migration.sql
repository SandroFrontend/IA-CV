/*
  Warnings:

  - You are about to drop the column `evaluaJSON` on the `EscapareteSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EscapareteSession" DROP COLUMN "evaluaJSON",
ADD COLUMN     "evaluado" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ItemRubrica" ADD COLUMN     "rubricaId" TEXT;
