const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

router.get("/", rejectUnauthenticated, (req, res) => {
  const sqlText = `
  SELECT * FROM "wholesalers";`;

  pool
    .query(sqlText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("Error in wholesalers GET router,", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const sqlText = `
  INSERT INTO "wholesalers"
  ("company_name", "user_id")
  VALUES
  ($1, $2)
  `;
  pool
    .query(sqlText, [req.body.company_name, req.body.user_id])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Error in wholesaler POST route,", err);
      res.sendStatus(500);
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  console.log(req.body);
  const sqlText = `
  UPDATE "wholesalers"
    SET "company_name" = $1
    WHERE "id" = $2;`;

  const sqlValues = [req.body.company_name, req.params.id];

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
      console.log("Error in wholesalers DELETE route,", err);
      res.sendStatus(500);
    });
});

module.exports = router;
