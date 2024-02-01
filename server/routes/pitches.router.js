const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

router.get("/", rejectUnauthenticated, (req, res) => {
  const sqlText = `
  SELECT
    pitches.id,
    pitches.wholesaler_id,
    pitches.is_current,
    pitches.description,
    wholesalers.company_name as wholesaler_company_name,
    "user".username as wholesaler_user,
    pitches_cards.ordered as card_ordered,
    cards.id as card_id,
    cards.name,
    cards.vendor_style,
    cards.description as cards_description,
    cards.upc,
    cards.sku,
    cards.barcode,
    cards.front_img,
    cards.front_tiff,
    cards.inner_img,
    cards.insert_img,
    cards.insert_ai,
    cards.raw_art,
    cards.sticker_jpeg,
    cards.sticker_pdf,
    categories.id as category_id,
    categories.name as category_name
  FROM pitches
    LEFT JOIN wholesalers
    ON wholesalers.id = pitches.wholesaler_id
    LEFT JOIN "user"
    ON "user".id = wholesalers.user_id
    LEFT JOIN pitches_cards
    ON pitches_cards.pitch_id = pitches.id
    LEFT JOIN cards
    ON pitches_cards.card_id = cards.id
    LEFT JOIN cards_categories
    ON cards_categories.card_id = cards.id
    LEFT JOIN categories
    ON cards_categories.category_id = categories.id
    ORDER BY id, card_id, category_id;`;

  pool
    .query(sqlText)
    .then((result) => {
      let newInput = [];
      for (i = 0; i < result.rows.length; i++) {
        let newInputLength = newInput.length;
        let cardsLength;
        let categoriesLength;
        if (newInputLength > 0) {
          cardsLength = newInput[newInputLength - 1].cards.length;
          categoriesLength =
            newInput[newInputLength - 1].cards[cardsLength - 1].categories
              .length;
        }
        if (
          newInput[0] === undefined ||
          (newInput[0] && newInput[newInputLength - 1].id != result.rows[i].id)
        ) {
          input = result.rows[i];
          newInput.push({
            id: input.id,
            wholesaler_id: input.wholesaler_id,
            wholesaler_company_name: input.wholesaler_company_name,
            wholesaler_name: input.wholesaler_user,
            is_current: input.is_current,
            description: input.description,
            cards: [
              {
                id: input.card_id,
                name: input.name,
                vendor_style: input.vendor_style,
                description: input.cards_description,
                upc: input.upc,
                sku: input.sku,
                barcode: input.barcode,
                front_img: input.front_img,
                inner_img: input.inner_img,
                insert_img: input.insert_img,
                sticker_jpeg: input.sticker_jpeg,
                categories: [
                  {
                    category_name: input.category_name,
                    category_id: input.category_id,
                  },
                ],
              },
            ],
          });
        } else if (
          newInput[0] &&
          newInput[newInputLength - 1].cards[cardsLength - 1].id !=
            result.rows[i].card_id
        ) {
          input = result.rows[i];
          newInput[newInputLength - 1].cards.push({
            id: input.card_id,
            name: input.name,
            vendor_style: input.vendor_style,
            description: input.cards_description,
            upc: input.upc,
            sku: input.sku,
            barcode: input.barcode,
            front_img: input.front_img,
            inner_img: input.inner_img,
            insert_img: input.insert_img,
            sticker_jpeg: input.sticker_jpeg,
            categories: [
              {
                category_name: input.category_name,
                category_id: input.category_id,
              },
            ],
          });
        } else if (
          newInput[0] &&
          newInput[newInputLength - 1].cards[cardsLength - 1].categories[
            categoriesLength - 1
          ].category_id != result.rows[i].category_id
        ) {
          input = result.rows[i];
          newInput[newInputLength - 1].cards[cardsLength - 1].categories.push({
            category_name: input.category_name,
            category_id: input.category_id,
          });
        }
      }
      res.send(newInput);
    })
    .catch((err) => {
      console.log("Error in pitches GET router,", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const sqlText = `
  INSERT INTO "pitches"
    ("wholesaler_id", "is_current", "description")
  VALUES
    ($1, $2, $3);`;
  pool
    .query(sqlText, [
      req.body.wholesaler_id,
      req.body.is_current,
      req.body.description,
    ])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Error in wholesaler POST route,", err);
      res.sendStatus(500);
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const sqlText = `
  UPDATE "wholesalers"
  SET "company_name" = $1,
      "user_id" = $2
  WHERE "id" = $3;`;

  const sqlValues = [req.body.company_name, req.body.user_id, req.params.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("Error in wholesalers PUT route,", err);
      res.sendStatus(500);
    });
});

router.delete("/:id", rejectUnauthenticated, (req, res) => {
  const sqlText = `
  DELETE FROM "wholesalers"
  WHERE "id" = $1;`;

  const sqlValues = [req.params.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("Error in wholesalers PUT route,", err);
      res.sendStatus(500);
    });
});

module.exports = router;
