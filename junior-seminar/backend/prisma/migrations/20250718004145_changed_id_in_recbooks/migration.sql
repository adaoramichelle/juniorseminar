/*
  Warnings:

  - You are about to drop the column `author` on the `Book` table. All the data in the column will be lost.
  - The primary key for the `RecBook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RecBook` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "author";

-- AlterTable
ALTER TABLE "RecBook" DROP CONSTRAINT "RecBook_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RecBook_pkey" PRIMARY KEY ("id");
