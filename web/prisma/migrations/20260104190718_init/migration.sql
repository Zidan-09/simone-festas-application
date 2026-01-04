-- CreateEnum
CREATE TYPE "item_type" AS ENUM ('CURTAIN', 'PANEL', 'DESSERT_STAND', 'TABLE', 'RUG', 'EASEL');

-- CreateEnum
CREATE TYPE "theme_category" AS ENUM ('KIDS', 'ADULTS', 'SPECIAL_EVENTS', 'HOLIDAYS');

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "contact" TEXT,
    "email" TEXT NOT NULL,
    "address" JSONB,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "is_admin" BOOLEAN DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "themes" (
    "theme_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "principal_picture" TEXT,
    "category" "theme_category" NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("theme_id")
);

-- CreateTable
CREATE TABLE "theme_images" (
    "theme_image_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "theme_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "theme_images_pkey" PRIMARY KEY ("theme_image_id")
);

-- CreateTable
CREATE TABLE "theme_items" (
    "theme_item_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "theme_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,

    CONSTRAINT "theme_items_pkey" PRIMARY KEY ("theme_item_id")
);

-- CreateTable
CREATE TABLE "items" (
    "item_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "item_type" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "item_variants" (
    "variant_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "item_id" UUID NOT NULL,
    "variant" TEXT,
    "image" TEXT,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "item_variants_pkey" PRIMARY KEY ("variant_id")
);

-- CreateTable
CREATE TABLE "events" (
    "event_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "event_date" TIMESTAMPTZ(6),
    "event_address" JSONB,
    "total_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "services" (
    "service_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "event_services" (
    "event_service_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,

    CONSTRAINT "event_services_pkey" PRIMARY KEY ("event_service_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "unique_theme_item" ON "theme_items"("theme_id", "item_id");

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
ALTER TABLE "event_services" ADD CONSTRAINT "fk_event_services_service" FOREIGN KEY ("service_id") REFERENCES "services"("service_id") ON DELETE CASCADE ON UPDATE NO ACTION;
