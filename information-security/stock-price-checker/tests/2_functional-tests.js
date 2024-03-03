const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { Stock } = require("../models/stock");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  this.timeout(5000);
  Stock.deleteMany({});
  suite("GET /api/stock-prices => stockData object", () => {
    test("1 stock", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/stock-prices")
        .query({ stock: "goog" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(
            res.type,
            "application/json",
            "response type should be application/json"
          );
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "stockData",
            "response should contain stockData property"
          );
          assert.isObject(res.body.stockData, "stockData should be an object");
          assert.property(
            res.body.stockData,
            "stock",
            "stockData should contain stock property"
          );
          assert.property(
            res.body.stockData,
            "price",
            "stockData should contain price property"
          );
          assert.property(
            res.body.stockData,
            "likes",
            "stockData should contain likes property"
          );
          assert.equal(
            res.body.stockData.stock,
            "GOOG",
            "stockData.stock should be GOOG"
          );
          done();
        });
    });
    test("1 stock with like", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/stock-prices")
        .query({ stock: "goog" })
        .end((err, res) => {
          const initialLikes = res.body.stockData.likes;
          chai
            .request(server)
            .keepOpen()
            .get("/api/stock-prices")
            .query({ stock: "goog", like: "true" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(
                res.type,
                "application/json",
                "response type should be application/json"
              );
              assert.isObject(res.body, "response should be an object");
              assert.property(
                res.body,
                "stockData",
                "response should contain stockData property"
              );
              assert.isObject(
                res.body.stockData,
                "stockData should be an object"
              );
              assert.property(
                res.body.stockData,
                "stock",
                "stockData should contain stock property"
              );
              assert.property(
                res.body.stockData,
                "price",
                "stockData should contain price property"
              );
              assert.property(
                res.body.stockData,
                "likes",
                "stockData should contain likes property"
              );
              assert.equal(
                res.body.stockData.stock,
                "GOOG",
                "stockData.stock should be GOOG"
              );
              assert.equal(
                res.body.stockData.likes - initialLikes,
                1,
                "stockData.likes should have been increased by 1"
              );
              done();
            });
        });
    });
    test("1 stock with like again (ensure likes arent double counted)", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/stock-prices")
        .query({ stock: "goog" })
        .end((err, res) => {
          const initialLikes = res.body.stockData.likes;
          chai
            .request(server)
            .keepOpen()
            .get("/api/stock-prices")
            .query({ stock: "goog", like: "true" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(
                res.type,
                "application/json",
                "response type should be application/json"
              );
              assert.isObject(res.body, "response should be an object");
              assert.property(
                res.body,
                "stockData",
                "response should contain stockData property"
              );
              assert.isObject(
                res.body.stockData,
                "stockData should be an object"
              );
              assert.property(
                res.body.stockData,
                "stock",
                "stockData should contain stock property"
              );
              assert.property(
                res.body.stockData,
                "price",
                "stockData should contain price property"
              );
              assert.property(
                res.body.stockData,
                "likes",
                "stockData should contain likes property"
              );
              assert.equal(
                res.body.stockData.stock,
                "GOOG",
                "stockData.stock should be GOOG"
              );
              assert.equal(
                res.body.stockData.likes - initialLikes,
                0,
                "stockData.likes should have been not increased"
              );
              done();
            });
        });
    });
    test("2 stocks", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/stock-prices")
        .query({ stock: ["goog", "msft"] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(
            res.type,
            "application/json",
            "response type should be application/json"
          );
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "stockData",
            "response should contain stockData property"
          );
          assert.isArray(res.body.stockData, "stockData should be an array");
          assert.property(
            res.body.stockData[0],
            "stock",
            "stockData should contain stock property"
          );
          assert.property(
            res.body.stockData[0],
            "price",
            "stockData should contain price property"
          );
          assert.property(
            res.body.stockData[0],
            "rel_likes",
            "stockData should contain rel_likes property"
          );
          assert.property(
            res.body.stockData[1],
            "stock",
            "stockData should contain stock property"
          );
          assert.property(
            res.body.stockData[1],
            "price",
            "stockData should contain price property"
          );
          assert.property(
            res.body.stockData[1],
            "rel_likes",
            "stockData should contain rel_likes property"
          );
          assert.equal(
            res.body.stockData[0].stock,
            "GOOG",
            "stockData.stock should be GOOG"
          );
          assert.equal(
            res.body.stockData[1].stock,
            "MSFT",
            "stockData.stock should be MSFT"
          );
          done();
        });
    });
    test("2 stocks with like", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/stock-prices")
        .query({ stock: ["goog", "msft"] })
        .end((err, res) => {
          const initialLikes0 = res.body.stockData[0].rel_likes;
          const initialLikes1 = res.body.stockData[1].rel_likes;
          chai
            .request(server)
            .keepOpen()
            .get("/api/stock-prices")
            .query({ stock: ["goog", "msft"], like: "true" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(
                res.type,
                "application/json",
                "response type should be application/json"
              );
              assert.isObject(res.body, "response should be an object");
              assert.property(
                res.body,
                "stockData",
                "response should contain stockData property"
              );
              assert.isArray(
                res.body.stockData,
                "stockData should be an array"
              );
              assert.property(
                res.body.stockData[0],
                "stock",
                "stockData should contain stock property"
              );
              assert.property(
                res.body.stockData[0],
                "price",
                "stockData should contain price property"
              );
              assert.property(
                res.body.stockData[0],
                "rel_likes",
                "stockData should contain rel_likes property"
              );
              assert.property(
                res.body.stockData[1],
                "stock",
                "stockData should contain stock property"
              );
              assert.property(
                res.body.stockData[1],
                "price",
                "stockData should contain price property"
              );
              assert.property(
                res.body.stockData[1],
                "rel_likes",
                "stockData should contain rel_likes property"
              );
              assert.equal(
                res.body.stockData[0].stock,
                "GOOG",
                "stockData.stock should be GOOG"
              );
              assert.equal(
                res.body.stockData[0].rel_likes - initialLikes0,
                -1,
                "stockData.rel_likes should have been decreased by 1"
              );
              assert.equal(
                res.body.stockData[1].stock,
                "MSFT",
                "stockData.stock should be MSFT"
              );
              assert.equal(
                res.body.stockData[1].rel_likes - initialLikes1,
                1,
                "stockData.rel_likes should have been increased by 1"
              );
              done();
            });
        });
    });
  });
});
