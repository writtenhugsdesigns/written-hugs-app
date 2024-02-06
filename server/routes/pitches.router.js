const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

router.get("/", rejectUnauthenticated, (req, res) => {
  const sqlText = `
  SELECT
    pitches.id as pitches_id,
    pitches.wholesaler_id,
    pitches.is_current,
    pitches.description,
    pitches.name,
    pitches.updated_at,
    wholesalers.company_name as wholesaler_company_name,
    "user".username as wholesaler_user,
    pitches_cards.ordered as card_ordered,
    cards.id as card_id,
    cards.name as card_name,
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
    ORDER BY pitches_id, card_id, category_id;`;

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
          (newInput[0] &&
            newInput[newInputLength - 1].pitches_id !=
            result.rows[i].pitches_id)
        ) {
          input = result.rows[i];
          newInput.push({
            pitches_id: input.pitches_id,
            wholesaler_id: input.wholesaler_id,
            wholesaler_company_name: input.wholesaler_company_name,
            wholesaler_name: input.wholesaler_user,
            date: input.updated_at,
            is_current: input.is_current,
            name: input.name,
            description: input.description,
            cards: [
              {
                id: input.card_id,
                card_name: input.card_name,
                vendor_style: input.vendor_style,
                description: input.cards_description,
                upc: input.upc,
                sku: input.sku,
                barcode: input.barcode,
                front_img: { raw: input.front_img, display: '' },
                inner_img: { raw: input.inner_img, display: '' },
                insert_img: { raw: input.insert_img, display: '' },
                sticker_jpeg: { raw: input.sticker_jpeg, display: '' },
                sticker_pdf: input.sticker_pdf,
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
            card_name: input.card_name,
            vendor_style: input.vendor_style,
            description: input.cards_description,
            upc: input.upc,
            sku: input.sku,
            barcode: input.barcode,
            front_img: { raw: input.front_img, display: '' },
            inner_img: { raw: input.inner_img, display: '' },
            insert_img: { raw: input.insert_img, display: '' },
            sticker_jpeg: { raw: input.sticker_jpeg, display: '' },
            sticker_pdf: input.sticker_pdf,
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
      const thePitches = formatPitches(newInput)
      res.send(thePitches);
    })
    .catch((err) => {
      console.log("Error in pitches GET router,", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const sqlText = `
  INSERT INTO "pitches"
    ("wholesaler_id", "is_current", "description", "name")
  VALUES
    ($1, true, $2, $3)
    RETURNING "id";`;
  pool
    .query(sqlText, [
      req.body.wholesaler_id,
      req.body.pitchDescription,
      req.body.pitchName
    ])
    .then((result) => {
      const pitch_id = result.rows[0].id
      const cardsArray = req.body.newPitch
      const insertPitchesCardsQuery = newPitchesCardsQuery(cardsArray, pitch_id);
      // SECOND QUERY ADDS categories FOR THAT NEW card
      pool.query(insertPitchesCardsQuery)
        .then(result => {
          //Now that both are done, send back success!
          res.sendStatus(201);
        }).catch(err => {
          // catch for second query
          console.log("Error in pitches_cards POST route,", err);
          res.sendStatus(500);
        })
        .catch((err) => {
          // catch for the first query
          console.log("Error in pitches POST route,", err);
          res.sendStatus(500);
        });
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const sqlText = `
  UPDATE "pitches"
  SET "wholesaler_id" = $1,
      "description" = $2,
      "name" = $3
  WHERE "id" = $4;`;

  const sqlValues = [
    req.body.wholesaler_id,
    req.body.pitchDescription,
    req.body.pitchName,
    req.params.id,
  ];
  pool
    .query(sqlText, sqlValues)
    .then(result => {
      const queryDeleteText = `
      DELETE FROM pitches_cards
        WHERE pitch_id=${req.params.id};
      `;
      // second QUERY removes cards FOR THAT pitch
      pool.query(queryDeleteText)
        .then(result => {
          const cardsArray = req.body.newPitch
          const pitch_id = req.params.id
          const insertEditPitchesCardsQuery = newPitchesCardsQuery(cardsArray, pitch_id);
          // Third QUERY ADDS cards FOR THAT pitch
          pool.query(insertEditPitchesCardsQuery)
            .then(result => {
              res.sendStatus(201);
            }).catch(err => {
              // catch for third query
              console.log(err);
              res.sendStatus(500)
            })
        }).catch(err => {
          // catch for second query
          console.log(err);
          res.sendStatus(500)
        })
        .catch((err) => {
          // catch for second query
          console.log("Error in pitches PUT route,", err);
          res.sendStatus(500);
        });
    });
});

router.delete("/:id", rejectUnauthenticated, async (req, res) => {
  let connection;
  try {
    let pitches_cardsQueryText = `
    DELETE FROM "pitches_cards"
    WHERE "pitch_id" = $1;`;

    let pitchesQueryText = `
    DELETE FROM "pitches"
    WHERE "id" = $1;`;

    connection = await pool.connect();
    connection.query("BEGIN;");

    const pitchesCardsRes = await connection.query(pitches_cardsQueryText, [
      req.params.id,
    ]);
    const partyCharacterRes = await connection.query(pitchesQueryText, [
      req.params.id,
    ]);

    connection.query("COMMIT;");
    connection.release();

    res.sendStatus(201);
  } catch (err) {
    console.log("Error in pitches DELETE:", err);
    connection.query("ROLLBACK;");
    connection.release();
    res.sendStatus(500);
  }
});

function formatPitches(pitches) {
  for (let i = 0; i < pitches.length; i++) {
    for (let j = 0; j < pitches[i].cards.length; j++) {
      pitches[i].cards[j].front_img.display = `https://drive.google.com/thumbnail?id=${pitches[i].cards[j].front_img.raw}`;
      pitches[i].cards[j].inner_img.display = `https://drive.google.com/thumbnail?id=${pitches[i].cards[j].inner_img.raw}`;
      pitches[i].cards[j].insert_img.display = `https://drive.google.com/thumbnail?id=${pitches[i].cards[j].insert_img.raw}`;
      pitches[i].cards[j].sticker_jpeg.display = `https://drive.google.com/thumbnail?id=${pitches[i].cards[j].sticker_jpeg.raw}`;
    }
  }
  return pitches
}

/**  
* this function takes in an array of cards 
* it's goal is to create a query to insert multiple rows in the pitches_cards table
* since a single pitch could have multiple cards
* */
function newPitchesCardsQuery(cardsArray, pitch_id) {
  let pitchesCardsQuery = `
  INSERT INTO "pitches_cards"
  ("pitch_id", "card_id", "ordered")
  VALUES
  `
  for (let i = 0; i < cardsArray.length; i++) {
    // adds the appropriate ids
    if (i < cardsArray.length - 1) {
      pitchesCardsQuery += `
      (${pitch_id}, ${cardsArray[i].card_id}, false),
    `
      // adds the appropriate ids and a semi colon
    } else if (i === cardsArray.length - 1) {
      pitchesCardsQuery += `
      (${pitch_id}, ${cardsArray[i].card_id}, false);
      `
    }
  }
  return pitchesCardsQuery;
}

module.exports = router;
