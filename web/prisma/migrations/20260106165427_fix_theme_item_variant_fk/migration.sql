-- DropForeignKey
ALTER TABLE "theme_items" DROP CONSTRAINT "fk_theme_items_item";

-- DropIndex
DROP INDEX "unique_theme_item";

-- AddForeignKey
ALTER TABLE "theme_items" ADD CONSTRAINT "fk_theme_items_item" FOREIGN KEY ("item_id") REFERENCES "item_variants"("variant_id") ON DELETE CASCADE ON UPDATE NO ACTION;
