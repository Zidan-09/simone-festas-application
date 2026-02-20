/*
  Warnings:

  - You are about to drop the `event_services` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `serviceId` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "event_services" DROP CONSTRAINT "fk_event_services_event";

-- DropForeignKey
ALTER TABLE "event_services" DROP CONSTRAINT "fk_event_services_service";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "serviceId" UUID NOT NULL;

-- DropTable
DROP TABLE "event_services";

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "fk_events_service" FOREIGN KEY ("serviceId") REFERENCES "services"("service_id") ON DELETE CASCADE ON UPDATE NO ACTION;
