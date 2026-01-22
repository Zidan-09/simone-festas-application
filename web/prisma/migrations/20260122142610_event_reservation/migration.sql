/*
  Warnings:

  - A unique constraint covering the columns `[event_id,service_id]` on the table `event_services` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "total_paid" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "event_items" (
    "event_item_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "item_variant_id" UUID NOT NULL,
    "item_quantity" INTEGER NOT NULL,

    CONSTRAINT "event_items_pkey" PRIMARY KEY ("event_item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_items_event_id_item_variant_id_key" ON "event_items"("event_id", "item_variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_services_event_id_service_id_key" ON "event_services"("event_id", "service_id");

-- AddForeignKey
ALTER TABLE "event_services" ADD CONSTRAINT "fk_event_services_event" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_items" ADD CONSTRAINT "fk_event_items_event" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_items" ADD CONSTRAINT "fk_event_items_item" FOREIGN KEY ("item_variant_id") REFERENCES "item_variants"("variant_id") ON DELETE CASCADE ON UPDATE NO ACTION;
