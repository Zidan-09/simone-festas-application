/*
  Warnings:

  - You are about to drop the column `returnedAt` on the `event_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event_items" DROP COLUMN "returnedAt",
ADD COLUMN     "returned_at" TIMESTAMPTZ(6);
