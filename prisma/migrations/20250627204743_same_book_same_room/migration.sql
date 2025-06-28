/*
  Warnings:

  - You are about to drop the column `bookId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `bookName` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_bookId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "bookId",
ADD COLUMN     "bookName" TEXT NOT NULL;
