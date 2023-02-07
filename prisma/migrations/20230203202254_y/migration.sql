/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_username_discriminator_fkey";

-- DropIndex
DROP INDEX "Participant_username_discriminator_key";

-- DropIndex
DROP INDEX "User_username_discriminator_key";

-- CreateIndex
CREATE UNIQUE INDEX "Participant_username_key" ON "Participant"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
