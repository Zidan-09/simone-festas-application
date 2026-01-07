/*
  Warnings:

  - You are about to drop the `theme_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "theme_items" DROP CONSTRAINT "fk_theme_items_item";

-- DropForeignKey
ALTER TABLE "theme_items" DROP CONSTRAINT "fk_theme_items_theme";

-- AlterTable
ALTER TABLE "item_variants" ADD COLUMN     "keyWords" TEXT[];

-- AlterTable
ALTER TABLE "themes" ADD COLUMN     "keyWords" TEXT[];

-- DropTable
DROP TABLE "theme_items";
