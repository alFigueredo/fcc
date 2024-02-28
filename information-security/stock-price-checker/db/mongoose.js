const mongoose = require("mongoose");

const db = mongoose
  .connect(process.env.DB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log(e));

module.exports = db;
