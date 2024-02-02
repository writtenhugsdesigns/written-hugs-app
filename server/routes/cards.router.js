const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { google } = require('googleapis')
const apikeys = require('../../googleDriveAPI.json')
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const fs = require('fs')
// const jwtClient = require('../modules/googleDriveAuth')

/** This function first authorizes to google drive using the JWT api method
 * Then it makes an api get call to google drive to fetch files of 
 * the folder mimeType.  
 * It returns the folders.
 */
router.get('/folders', async (req, res) => {
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    )
    console.log("jwtClient before authorize", jwtClient);
    await jwtClient.authorize()
    console.log("jwtClient after authorize", jwtClient);
    const drive = google.drive({ version: 'v3', auth: jwtClient });
    const folders = [];
    const results = await drive.files.list({
        q: 'mimeType=\'application/vnd.google-apps.folder\'',
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
    });
    console.log("this is the result", results.data.files);
    res.send(results.data.files);
}
)

router.get('/', (req, res) => {
    const queryText = `
    SELECT cards.id, cards.name, cards.description, cards.vendor_style, cards.upc, cards.sku, cards.barcode, cards.front_img, cards.front_tiff, cards.inner_img, cards.insert_img, cards.insert_ai, cards.raw_art, cards.sticker_jpeg, cards.sticker_pdf, categories.id as category_id, categories.name as category_name
    FROM cards
    JOIN cards_categories
    ON cards.id = cards_categories.card_id
    JOIN categories
    ON categories.id = cards_categories.category_id
    ORDER BY cards.id ASC;
    `;
    pool.query(queryText)
        .then((result) => {
            let theCards = formatCards(result.rows)
            res.send(theCards)
        })
        .catch(err => {
            console.log('ERROR: Get all cards', err);
            res.sendStatus(500)
        })
});

router.get('/byCategory', (req, res) => {
    const queryText = `
    SELECT cards.id, cards.name, cards.description, cards.vendor_style, cards.upc, cards.sku, cards.barcode, cards.front_img, cards.front_tiff, cards.inner_img, cards.insert_img, cards.insert_ai, cards.raw_art, cards.sticker_jpeg, cards.sticker_pdf, categories.id as category_id, categories.name as category_name
    FROM cards
    JOIN cards_categories
    ON cards.id = cards_categories.card_id
    JOIN categories
    ON categories.id = cards_categories.category_id
    ORDER BY cards.id ASC;
    `;
    pool.query(queryText)
        .then((result) => {
            let theCards = formatCardsByCategory(result.rows)
            res.send(theCards)
        })
        .catch(err => {
            console.log('ERROR: Get all cards', err);
            res.sendStatus(500)
        })
});

router.post('/', (req, res) => {
    const queryText = `
    INSERT INTO "cards" 
    ("name", "vendor_style", "description", "upc", "sku", "barcode", "front_img", "front_tiff", "inner_img", "insert_img", "insert_ai", "raw_art", "sticker_id")
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING "id";
    `;
    const queryValues = [
        req.body.name,
        req.body.vendor_style,
        req.body.description,
        req.body.upc,
        req.body.sku,
        req.body.barcode,
        req.body.front_img,
        req.body.front_tiff,
        req.body.inner_img,
        req.body.insert_img,
        req.body.insert_ai,
        req.body.raw_art,
        req.body.sticker_jpeg,
        req.body.sticker_pdf
    ];
    pool.query(queryText, queryValues)
        .then(result => {
            const card_id = result.rows[0].id
            const categoriesArray = req.body.categoriesArray
            const insertCardsCategoriesQuery = newCardsCategoriesQuery(categoriesArray, card_id);
            // SECOND QUERY ADDS categories FOR THAT NEW card
            pool.query(insertCardsCategoriesQuery)
                .then(result => {
                    //Now that both are done, send back success!
                    res.sendStatus(201);
                }).catch(err => {
                    // catch for second query
                    console.log(err);
                    res.sendStatus(500)
                })
        }).catch(err => { // 👈 Catch for first query
            console.log(err);
            res.sendStatus(500)
        })
})

