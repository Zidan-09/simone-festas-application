/*
  Warnings:

  - You are about to drop the `event_items` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "event_items" DROP CONSTRAINT "event_items_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_items" DROP CONSTRAINT "event_items_item_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "item_variants" DROP CONSTRAINT "item_variants_item_id_fkey";

-- DropForeignKey
ALTER TABLE "theme_images" DROP CONSTRAINT "theme_images_theme_id_fkey";

-- DropForeignKey
ALTER TABLE "theme_items" DROP CONSTRAINT "theme_items_item_id_fkey";

-- DropForeignKey
ALTER TABLE "theme_items" DROP CONSTRAINT "theme_items_theme_id_fkey";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "total_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
ALTER COLUMN "event_id" SET DEFAULT uuid_generate_v4(),
ALTER COLUMN "event_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "item_variants" ADD COLUMN     "stock_quantity" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "variant_id" SET DEFAULT uuid_generate_v4();

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "item_id" SET DEFAULT uuid_generate_v4(),
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "theme_images" ALTER COLUMN "theme_image_id" SET DEFAULT uuid_generate_v4();

-- AlterTable
ALTER TABLE "theme_items" ALTER COLUMN "theme_item_id" SET DEFAULT uuid_generate_v4();

-- AlterTable
ALTER TABLE "themes" ALTER COLUMN "theme_id" SET DEFAULT uuid_generate_v4(),
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "user_id" SET DEFAULT uuid_generate_v4(),
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "is_admin" DROP NOT NULL;

-- DropTable
DROP TABLE "event_items";

-- CreateTable
CREATE TABLE "services" (
    "service_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "event_services" (
    "event_service_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,

    CONSTRAINT "event_services_pkey" PRIMARY KEY ("event_service_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "items_name_key" ON "items"("name");

-- AddForeignKey
ALTER TABLE "theme_images" ADD CONSTRAINT "fk_theme_images_theme" FOREIGN KEY ("theme_id") REFERENCES "themes"("theme_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "theme_items" ADD CONSTRAINT "fk_theme_items_item" FOREIGN KEY ("item_id") REFERENCES "items"("item_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "theme_items" ADD CONSTRAINT "fk_theme_items_theme" FOREIGN KEY ("theme_id") REFERENCES "themes"("theme_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "item_variants" ADD CONSTRAINT "fk_item_variants_item" FOREIGN KEY ("item_id") REFERENCES "items"("item_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "fk_events_owner" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_services" ADD CONSTRAINT "event_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("service_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "theme_items_theme_id_item_id_key" RENAME TO "unique_theme_item";
