/*
  Warnings:

  - Added the required column `rating` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "rating" INTEGER NOT NULL;
