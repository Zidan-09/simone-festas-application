-- CreateEnum
CREATE TYPE "item_type" AS ENUM ('CURTAIN', 'PANEL', 'DESSERT_STAND', 'TABLE', 'RUG', 'EASEL');

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "contact" TEXT,
    "email" TEXT NOT NULL,
    "address" JSONB,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "themes" (
    "theme_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "principal_picture" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("theme_id")
);

-- CreateTable
CREATE TABLE "theme_images" (
    "theme_image_id" UUID NOT NULL,
    "theme_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "theme_images_pkey" PRIMARY KEY ("theme_image_id")
);

-- CreateTable
CREATE TABLE "theme_items" (
    "theme_item_id" UUID NOT NULL,
    "theme_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "theme_items_pkey" PRIMARY KEY ("theme_item_id")
);

-- CreateTable
CREATE TABLE "items" (
    "item_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "item_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "item_variants" (
    "variant_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "color" TEXT,
    "image" TEXT,

    CONSTRAINT "item_variants_pkey" PRIMARY KEY ("variant_id")
);

-- CreateTable
CREATE TABLE "events" (
    "event_id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "event_date" TIMESTAMP(3),
    "event_address" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "event_items" (
    "event_item_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "item_variant_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "event_items_pkey" PRIMARY KEY ("event_item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "theme_items_theme_id_item_id_key" ON "theme_items"("theme_id", "item_id");

-- AddForeignKey
ALTER TABLE "theme_images" ADD CONSTRAINT "theme_images_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes"("theme_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theme_items" ADD CONSTRAINT "theme_items_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes"("theme_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theme_items" ADD CONSTRAINT "theme_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_variants" ADD CONSTRAINT "item_variants_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_items" ADD CONSTRAINT "event_items_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_items" ADD CONSTRAINT "event_items_item_variant_id_fkey" FOREIGN KEY ("item_variant_id") REFERENCES "item_variants"("variant_id") ON DELETE CASCADE ON UPDATE CASCADE;
