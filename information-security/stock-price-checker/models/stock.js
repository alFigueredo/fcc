const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  ip: {
    type: [String],
    default: [],
  },
});

const Stock = mongoose.model("Stock", stockSchema);

module.exports = {
  Stock,
};
