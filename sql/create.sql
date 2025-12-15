
DROP TABLE IF EXISTS event_items CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS theme_items CASCADE;
DROP TABLE IF EXISTS item_variants CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS theme_images CASCADE;
DROP TABLE IF EXISTS themes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS item_type CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE item_type AS ENUM (
  'CURTAIN',
  'PANEL',
  'DESSERT_STAND',
  'TABLE',
  'RUG',
  'EASEL'
);

CREATE TABLE users (
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username text NOT NULL,
  contact text,
  email text UNIQUE NOT NULL,
  address jsonb,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_admin boolean DEFAULT false
);

CREATE TABLE themes (
  theme_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  principal_picture text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE theme_images (
  theme_image_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme_id uuid NOT NULL,
  image_url text NOT NULL,

  CONSTRAINT fk_theme_images_theme
    FOREIGN KEY (theme_id)
    REFERENCES themes(theme_id)
    ON DELETE CASCADE
);

CREATE TABLE items (
  item_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  type item_type NOT NULL,
  price numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE item_variants (
  variant_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id uuid NOT NULL,
  color text,
  image text,

  CONSTRAINT fk_item_variants_item
    FOREIGN KEY (item_id)
    REFERENCES items(item_id)
    ON DELETE CASCADE
);

CREATE TABLE theme_items (
  theme_item_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme_id uuid NOT NULL,
  item_id uuid NOT NULL,
  quantity integer NOT NULL,

  CONSTRAINT unique_theme_item
	UNIQUE (theme_id, item_id),

  CONSTRAINT fk_theme_items_theme
    FOREIGN KEY (theme_id)
    REFERENCES themes(theme_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_theme_items_item
    FOREIGN KEY (item_id)
    REFERENCES items(item_id)
    ON DELETE CASCADE
);

CREATE TABLE events (
  event_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid NOT NULL,
  event_date timestamptz,
  event_address jsonb,
  total_price numeric(10, 2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),

  CONSTRAINT fk_events_owner
    FOREIGN KEY (owner_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE services (
  service_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE event_services (
  event_service_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL,
  service_id uuid NOT NULL,

  CONSTRAINT fk_event_services_event
    FOREIGN KEY (event_id)
    REFERENCES events(event_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_event_services_service
    FOREIGN KEY (service_id)
    REFERENCES services(service_id)
    ON DELETE CASCADE
);

CREATE TABLE event_items (
  event_item_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL,
  item_variant_id uuid NOT NULL,
  quantity integer NOT NULL,

  CONSTRAINT fk_event_items_event
    FOREIGN KEY (event_id)
    REFERENCES events(event_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_event_items_variant
    FOREIGN KEY (item_variant_id)
    REFERENCES item_variants(variant_id)
    ON DELETE CASCADE
);