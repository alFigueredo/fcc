"use strict";

const StockPrices = require("../controllers/stock-prices");
const { getStock, getStocks } = new StockPrices();

module.exports = function (app) {
  app.route("/api/stock-prices").get(function (req, res) {
    const {
      ip,
      query: { stock, like },
    } = req;
    if (!Array.isArray(stock)) {
      getStock(stock.toUpperCase(), like, ip, (err, data) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.json(data);
        }
      });
    } else {
      getStocks(
        stock.map((item) => item.toUpperCase()),
        like,
        ip,
        (err, data) => {
          if (err) {
            res.json({ error: err });
          } else {
            res.json(data);
          }
        }
      );
    }
  });
};
