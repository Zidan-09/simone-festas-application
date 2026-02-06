-- CreateEnum
CREATE TYPE "kit_type" AS ENUM ('SIMPLE', 'CYLINDER');

-- CreateTable
CREATE TABLE "event_kit" (
    "event_kit_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "theme_id" UUID NOT NULL,
    "tables_id" UUID NOT NULL,
    "kit_type" "kit_type" NOT NULL,

    CONSTRAINT "event_kit_pkey" PRIMARY KEY ("event_kit_id")
);

-- CreateTable
CREATE TABLE "event_table" (
    "event_table_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "color_id" UUID NOT NULL,
    "number_of_people" INTEGER NOT NULL,

    CONSTRAINT "event_table_pkey" PRIMARY KEY ("event_table_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_kit_event_id_key" ON "event_kit"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_table_event_id_key" ON "event_table"("event_id");

-- AddForeignKey
ALTER TABLE "event_kit" ADD CONSTRAINT "fk_event_kit_event" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_kit" ADD CONSTRAINT "fk_event_kit_theme" FOREIGN KEY ("theme_id") REFERENCES "themes"("theme_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_kit" ADD CONSTRAINT "fk_event_kit_tables" FOREIGN KEY ("tables_id") REFERENCES "item_variants"("variant_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_table" ADD CONSTRAINT "fk_event_table_event" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_table" ADD CONSTRAINT "fk_event_table_color" FOREIGN KEY ("color_id") REFERENCES "item_variants"("variant_id") ON DELETE CASCADE ON UPDATE NO ACTION;
