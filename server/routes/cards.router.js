const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const { google } = require("googleapis");
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const multer = require("multer");
const uploadHandler = multer();
const stream = require("stream");
const { log } = require("console");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/** This function first authorizes to google drive using the JWT api method
 * Then it makes an api get call to google drive to fetch files of
 * the folder mimeType.
 * It returns the folders.
 */
router.get("/folders", rejectUnauthenticated, async (req, res) => {
  const jwtClient = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.PRIVATE_KEY,
    SCOPE
  );
  // console.log("jwtClient before authorize", jwtClient);
  await jwtClient.authorize();
  // console.log("jwtClient after authorize", jwtClient);
  const drive = google.drive({ version: "v3", auth: jwtClient });
  const folders = [];
  const results = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder' and parents = '1wG6GeFUgvvh-8GOHw1NhlfRPUUDfP2H_'",
    fields: "nextPageToken, files(id, name)",
    spaces: "drive",
  });
  res.send(results.data.files);
});

router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT
        c.id,
        c.name,
        c.description, 
        c.vendor_style, 
        c.upc, 
        c.sku, 
        c.barcode, 
        c.front_img, 
        c.front_tiff, 
        c.inner_img, 
        c.insert_img, 
        c.insert_ai, 
        c.raw_art, 
        c.sticker_jpeg, 
        c.sticker_pdf,
        json_agg(
            json_build_object(
                'category_id',
                cat.id,
                'category_name',
                cat.name
            )
        ) categories_array
        FROM cards c
        LEFT JOIN cards_categories cc ON c.id = cc.card_id
        LEFT JOIN categories cat ON cc.category_id = cat.id
    GROUP BY c.id
    ORDER BY c.id;
    `;
  pool
    .query(queryText)
    .then((result) => {
      const theCards = formatCards(result.rows);
      res.send(theCards);
    })
    .catch((err) => {
      console.log("ERROR: Get all cards", err);
      res.sendStatus(500);
    });
});

router.get("/byCategory", rejectUnauthenticated, async (req, res) => {
  let connection;
  try {
    const queryText = `
    SELECT
        c.id,
        c.name,
        c.description, 
        c.vendor_style, 
        c.upc, 
        c.sku, 
        c.barcode, 
        c.front_img, 
        c.front_tiff, 
        c.inner_img, 
        c.insert_img, 
        c.insert_ai, 
        c.raw_art, 
        c.sticker_jpeg, 
        c.sticker_pdf,
        json_agg(
            json_build_object(
                'category_id',
                cat.id,
                'category_name',
                cat.name
            )
        ) categories_array
        FROM cards c
        LEFT JOIN cards_categories cc ON c.id = cc.card_id
        LEFT JOIN categories cat ON cc.category_id = cat.id
    GROUP BY c.id
    ORDER BY c.id;
    `;
    // FIRST QUERY gets cards and formats them

    let pitchesQueryText = `
    DELETE FROM "pitches"
    WHERE "id" = $1;`;

    connection = await pool.connect();
    connection.query("BEGIN;");

    const cardsGetRes = await connection.query(queryText);
    const theCards = formatCards(cardsGetRes.rows);
    const sqlText = `
          SELECT * FROM "categories";
          `;
    // SECOND QUERY gets categories
    const getCategories = await connection.query(sqlText);
    const theCategories = getCategories.rows;
    const cardsByCategory = formatCardsByCategory(theCards, theCategories);
    // Now that both are done, send back cards by category!

    connection.query("COMMIT;");
    connection.release();

    res.send(cardsByCategory);
  } catch (err) {
    console.log("Error in cards GET by category:", err);
    connection.query("ROLLBACK;");
    connection.release();
    res.sendStatus(500);
  }
});

router.post("/newCategory", rejectUnauthenticated, async (req, res) => {
  let connection;
  try {
    const queryText = `
      INSERT INTO "categories"
        ("name")
      VALUES
        ($1)
      RETURNING "id";`;
    const queryValues = [req.body.name];

    connection = await pool.connect();
    connection.query("BEGIN;");

    // FIRST QUERY posts the category
    const postCategory = await connection.query(queryText, queryValues);
    const sqlText = `
      INSERT INTO "cards_categories"
      ("card_id", "category_id")
      VALUES
      ($1, $2)`;
    console.log("card_id", req.body);
    console.log("category_id", postCategory.rows[0].id);
    const sqlValues = [req.body.card.card_id, postCategory.rows[0].id];
    // SECOND QUERY posts into the cards_categories table
    const postCards_Categories = await connection.query(sqlText, sqlValues);
    // Now that both are done, send back card to be fetched!
    connection.query("COMMIT;");
    connection.release();
    console.log(req.body.card.card_id);
    res.send({ id: req.body.card.card_id });
  } catch (err) {
    console.log("Error in cards POST newCategory:", err);
    connection.query("ROLLBACK;");
    connection.release();
    res.sendStatus(500);
  }
});

router.post("/existingCategory", rejectUnauthenticated, (req, res) => {
  const sqlText = `
  INSERT INTO "cards_categories"
  ("card_id", "category_id")
  VALUES
  ($1, $2)`;
  const sqlValues = [req.body.card.card_id, req.body.category.id];
  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      // Now that's done, send back card to be fetched!
      console.log("new cat input?");
      res.send({ id: req.body.card.card_id });
    })
    .catch((err) => {
      console.log("problem posting existing category to existing card", err);
      res.sendStatus(500);
    });
});

/**
 * This post router takes in a new card form data object.  It then passes it through multer.
 * The function does a few things:
 * 1) Authenticates to Google Drive
 * 2) Creates a folder for the new card
 * 3) Creates a file for each file that was uploaded, and return the id
 * 4) Sends the card information to the database
 * 5) Sends the categories information to the card - categories database table
 */
router.post(
  "/",
  uploadHandler.any(),
  rejectUnauthenticated,
  async (req, res) => {
    const folderName = req.body.vendor_style + " " + req.body.name;

    //This creates an object to be populated with the file ids
    const objectToSendToDB = {
      name: req.body.name,
      upc: req.body.upc,
      vendor_style: req.body.vendor_style,
      description: req.body.description,
      barcode: "",
      front_img: "",
      inner_img: "",
      insert_img: "",
      insert_ai: "",
      sticker_jpeg: "",
      sticker_pdf: "",
      front_tiff: "",
    };

    //This creates an authentication token with google
    const jwtClient = new google.auth.JWT(
      process.env.CLIENT_EMAIL,
      null,
      process.env.PRIVATE_KEY,
      SCOPE
    );
    await jwtClient.authorize();
    const drive = google.drive({ version: "v3", auth: jwtClient });

    //This is the metadata to setup the card variant folder
    let fileMetaData = {
      name: folderName,
      parents: ["1wG6GeFUgvvh-8GOHw1NhlfRPUUDfP2H_"],
      mimeType: "application/vnd.google-apps.folder",
    };

    //This creates the folder for the card variant
    const folderResponse = await drive.files.create({
      resource: fileMetaData,
      ignoreDefaultVisibility: true,
      fields: "id",
    });
    const folderID = folderResponse.data.id;

    //This creates a function called uploadFile which sends each file to google drive
    const uploadFile = async (fileObject) => {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(fileObject.buffer);
      const { data } = await drive.files.create({
        media: {
          name: fileObject.mimeType,
          body: bufferStream,
        },
        requestBody: {
          name: fileObject.originalname,
          parents: [folderID],
        },
        fileds: "id.name",
      });
      objectToSendToDB[fileObject.fieldname] = data.id;
    };
    const { body, files } = req;
    for (let f = 0; f < files.length; f++) {
      await uploadFile(files[f]);
    }

    //This setups the DB queryText and queryValues to send to DB
    const queryText = `
    INSERT INTO "cards" 
    ("name", "upc", "vendor_style", "description", "barcode", "front_img", "inner_img", "insert_img", "insert_ai", "sticker_jpeg", "sticker_pdf", "front_tiff")
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING "id";
    `;
    const queryValues = [
      objectToSendToDB.name,
      objectToSendToDB.upc,
      objectToSendToDB.vendor_style,
      objectToSendToDB.description,
      objectToSendToDB.barcode,
      objectToSendToDB.front_img,
      objectToSendToDB.inner_img,
      objectToSendToDB.insert_img,
      objectToSendToDB.insert_ai,
      objectToSendToDB.sticker_jpeg,
      objectToSendToDB.sticker_pdf,
      objectToSendToDB.front_tiff,
    ];

    //This sends the card to the DB, and then the categories array is prepared
    //to send items to the card - categories table.
    await pool.query(queryText, queryValues).then((result) => {
      const card_id = result.rows[0].id;
      const categoriesArray = req.body.categoriesArray.split(",").map(Number);
      const insertCardsCategoriesQuery = newCardsCategoriesQuery(
        categoriesArray,
        card_id
      );
      // SECOND QUERY ADDS categories FOR THAT NEW card
      pool
        .query(insertCardsCategoriesQuery)
        .then((results) => {
          //Now that both are done, send back success!
          res.sendStatus(201);
        })
        .catch((err) => {
          // catch for second query
          console.log(err);
        });
    });
  }
);

router.put("/:id", rejectUnauthenticated, async (req, res) => {
  let connection;
  try {
    const queryText = `
    UPDATE "cards"
      SET 
        "name"=$1, 
        "vendor_style"=$2, 
        "description"=$3,
        "upc"=$4,
        "sku"=$5,
        "barcode"=$6,
        "front_img"=$7,
        "front_tiff"=$8,
        "inner_img"=$9,
        "insert_img"=$10,
        "insert_ai"=$11,
        "raw_art"=$12,
        "sticker_jpeg"=$13,
        "sticker_pdf"=$14
      WHERE
        id=$15;`;

    console.log("req.body:", req.body);

    const queryValues = [
      req.body.card.name,
      req.body.card.vendor_style,
      req.body.card.description,
      req.body.card.upc,
      req.body.card.sku,
      req.body.card.barcode,
      req.body.card.front_img,
      req.body.card.front_tiff,
      req.body.card.inner_img,
      req.body.card.insert_img,
      req.body.card.insert_ai,
      req.body.card.raw_art,
      req.body.card.sticker_jpeg,
      req.body.card.sticker_pdf,
      req.params.id,
    ];

    connection = await pool.connect();
    connection.query("BEGIN;");
    const updateCard = await connection.query(queryText, queryValues);
    const queryDeleteText = `
      DELETE FROM cards_categories
        WHERE card_id=${req.params.id};`;
    // second QUERY removes categories FOR THAT card
    const deleteCategories = await connection.query(queryDeleteText);
    const categoriesArray = req.body.categoriesArrayForQuery;
    const editCardsCategoriesQueryByID = editCardsCategoriesQuery(
      categoriesArray,
      req.params.id
    );
    // Third QUERY ADDS categories FOR THAT card
    const addCardCategories = await connection.query(
      editCardsCategoriesQueryByID
    );

    connection.query("COMMIT;");
    connection.release();
    res.sendStatus(201);
  } catch (err) {
    console.log("Error in cards PUT by ID:", err);
    connection.query("ROLLBACK;");
    connection.release();
    res.sendStatus(500);
  }
});

router.put("/file/:id", uploadHandler.any(), async (req,res) =>
{ const params = req.params.id
  const jwtClient = new google.auth.JWT(
  process.env.CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY,
  SCOPE
  );
    // console.log("jwtClient before authorize", jwtClient);
  await jwtClient.authorize();
    // console.log("jwtClient after authorize", jwtClient);
    console.log("this is the currentImageId:", req.body);
  const drive2 = google.drive({ version: "v2", auth: jwtClient });
  const results = await drive2.files.delete({
    fileId: req.body.currentId,
  });
    const drive = google.drive({ version: "v3", auth: jwtClient });
  const fileObject = req.files[0];
  console.log("here is the response in router.put:", req.body, params);
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const { data } = await drive.files.create({
      media: {
        name: fileObject.mimeType,
        body: bufferStream,
      },
      requestBody: {
        name: req.body.fileType,
        parents: [req.body.folderId],
      },
    });
    console.log("this is the response from google create:", data);
    console.log("here are the three query values:", req.body.fileType, data.id, params);
    const queryText = `
    UPDATE "cards" 
    SET
    ${req.body.fileType} = $1
    WHERE "id" = $2;
    `;
    const queryValues = [
      data.id,
      params
    ];
    console.log("query", queryText);
    await pool.query(queryText, queryValues)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
  })
})

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const queryText = `

      SELECT
      c.id,
      c.name,
      c.description, 
      c.vendor_style, 
      c.upc, 
      c.sku, 
      c.barcode, 
      c.front_img, 
      c.front_tiff, 
      c.inner_img, 
      c.insert_img, 
      c.insert_ai, 
      c.raw_art, 
      c.sticker_jpeg, 
      c.sticker_pdf,
      json_agg(
          json_build_object(
              'category_id',
              cat.id,
              'category_name',
              cat.name
          )
      ) categories_array
      FROM cards c
      LEFT JOIN cards_categories cc ON c.id = cc.card_id
      LEFT JOIN categories cat ON cc.category_id = cat.id
      WHERE c.id = $1
      GROUP BY c.id
      ORDER BY c.id
    ;`;

  const sqlValues = [req.params.id];

  pool
    .query(queryText, sqlValues)
    .then((result) => {
      const theCards = formatCards(result.rows);
      res.send(theCards[0]);
    })
    .catch((error) => {
      console.log("Error in GET /api/cards/:id:", error);
      res.sendStatus(500);
    });
});

router.delete("/", rejectUnauthenticated, async (req, res) => {
  // Deleting on google drive api?

  const card_id = req.query.card_id
  const folder_id = req.query.folder_id
  console.log('card id  and folder id:', card_id, folder_id);
  // let fileMetaData = {
  //   name: folder_id,
  //   parents: ["1wG6GeFUgvvh-8GOHw1NhlfRPUUDfP2H_"],
  //   mimeType: "application/vnd.google-apps.folder",
  // };
  const jwtClient = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.PRIVATE_KEY,
    SCOPE
  );
  // console.log("jwtClient before authorize", jwtClient);
  await jwtClient.authorize();
  // console.log("jwtClient after authorize", jwtClient);
  const drive = google.drive({ version: "v2", auth: jwtClient });
  const results = await drive.files.delete({
    fileId: folder_id,
  });
  
  
  const sqlText = `
  DELETE FROM "cards"
    WHERE "id" = $1;
  `;

  const sqlValues = [card_id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error in DELETE /api/cards/:id:", error);
      res.sendStatus(500);
    });
});

/**
 * this function takes in an array from the database
 * it's goal is to bundle card records together with an array of categories
 * since a single card could have multiple categories
 * */
function formatCards(all) {
  let cardsArray = [];
  for (let i = 0; i < all.length; i++) {
    cardsArray.push({
      card_id: all[i].id,
      name: all[i].name,
      description: all[i].description,
      vendor_style: all[i].vendor_style,
      upc: all[i].upc,
      sku: all[i].sku,
      barcode: { raw: all[i].barcode },
      front_img: { raw: all[i].front_img },
      front_tiff: { raw: all[i].front_tiff },
      inner_img: { raw: all[i].inner_img },
      insert_img: { raw: all[i].insert_img },
      insert_ai: { raw: all[i].insert_ai },
      raw_art: all[i].raw_art,
      sticker_jpeg: { raw: all[i].sticker_jpeg },
      sticker_pdf: { raw: all[i].sticker_pdf },
      categories_array: all[i].categories_array,
    });
    // After getting all cards in cardsArray, we must format the urls for displaying
    for (let i = 0; i < cardsArray.length; i++) {
      //front_img
      cardsArray[
        i
      ].front_img.display = `https://drive.google.com/thumbnail?id=${cardsArray[i].front_img.raw}`;
      //inner_img
      cardsArray[
        i
      ].inner_img.display = `https://drive.google.com/thumbnail?id=${cardsArray[i].inner_img.raw}`;
      //insert_img
      cardsArray[
        i
      ].insert_img.display = `https://drive.google.com/thumbnail?id=${cardsArray[i].insert_img.raw}`;
      //sticker_jpeg
      cardsArray[
        i
      ].sticker_jpeg.display = `https://drive.google.com/thumbnail?id=${cardsArray[i].sticker_jpeg.raw}`;
      //barcode
      cardsArray[
        i
      ].barcode.display = `https://drive.google.com/thumbnail?id=${cardsArray[i].barcode.raw}`;
      cardsArray[
        i
      ].sticker_pdf.display = `https://drive.google.com/file/d/${cardsArray[i].sticker_pdf.raw}`;
      cardsArray[
        i
      ].front_tiff.display = `https://drive.google.com/file/d/${cardsArray[i].front_tiff.raw}`;
      cardsArray[
        i
      ].insert_ai.display = `https://drive.google.com/file/d/${cardsArray[i].insert_ai.raw}`;
      cardsArray[
        i
      ].barcode.display = `https://drive.google.com/file/d/${cardsArray[i].barcode.raw}`;
    }
  }
  return cardsArray;
}
//https://drive.google.com/file/d/1l4uogPMdeQI9thTGc1cHci2-IsMZ3PyX/view?usp=share_link
/**
 * this function takes in an array of formatted cards and an array of categories
 * it's goal is to bundle categories with an array of cards within each category
 * since a single category could have multiple cards
 * */
