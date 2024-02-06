-- Database Name: written-hugs 

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
	"name" text,
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
	"category_id" integer references "categories" ON DELETE CASCADE,
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
('Test1', 'password', 'ADMIN'), -- this password is not hashed, so don't attempt to log in like this
('Test2', 'password', 'ADMIN'); -- this password is not hashed, so don't attempt to log in like this

INSERT INTO "cards"
("name", "vendor_style", "description", "upc", "sku", "barcode", "front_img", "front_tiff", "inner_img", "insert_img", "insert_ai", "raw_art", "sticker_jpeg", "sticker_pdf")
VALUES
('more goat', 'GZ123', 'dam thats a lot of goats', 111, 1111, 11111, '1w82PH57o43XCZt87nxZS3OHikUzkfkBV', '1dwMYyhnjNdhXUu30PmmHKN1be243VDlZ', '1zKpy1ZMS0E1KQjBlAimz6aY2wLTOwKXV', '1Y4QHkNOIQ06aukT47gepctts_ci_mlF7', '1OgZMW-bqU2igOazlL6vhQ6r1qOBrysQ4', 'RAW ART GOES HERE', '1Oq0VCUGznClS7ohgu2r_xP-4BuqygzHn', '1tJ3DhRV25aUASp_SwC5b2HfnxJAIwQT4'),
('goat card 2.png', 'GZ123', 'This is the second goat list, with same images', 222, 2222, 22222, '1w82PH57o43XCZt87nxZS3OHikUzkfkBV', '1dwMYyhnjNdhXUu30PmmHKN1be243VDlZ', '1zKpy1ZMS0E1KQjBlAimz6aY2wLTOwKXV', '1Y4QHkNOIQ06aukT47gepctts_ci_mlF7', '1OgZMW-bqU2igOazlL6vhQ6r1qOBrysQ4', 'RAW ART GOES HERE', '1Oq0VCUGznClS7ohgu2r_xP-4BuqygzHn', '1tJ3DhRV25aUASp_SwC5b2HfnxJAIwQT4'),
('goat card 5', 'GZ123', 'This is the third goat list, but also a monty python reference. SWAPPED INNER AND INSERT IMG!', 555, 5555, 55555, '1w82PH57o43XCZt87nxZS3OHikUzkfkBV', '1dwMYyhnjNdhXUu30PmmHKN1be243VDlZ', '1Y4QHkNOIQ06aukT47gepctts_ci_mlF7', '1zKpy1ZMS0E1KQjBlAimz6aY2wLTOwKXV', '1OgZMW-bqU2igOazlL6vhQ6r1qOBrysQ4', 'RAW ART GOES HERE', '1Oq0VCUGznClS7ohgu2r_xP-4BuqygzHn', '1tJ3DhRV25aUASp_SwC5b2HfnxJAIwQT4'),
('goat card 5.2', 'GZ123', 'this is the same as 5 but better as the 4th index.', 555, 5555, 55555, '1w82PH57o43XCZt87nxZS3OHikUzkfkBV', '1dwMYyhnjNdhXUu30PmmHKN1be243VDlZ', '1Y4QHkNOIQ06aukT47gepctts_ci_mlF7', '1zKpy1ZMS0E1KQjBlAimz6aY2wLTOwKXV', '1OgZMW-bqU2igOazlL6vhQ6r1qOBrysQ4', 'RAW ART GOES HERE', '1Oq0VCUGznClS7ohgu2r_xP-4BuqygzHn', '1tJ3DhRV25aUASp_SwC5b2HfnxJAIwQT4');

INSERT INTO "wholesalers"
("company_name", "user_id")
VALUES
('goatget', 1),
('get those goats', 1),
('more goats because I need them', 2);

INSERT INTO "pitches"
("wholesaler_id", "is_current", "name" "description")
VALUES
(1, TRUE, "God's perfect creation", 'This be goats wow much amaze');
(2, FALSE, "pitch to test2? amazing", 'Test2 ordered goats, but this isnt current so not important.'),
(1, FALSE, "oops duplicate? Actually no", 'Test1 Order 2 for this be goats wow much amaze');

INSERT INTO "pitches_cards"
("pitch_id", "card_id", "ordered")
VALUES
(1, 1, false),
(1, 2, false),
(1, 3, false),
(2, 3, false),
(2, 1, false),
(2, 4, false),
(3, 2, false),
(3, 1, false),
(3, 3, false);

INSERT INTO "categories"
("name")
VALUES
('goats'),
('Greatest Of All Time'),
('Category 3'),
('goat with z');

INSERT INTO "cards_categories"
("card_id", "category_id")
VALUES
(1, 1), 
(1, 2), 
(1, 3), 
(2, 1), 
(2, 3), 
(3, 1), 
(4, 4), 
(4, 3), 
(4, 2);
