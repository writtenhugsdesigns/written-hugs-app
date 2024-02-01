const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

router.get("/", rejectUnauthenticated, (req, res) => {
  const sqlText = `
  SELECT * FROM "categories";`;

  pool
    .query(sqlText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("Error in categories GET router,", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const sqlText = `
  INSERT INTO "categories"
  ("name")
  VALUES
  ($1)
  `;
  pool
    .query(sqlText, [req.body.name])
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
  UPDATE "categories"
  SET "name" = $1,
  WHERE "id" = $2;`;

  const sqlValues = [req.body.company_name, req.params.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("Error in categories PUT route,", err);
      res.sendStatus(500);
    });
});

router.delete("/:id", rejectUnauthenticated, (req, res) => {
  const sqlText = `
  DELETE FROM "categories"
  WHERE "id" = $1;`;

  const sqlValues = [req.params.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("Error in categories DELETE route,", err);
      res.sendStatus(500);
    });
});

module.exports = router;
