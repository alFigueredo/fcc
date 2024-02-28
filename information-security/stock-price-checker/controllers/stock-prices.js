const bcrypt = require("bcrypt");
const { Stock } = require("../models/stock");

class StockPrizes {
  getStock = async (symbol, like, ip, done) => {
    try {
      const response = await fetch(
        `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`
      );
      const json = await response.json();
      if (!json.symbol) throw "no stock exists";
      this.getSymbol(symbol, json.latestPrice, like, ip, (err, data) => {
        if (err) {
          throw err;
        } else {
          done(null, {
            stockData: {
              stock: data.symbol,
              price: data.price,
              likes: data.likes,
            },
          });
        }
      });
    } catch (err) {
      done(err);
    }
  };

  getSymbol = async (symbol, price, like, ip, done) => {
    try {
      let stock = await Stock.findOne({ symbol });
      if (!stock) stock = new Stock({ symbol, price });
      else stock.price = price;
      if (like === "true")
        this.addLike(stock, ip, (err) => {
          if (err) throw err;
          done(null, stock);
        });
      else {
        await stock.save();
        done(null, stock);
      }
    } catch (err) {
      done(err);
    }
  };

  addLike = async (stock, ip, done) => {
    try {
      let result = false;
      for (const item of stock.ip) {
        result = await bcrypt.compare(ip, item);
        if (result) break;
      }
      if (!result)
        this.addIP(stock, ip, (err) => {
          if (err) throw err;
          done(null);
        });
      else done(null);
    } catch (err) {
      done(err);
    }
  };

  addIP = async (stock, ip, done) => {
    try {
      const hash = await bcrypt.hash(ip, 10);
      stock.ip.push(hash);
      stock.likes = stock.ip.length;
      await stock.save();
      done(null);
    } catch (err) {
      done(err);
    }
  };

  getStocks = (symbols, like, ip, done) => {
    try {
      this.getStock(symbols[0], like, ip, (err, data0) => {
        if (err) {
          throw err;
        } else {
          this.getStock(symbols[1], like, ip, (err, data1) => {
            if (err) {
              throw err;
            } else {
              const stockData0 = data0.stockData;
              const stockData1 = data1.stockData;
              done(null, {
                stockData: [
                  {
                    stock: stockData0.stock,
                    price: stockData0.price,
                    rel_likes: stockData0.likes - stockData1.likes,
                  },
                  {
                    stock: stockData1.stock,
                    price: stockData1.price,
                    rel_likes: stockData1.likes - stockData0.likes,
                  },
                ],
              });
            }
          });
        }
      });
    } catch (err) {
      done(err);
    }
  };
}

module.exports = StockPrizes;
