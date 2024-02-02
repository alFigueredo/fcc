const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

let Translator = require("../components/translator.js");

suite("Functional Tests", function () {
  this.timeout(5000);
  suite("POST request to /api/translate", () => {
    test("Translation with text and locale fields", (done) => {
      const text = "Mangoes are my favorite fruit.";
      const locale = "american-to-british";
      const translation =
        'Mangoes are my <span class="highlight">favourite</span> fruit.';
      chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .send({ text, locale })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.translation, translation);
          done();
        });
    });
    test("Translation with text and invalid locale field", (done) => {
      const text = "Mangoes are my favorite fruit.";
      const locale = "invalid locale";
      chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .send({ text, locale })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Invalid value for locale field");
          done();
        });
    });
    test("Translation with missing text field", (done) => {
      const locale = "american-to-british";
      chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .send({ locale })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });
    test("Translation with missing locale field", (done) => {
      const text = "Mangoes are my favorite fruit.";
      chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .send({ text })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });
    test("Translation with empty text", (done) => {
      const text = "";
      const locale = "american-to-british";
      chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .send({ text, locale })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "No text to translate");
          done();
        });
    });
    test("Translation with text that needs no translation", (done) => {
      const text = "Mangoes are my favorite fruit.";
      const locale = "british-to-american";
      const translation = "Everything looks good to me!";
      chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .send({ text, locale })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.translation, translation);
          done();
        });
    });
  });
});
