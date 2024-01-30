-- Database Name: written-hugs
DROP 

create table "user" (
	"id" serial primary key,
	"username" varchar,
	"password" varchar,
	"user_role" varchar,
    "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

create table "cards" (
	"id" serial primary key,
	"name" varchar,
	"vendor_style" varchar,
    "description" varchar, -- this is new! added for description.
	"upc" integer,
	"sku" integer,
	"barcode" varchar,
	"front_img" varchar,
	"front_tiff" varchar,
	"inner_img" varchar,
	"insert_img" varchar,
	"insert_ai" varchar,
	"raw_art" varchar,
	"sticker_jpeg" varchar,
    "sticker_pdf" varchar,
    "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

create table "wholesalers" (
	"id" serial primary key,
	"company_name" varchar,
	"user_id" integer references "user",
    "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

create table "pitches" (
	"id" serial primary key,
	"wholesaler_id" integer references "wholesalers",
	"is_current" boolean,
	"description" text,
    "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

create table "pitches_cards" (
	"id" serial primary key,
	"pitch_id" integer references "pitches",
	"card_id" integer references "cards",
	"ordered" boolean,
    "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);


create table "categories" (
	"id" serial primary key,
	"name" varchar,
    "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

create table "cards_categories" (
	"id" serial primary key,
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
BEFORE UPDATE ON "user"
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
INSERT INTO "user"
("username", "password", "user_role")
VALUES
('Test1', 'password', 'ADMIN'); -- this password is not hashed, so don't attempt to log in like this

INSERT INTO "cards"
("name", "category", "description", "upc", "sku", "barcode", "front_img", "front_tiff", "inner_img", "insert_img", "insert_ai", "raw_art", "sticker_jpeg", "sticker_pdf")
VALUES
('more goat', 'goats', 'dam thats a lot of goats', 111, 1111, 11111, 'https://drive.google.com/file/d/1w82PH57o43XCZt87nxZS3OHikUzkfkBV/view?usp=sharing', 'https://drive.google.com/file/d/1dwMYyhnjNdhXUu30PmmHKN1be243VDlZ/view?usp=sharing', 'inner image?', 'insert image?', 'https://drive.google.com/file/d/1OgZMW-bqU2igOazlL6vhQ6r1qOBrysQ4/view?usp=sharing', 'RAW ART GOES HERE', 'https://drive.google.com/file/d/1Oq0VCUGznClS7ohgu2r_xP-4BuqygzHn/view?usp=sharing', 'https://drive.google.com/file/d/1tJ3DhRV25aUASp_SwC5b2HfnxJAIwQT4/view?usp=sharing');

INSERT INTO "wholesalers"
("company_name", "user_id")
VALUES
('goatget', 1);

INSERT INTO "pitches"
("wholesaler_id", "is_current", "description")
VALUES
(1, TRUE, 'This be goats wow much amaze');

INSERT INTO "pitches_cards"
("pitch_id", "card_id", "ordered")
VALUES
(1, 1, false);

INSERT INTO "categories"
("name")
VALUES
('goats'),
('goatz');

INSERT INTO "cards_categories"
("card_id", "category_id")
VALUES
(1, 1), 
(1, 2);