router.put('/:id', (req, res) => {
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
          id=$15;
    `;
    console.log('req.body:', req.body);
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
        req.params.id
    ];
    pool.query(queryText, queryValues)
        .then(result => {
            const queryDeleteText = `
      DELETE FROM cards_categories
        WHERE cards_id=${req.params.id};
    `;
            // second QUERY removes categories FOR THAT card
            pool.query(queryDeleteText)
                .then(result => {
                    const categoriesArray = req.body.categoriesArrayForQuery
                    const editCardsCategoriesQuery = editCardsCategoriesQuery(categoriesArray, req.params.id);
                    // Third QUERY ADDS categories FOR THAT card
                    pool.query(editCardsCategoriesQuery)
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
        }).catch(err => { // 👈 Catch for first query
            console.log(err);
            res.sendStatus(500)
        })
})

router.get('/:id', (req, res) => {
    const queryText = `
    SELECT * FROM "cards";
    `

    pool.query(queryText)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("Error in GET /api/cards/:id:", error);
            res.sendStatus(500);
        })
})

/**  
 * this function takes in an array from the database 
 * it's goal is to bundle card records together with an array of categories
 * since a single card could have multiple categories
 * */
function formatCards(all) {
    // if array from database is empty, return empty array
    if (all[0] === undefined) {
        return [];
    } else {
        // create cardsArray with first response and first category
        let cardsArray = [{
            card_id: all[0].card_id,
            name: all[0].name,
            description: all[0].description,
            vendor_style: all[0].vendor_style,
            upc: all[0].upc,
            sku: all[0].sku,
            barcode: all[0].barcode,
            front_img: { raw: all[0].front_img },
            front_tiff: all[0].front_tiff,
            inner_img: { raw: all[0].inner_img },
            insert_img: { raw: all[0].insert_img },
            insert_ai: all[0].insert_ai,
            raw_art: all[0].raw_art,
            sticker_jpeg: { raw: all[0].sticker_jpeg },
            sticker_pdf: all[0].sticker_pdf,
            categoriesArray: [{
                category_name: all[0].category_name,
                category_id: all[0].category_id
            }]
        }]
        for (let i = 1; i < all.length; i++) {
            // if the card.id in the next index in the array does NOT match the previous index
            // then add the new card to the cardsArray
            if (all[i].card_id !== all[i - 1].card_id) {
                cardsArray.push({
                    card_id: all[i].card_id,
                    name: all[i].name,
                    vendor_style: all[i].vendor_style,
                    upc: all[i].upc,
                    sku: all[i].sku,
                    barcode: all[i].barcode,
                    front_img: { raw: all[i].front_img },
                    front_tiff: all[i].front_tiff,
                    inner_img: { raw: all[i].inner_img },
                    insert_img: { raw: all[i].insert_img },
                    insert_ai: all[i].insert_ai,
                    raw_art: all[i].raw_art,
                    sticker_jpeg: { raw: all[i].sticker_jpeg },
                    sticker_pdf: all[i].sticker_pdf,
                    categoriesArray: []
                })
            }
            // if the card.id in the next index in the array DOES match the previous index
            // then add the other category to the card
            for (let j = 0; j < cardsArray.length; j++) {
                if (cardsArray[j].card_id === all[i].card_id) {
                    cardsArray[j].categoriesArray.push({
                        category_name: all[i].category_name,
                        category_id: all[i].category_id
                    })
                }
            }
        }

        // After getting all cards in cardsArray, we must format the urls for displaying
        for (let i = 0; i < cardsArray.length; i++) {
            //front_img
            cardsArray[i].front_img.display = `https://drive.google.com/thumbnail?id=${extractID(cardsArray[i].front_img.raw)}`;
            //inner_img
            cardsArray[i].inner_img.display = `https://drive.google.com/thumbnail?id=${extractID(cardsArray[i].inner_img.raw)}`;
            //insert_img
            cardsArray[i].insert_img.display = `https://drive.google.com/thumbnail?id=${extractID(cardsArray[i].insert_img.raw)}`;
            //sticker_jpeg
            cardsArray[i].sticker_jpeg.display = `https://drive.google.com/thumbnail?id=${extractID(cardsArray[i].sticker_jpeg.raw)}`;
        }
        return cardsArray
    }
}

/**  
 * this function takes in an array from the database 
 * it's goal is to bundle categories with an array of cards within each category
 * since a single category could have multiple cards
 * */