function formatCardsByCategory(incomingCardsArray, incomingCategoriesArray) {
  // create cardsArray for each category object
  let categoriesArray = [];
  for (let i = 0; i < incomingCategoriesArray.length; i++) {
    categoriesArray.push({
      category_id: incomingCategoriesArray[i].id,
      category_name: incomingCategoriesArray[i].name,
      cardsArray: [],
    });
  }
  // now for the fun part
  for (let i = 0; i < categoriesArray.length; i++) {
    for (let j = 0; j < incomingCardsArray.length; j++) {
      for (let k = 0; k < incomingCardsArray[j].categories_array.length; k++) {
        if (
          incomingCardsArray[j].categories_array[k].category_id ===
          categoriesArray[i].category_id
        ) {
          categoriesArray[i].cardsArray.push(incomingCardsArray[j]);
        }
      }
    }
  }
  return categoriesArray;
}

/**
 * this function takes in an array of categories
 * it's goal is to create a query to insert multiple rows in the cards_categories table
 * since a single card could have multiple categories
 * */
function newCardsCategoriesQuery(categoriesArray, card_id) {
  let cardsCategoriesQuery = `
    INSERT INTO "cards_categories"
    ("card_id", "category_id")
    VALUES
    `;
  for (let i = 0; i < categoriesArray.length; i++) {
    // adds the appropriate ids
    if (i < categoriesArray.length - 1) {
      cardsCategoriesQuery += `
        (${card_id}, ${categoriesArray[i]}),
      `;
      // adds the appropriate ids and a semi colon
    } else if (i === categoriesArray.length - 1) {
      cardsCategoriesQuery += `
        (${card_id}, ${categoriesArray[i]});
        `;
    }
  }
  return cardsCategoriesQuery;
}

/**
 * this function takes in an array of categories
 * it's goal is to create a query to insert multiple rows in the cards_categories table
 * since a single card could have multiple categories
 * */
function editCardsCategoriesQuery(categoriesArray, card_id) {
  let cardsCategoriesQuery = `
    INSERT INTO "cards_categories"
    ("card_id", "category_id")
    VALUES
    `;
  for (let i = 0; i < categoriesArray.length; i++) {
    // adds the appropriate ids
    if (i < categoriesArray.length - 1) {
      cardsCategoriesQuery += `
        (${card_id}, ${categoriesArray[i].id}),
      `;
      // adds the appropriate ids and a semi colon
    } else if (i === categoriesArray.length - 1) {
      cardsCategoriesQuery += `
        (${card_id}, ${categoriesArray[i].id});
        `;
    }
  }
  return cardsCategoriesQuery;
}

module.exports = router;
