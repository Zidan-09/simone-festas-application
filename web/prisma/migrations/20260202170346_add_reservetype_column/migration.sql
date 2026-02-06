/*
  Warnings:

  - Added the required column `reserve_type` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "reserve_type" TEXT NOT NULL;
