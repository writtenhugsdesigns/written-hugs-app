const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { google } = require('googleapis')
const apikeys = require('../../googleDriveAPI.json')
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const fs = require('fs')
const multer = require('multer');
const uploadHandler = multer();
const MulterGoogleCloudStorage = require('multer-cloud-storage');
const stream = require('stream')



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
//   console.log("jwtClient before authorize", jwtClient);
  await jwtClient.authorize()
//   console.log("jwtClient after authorize", jwtClient);
    const drive = google.drive({version: 'v3', auth: jwtClient});
    const folders = [];
    const results = await drive.files.list({
      q: 'mimeType=\'application/vnd.google-apps.folder\'',
      fields: 'nextPageToken, files(id, name)',
      spaces: 'drive',
    });
    // console.log("this is the result", results.data.files);
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

router.post('/', uploadHandler.any(), async (req, res) => {
    const folderName = req.body.vendor_style + " " + req.body.name;
    const objectToSendToDB = 
    {name: req.body.name,
    upc: req.body.upc,
    vendor_style: req.body.vendor_style,
    front_img: '',
    front_tiff: '',
    insert_img: '',
    insert_ai: '',
    sticker_jpeg: '',
    sticker_pdf: '',
    };
    console.log(req.body);

    //This creates an authentication token
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
        )
      await jwtClient.authorize()
    const drive = google.drive({version: 'v3', auth: jwtClient});
    
    //This is the metadata to setup the card variant folder
    let fileMetaData = {
            name: folderName,
            parents: ["1wG6GeFUgvvh-8GOHw1NhlfRPUUDfP2H_"],
            mimeType: 'application/vnd.google-apps.folder'
        }

    //This creates the folder for the card variant    
    const folderResponse = await drive.files.create({
            resource: fileMetaData,
            fields: 'id'
        })
    const folderID = folderResponse.data.id
    
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
                parents: [folderID]
            },
            fileds: 'id.name'
        })
        objectToSendToDB[fileObject.fieldname] = data.id;
        // console.log("fieldName:", fileObject.fieldname);
        // console.log("dataID:", data.id);
        console.log(objectToSendToDB);
    };

    const { body, files } = req;
    for (let f=0; f < files.length; f++) {
        await uploadFile(files[f])
        }
        // console.log(body);
        res.status(200).send('Form Submitted');
    
    const queryText = `
    INSERT INTO "cards" 
    ("name", "upc", "vendor_style", "front_img", "front_tiff", "inner_img", "insert_img", "insert_ai", "sticker_jpeg", "sticker_pdf")
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING "id";
    `;
    const queryValues = [
        objectToSendToDB.name,
        objectToSendToDB.upc,
        objectToSendToDB.vendor_style,
        objectToSendToDB.front_img,
        objectToSendToDB.front_tiff,
        objectToSendToDB.inner_img,
        objectToSendToDB.insert_img,
        objectToSendToDB.insert_ai,
        objectToSendToDB.sticker_jpeg,
        objectToSendToDB.sticker_pdf
    ];
    pool.query(queryText, queryValues)
        .then(result => {
    //         const card_id = result.rows[0].id
    //         const categoriesArray = req.body.categoriesArray
    //         const insertCardsCategoriesQuery = newCardsCategoriesQuery(categoriesArray, card_id);
    //         // SECOND QUERY ADDS categories FOR THAT NEW card
    //         pool.query(insertCardsCategoriesQuery)
    //             .then(result => {
    //                 //Now that both are done, send back success!
    //                 res.sendStatus(201);
    //             }).catch(err => {
    //                 // catch for second query
    //                 console.log(err);
                    res.sendStatus(201)
                })
        .catch(err => { // 👈 Catch for first query
            console.log(err);
            res.sendStatus(500)
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
            front_img: all[0].front_img,
            front_tiff: all[0].front_tiff,
            inner_img: all[0].inner_img,
            insert_img: all[0].insert_img,
            insert_ai: all[0].insert_ai,
            raw_art: all[0].raw_art,
            sticker_jpeg: all[0].sticker_jpeg,
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
                    front_img: all[i].front_img,
                    front_tiff: all[i].front_tiff,
                    inner_img: all[i].inner_img,
                    insert_img: all[i].insert_img,
                    insert_ai: all[i].insert_ai,
                    raw_art: all[i].raw_art,
                    sticker_jpeg: all[i].sticker_jpeg,
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
        return cardsArray
    }
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