function formatCardsByCategory(all) {
    // if array from database is empty, return empty array
    if (all[0] === undefined) {
        return [];
    } else {
        // create categoriesArray with first response and first category
        let categoriesArray = [{
            category_name: all[0].category_name,
            category_id: all[0].category_id,
            cardsArray: [{
                card_id: all[0].card_id,
                name: all[0].name,
                description: all[0].description,
                vendor_style: all[0].vendor_style,
                upc: all[0].upc,
                sku: all[0].sku,
                barcode: all[0].barcode,
                front_img: { raw: all[0].front_img },
                front_tiff: all[0].front_tiff,
                inner_img: { raw: all[0].inner_img },
                insert_img: { raw: all[0].insert_img },
                insert_ai: all[0].insert_ai,
                raw_art: all[0].raw_art,
                sticker_jpeg: { raw: all[0].sticker_jpeg },
                sticker_pdf: all[0].sticker_pdf,
            }]
        }]
        for (let i = 1; i < all.length; i++) {
            // if the category.id in the next index in the array does NOT match the previous index
            // then add the new category to the categoriesArray
            if (all[i].category_id !== all[i - 1].category_id) {
                categoriesArray.push({
                    category_name: all[i].category_name,
                    category_id: all[i].category_id,
                    cardsArray: []
                })
            }
            // if the category.id in the next index in the array DOES match the previous index
            // then add the other cards to the category
            for (let j = 0; j < categoriesArray.length; j++) {
                if (categoriesArray[j].category_id === all[i].category_id) {
                    categoriesArray[j].cardsArray.push({
                        card_id: all[i].card_id,
                        name: all[i].name,
                        description: all[i].description,
                        vendor_style: all[i].vendor_style,
                        upc: all[i].upc,
                        sku: all[i].sku,
                        barcode: all[i].barcode,
                        front_img: { raw: all[i].front_img },
                        front_tiff: all[i].front_tiff,
                        inner_img: { raw: all[i].inner_img },
                        insert_img: { raw: all[i].insert_img },
                        insert_ai: all[i].insert_ai,
                        raw_art: all[i].raw_art,
                        sticker_jpeg: { raw: all[i].sticker_jpeg },
                        sticker_pdf: all[i].sticker_pdf,
                    })
                }
            }
        }

        // After getting all cards in cardsArray, we must format the urls for displaying
        for (let i = 0; i < categoriesArray.length; i++) {
            for (let j = 0; j < categoriesArray[i].cardsArray.length; j++) {
            //front_img
            categoriesArray[i].cardsArray[j].front_img.display = `https://drive.google.com/thumbnail?id=${extractID(categoriesArray[i].cardsArray[j].front_img.raw)}`;
            //inner_img
            categoriesArray[i].cardsArray[j].inner_img.display = `https://drive.google.com/thumbnail?id=${extractID(categoriesArray[i].cardsArray[j].inner_img.raw)}`;
            //insert_img
            categoriesArray[i].cardsArray[j].insert_img.display = `https://drive.google.com/thumbnail?id=${extractID(categoriesArray[i].cardsArray[j].insert_img.raw)}`;
            //sticker_jpeg
            categoriesArray[i].cardsArray[j].sticker_jpeg.display = `https://drive.google.com/thumbnail?id=${extractID(categoriesArray[i].cardsArray[j].sticker_jpeg.raw)}`;
            }

        }
        return categoriesArray
    }
}

/**
 * this function takes in a file's raw google drive url, and extracts the file ID
 * returns a string representing the id
 */
function extractID(rawURL) {
    return rawURL.substring(32, rawURL.length - 17);
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
    `
    for (let i = 0; i < categoriesArray.length; i++) {
        // adds the appropriate ids
        if (i < categoriesArray.length - 1) {
            cardsCategoriesQuery += `
        (${card_id}, ${categoriesArray[i]}),
      `
            // adds the appropriate ids and a semi colon
        } else if (i === categoriesArray.length - 1) {
            cardsCategoriesQuery += `
        (${card_id}, ${categoriesArray[i]});
        `
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
    `
    for (let i = 0; i < categoriesArray.length; i++) {
        // adds the appropriate ids
        if (i < categoriesArray.length - 1) {
            cardsCategoriesQuery += `
        (${card_id}, ${categoriesArray[i].id}),
      `
            // adds the appropriate ids and a semi colon
        } else if (i === categoriesArray.length - 1) {
            cardsCategoriesQuery += `
        (${card_id}, ${categoriesArray[i].id});
        `
        }
    }
    return cardsCategoriesQuery;
}


module.exports = router;