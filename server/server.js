const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5001;

// Middleware Includes
const sessionMiddleware = require("./modules/session-middleware");
const passport = require("./strategies/user.strategy");

// Route Includes
const userRouter = require("./routes/user.router");
const wholesalersRouter = require("./routes/wholesalers.router");
const cardRouter = require("./routes/cards.router");
const categoriesRouter = require("./routes/categories.router");
const pitchesRouter = require("./routes/pitches.router");

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("build"));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/wholesalers", wholesalersRouter);
app.use("/api/user", userRouter);
app.use("/api/cards", cardRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/pitches", pitchesRouter);

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
