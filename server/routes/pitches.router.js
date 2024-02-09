const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

router.get("/", rejectUnauthenticated, (req, res) => {
  // This sql text gets us our information sorted by:
  // Pitch id, then card id, then category id.
  // This is essential since it garentees our loop to sort it works
  // each time.
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
      // sets our new formatted array to send back to our server. Starts at blank
      let newInput = [];

      // Loops through our result.rows to begin the process of sorting our informaiton
      for (i = 0; i < result.rows.length; i++) {
        // setting lengths of all of the parts of our result so we can easily
        // find their lengths.
        let newInputLength = newInput.length;
        let cardsLength;
        let categoriesLength;

        // only really setting the cards and categories lengths if newInput has content.
        if (newInputLength > 0) {
          cardsLength = newInput[newInputLength - 1].cards.length;
          categoriesLength =
            newInput[newInputLength - 1].cards[cardsLength - 1].categories_array
              .length;
        }

        // If our first input is nonexistent, or if we have a new pitches_id
        // (aka if the pitches_id != pitches_id)
        // we need to add a new pitch to our newInput return.
        if (
          newInput[0] === undefined ||
          (newInput[0] &&
            newInput[newInputLength - 1].pitches_id !=
              result.rows[i].pitches_id)
        ) {
          // Input gets our index in result.rows so we don't have to type it out
          // every time
          input = result.rows[i];

          // Because we have a completely new pitch, we can also fill in the other
          // info which comes with it, such as its card and its first category.
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
                card_id: input.card_id,
                name: input.card_name,
                vendor_style: input.vendor_style,
                description: input.cards_description,
                upc: input.upc,
                sku: input.sku,
                barcode: input.barcode,
                front_img: {
                  raw: input.front_img,
                  display: `https://drive.google.com/thumbnail?id=${input.front_img}`,
                },
                inner_img: {
                  raw: input.inner_img,
                  display: `https://drive.google.com/thumbnail?id=${input.inner_img}`,
                },
                insert_img: {
                  raw: input.insert_img,
                  display: `https://drive.google.com/thumbnail?id=${input.insert_img}`,
                },
                sticker_jpeg: {
                  raw: input.sticker_jpeg,
                  display: `https://drive.google.com/thumbnail?id=${input.sticker_jpeg}`,
                },
                sticker_pdf: input.sticker_pdf,
                categories_array: [
                  {
                    category_name: input.category_name,
                    category_id: input.category_id,
                  },
                ],
              },
            ],
          });
        }

        // Now we ask if there is a new card to be added by first seeing if newInput
        // exits, and then seeing if its latest card_id is the same as our card_id
        // from the server. If it is not the same we need a new card.
        else if (
          newInput[0] &&
          newInput[newInputLength - 1].cards[cardsLength - 1].card_id !=
            result.rows[i].card_id
        ) {
          input = result.rows[i];

          // Puts our new row into our last input in newInput into their cards
          // adds the first category into it as well, since the row includes it
          newInput[newInputLength - 1].cards.push({
            card_id: input.card_id,
            name: input.card_name,
            vendor_style: input.vendor_style,
            description: input.cards_description,
            upc: input.upc,
            sku: input.sku,
            barcode: input.barcode,
            front_img: {
              raw: input.front_img,
              display: `https://drive.google.com/thumbnail?id=${input.front_img}`,
            },
            inner_img: {
              raw: input.inner_img,
              display: `https://drive.google.com/thumbnail?id=${input.inner_img}`,
            },
            insert_img: {
              raw: input.insert_img,
              display: `https://drive.google.com/thumbnail?id=${input.insert_img}`,
            },
            sticker_jpeg: {
              raw: input.sticker_jpeg,
              display: `https://drive.google.com/thumbnail?id=${input.sticker_jpeg}`,
            },
            sticker_pdf: input.sticker_pdf,
            categories_array: [
              {
                category_name: input.category_name,
                category_id: input.category_id,
              },
            ],
          });
        }

        // last else checks to see if there needs to be a new category by seeing
        // if the last input of category_id does not equal the result.rows current
        // category_id. It then goes to add the new category into its row.
        else if (
          newInput[0] &&
          newInput[newInputLength - 1].cards[cardsLength - 1].categories_array[
            categoriesLength - 1
          ].category_id != result.rows[i].category_id
        ) {
          input = result.rows[i];

          // Pushes the new categories into its respective list. Doesn't need
          // any more information for this else.
          newInput[newInputLength - 1].cards[
            cardsLength - 1
          ].categories_array.push({
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

router.post("/", rejectUnauthenticated, async (req, res) => {
  let connection;
  try {
    const sqlText = `
    INSERT INTO "pitches"
      ("wholesaler_id", "is_current", "description", "name")
    VALUES
      ($1, true, $2, $3)
      RETURNING "id";`;

    connection = await pool.connect();
    connection.query("BEGIN;");

    const pitchesRes = await connection.query(sqlText, [
      req.body.wholesaler_id,
      req.body.pitchDescription,
      req.body.pitchName,
    ]);
    const pitch_id = pitchesRes.rows[0].id;
    const cardsArray = req.body.newPitch;
    const insertPitchesCardsQuery = newPitchesCardsQuery(cardsArray, pitch_id);
    const pitchesCardsRes = await connection.query(insertPitchesCardsQuery);

    connection.query("COMMIT;");
    connection.release();

    res.sendStatus(201);
  } catch (err) {
    console.log("Error in pitches POST:", err);
    connection.query("ROLLBACK;");
    connection.release();
    res.sendStatus(500);
  }
});

router.put("/:id", rejectUnauthenticated, async (req, res) => {
  let connection;
  try {
    const sqlText = `
    UPDATE "pitches"
    SET "wholesaler_id" = $1,
        "description" = $2,
        "name" = $3,
        "is_current" = $4
    WHERE "id" = $5;`;

    const sqlValues = [
      req.body.wholesaler_id,
      req.body.pitchDescription,
      req.body.pitchName,
      req.body.is_current,
      req.params.id,
    ];

    const cardsArray = req.body.newPitch;
    const pitch_id = req.params.id;
    const insertEditPitchesCardsQuery = newPitchesCardsQuery(
      cardsArray,
      pitch_id
    );

    const queryDeleteText = `
      DELETE FROM pitches_cards
        WHERE pitch_id=${req.params.id};
      `;

    connection = await pool.connect();
    connection.query("BEGIN;");

    const updatePitches = await connection.query(sqlText, sqlValues);
    // second QUERY removes cards FOR THAT pitch
    const deletePitchesCards = await connection.query(queryDeleteText);
    // Third QUERY ADDS cards FOR THAT pitch
    const insertEditPitches = await connection.query(
      insertEditPitchesCardsQuery
    );

    connection.query("COMMIT;");
    connection.release();

    res.sendStatus(201);
  } catch (err) {
    console.log("Error in pitches PUT:", err);
    connection.query("ROLLBACK;");
    connection.release();
    res.sendStatus(500);
  }
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
  `;
  for (let i = 0; i < cardsArray.length; i++) {
    // adds the appropriate ids
    if (i < cardsArray.length - 1) {
      pitchesCardsQuery += `
      (${pitch_id}, ${cardsArray[i].card_id}, false),
    `;
      // adds the appropriate ids and a semi colon
    } else if (i === cardsArray.length - 1) {
      pitchesCardsQuery += `
      (${pitch_id}, ${cardsArray[i].card_id}, false);
      `;
    }
  }
  return pitchesCardsQuery;
}

module.exports = router;
