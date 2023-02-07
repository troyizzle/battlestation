/*
  Warnings:

  - A unique constraint covering the columns `[username,discriminator]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username,discriminator]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Participant_username_discriminator_key" ON "Participant"("username", "discriminator");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_discriminator_key" ON "User"("username", "discriminator");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_username_discriminator_fkey" FOREIGN KEY ("username", "discriminator") REFERENCES "User"("username", "discriminator") ON DELETE RESTRICT ON UPDATE CASCADE;
