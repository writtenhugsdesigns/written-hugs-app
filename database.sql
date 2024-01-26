-- DATABASE NAME: written_hugs

create table "users" (
	"id" integer primary key,
	"username" varchar,
	"password" varchar,
	"user_role" varchar,
    "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

create table "stickers" (
	"id" integer primary key,
	"name" varchar,
	"sticker_jpeg" varchar,
	"sticker_pdf" varchar,
    "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

create table "cards" (
	"id" integer primary key,
	"name" varchar,
	"category" varchar,
	"UPC" integer,
	"SKU" integer,
	"barcode" varchar,
	"front_img" varchar,
	"front_tiff" varchar,
	"inner_img" varchar,
	"insert_img" varchar,
	"insert_ai" varchar,
	"raw_art" varchar,
	"sticker_id" integer references "stickers",
    "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

create table "wholesalers" (
	"id" integer primary key,
	"company_name" varchar,
	"user_id" integer references "users",
    "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

create table "pitches" (
	"id" integer primary key,
	"wholesaler_id" integer references "wholesalers",
	"is_current" boolean,
	"description" text,
    "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

create table "pitches_cards" (
	"id" integer primary key,
	"pitch_id" integer references "pitches",
	"card_id" integer references "cards",
	"ordered" boolean,
    "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);


create table "categories" (
	"id" integer primary key,
	"name" varchar,
    "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

create table "cards_categories" (
	"id" integer primary key,
	"card_id" integer references "cards",
	"category_id" integer references "categories",
    "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Create a function that sets a row's updated_at column
-- to NOW():
CREATE OR REPLACE FUNCTION set_updated_at_to_now()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger on each table that will execute
-- the set_update_at_to_now function on any rows that
-- have been touched by an UPDATE query: 
-- Aka keeps updated_at always correct without us doing
-- anything, yay!
CREATE TRIGGER on_user_update
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();

CREATE TRIGGER on_stickers_update
BEFORE UPDATE ON "stickers"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();

CREATE TRIGGER on_cards_update
BEFORE UPDATE ON "cards"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();

CREATE TRIGGER on_wholesalers_update
BEFORE UPDATE ON "wholesalers"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();

CREATE TRIGGER on_pitches_update
BEFORE UPDATE ON "pitches"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();

CREATE TRIGGER on_pitches_cards_update
BEFORE UPDATE ON "pitches_cards"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();

CREATE TRIGGER on_categories_update
BEFORE UPDATE ON "categories"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();

CREATE TRIGGER on_cards_categories_update
BEFORE UPDATE ON "cards_categories"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();


-- DUMMY DATA INSERTS!
