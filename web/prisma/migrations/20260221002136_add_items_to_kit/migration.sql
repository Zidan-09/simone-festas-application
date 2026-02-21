-- CreateTable
CREATE TABLE "event_kit_items" (
    "event_kit_item_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_kit_id" UUID NOT NULL,
    "item_variant_id" UUID NOT NULL,
    "item_quantity" INTEGER NOT NULL,
    "returned_at" TIMESTAMPTZ(6),

    CONSTRAINT "event_kit_items_pkey" PRIMARY KEY ("event_kit_item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_kit_items_event_kit_id_item_variant_id_key" ON "event_kit_items"("event_kit_id", "item_variant_id");

-- AddForeignKey
ALTER TABLE "event_kit_items" ADD CONSTRAINT "event_kit_items_event_kit_id_fkey" FOREIGN KEY ("event_kit_id") REFERENCES "event_kit"("event_kit_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_kit_items" ADD CONSTRAINT "event_kit_items_item_variant_id_fkey" FOREIGN KEY ("item_variant_id") REFERENCES "item_variants"("variant_id") ON DELETE CASCADE ON UPDATE CASCADE;
