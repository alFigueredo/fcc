const mongoose = require("mongoose");

const db = mongoose
  .connect(process.env.DB)
  .then(() => console.log("Succesfully connected to DB"))
  .catch((e) => console.log(e));

module.exports = db;
