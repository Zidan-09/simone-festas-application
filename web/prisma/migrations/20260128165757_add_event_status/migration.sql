/*
  Warnings:

  - Added the required column `status` to the `events` table without a default value. This is not possible if the table is not empty.
  - Made the column `event_date` on table `events` required. This step will fail if there are existing NULL values in that column.
  - Made the column `event_address` on table `events` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `principal_picture` on table `themes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "event_status" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED', 'POSTPONED');

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "status" "event_status" NOT NULL,
ALTER COLUMN "event_date" SET NOT NULL,
ALTER COLUMN "event_address" SET NOT NULL;

-- AlterTable
ALTER TABLE "items" ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "themes" ALTER COLUMN "principal_picture" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "address" SET NOT NULL;
