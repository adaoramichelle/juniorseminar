/*
  Warnings:

  - You are about to drop the column `externalId` on the `RecBook` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `RecBook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `googleId` to the `RecBook` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RecBook_externalId_key";

-- AlterTable
ALTER TABLE "RecBook" DROP COLUMN "externalId",
ADD COLUMN     "googleId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RecBook_googleId_key" ON "RecBook"("googleId");
