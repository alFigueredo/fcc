/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const bookIds = [];

suite("Functional Tests", function () {
  this.timeout(5000);
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post("/api/books")
            .send({
              title: "Test",
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.type, "application/json");
              bookIds.push(res.body._id);
              assert.equal(res.body.title, "Test");
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post("/api/books")
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.type, "text/html");
              assert.equal(res.text, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .keepOpen()
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.isArray(res.body);
            assert.isNotEmpty(res.body);
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .keepOpen()
          .get("/api/books/invalid_id")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html");
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .keepOpen()
          .get(`/api/books/${bookIds[0]}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body._id, bookIds[0]);
            assert.equal(res.body.title, "Test");
            assert.isArray(res.body.comments);
            assert.isEmpty(res.body.comments);
            assert.equal(res.body.commentcount, 0);
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post(`/api/books/${bookIds[0]}`)
            .send({ comment: "Test" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.type, "application/json");
              assert.equal(res.body._id, bookIds[0]);
              assert.equal(res.body.title, "Test");
              assert.equal(res.body.comments[0], "Test");
              assert.equal(res.body.comments.length, 1);
              assert.equal(res.body.commentcount, 1);
              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post(`/api/books/${bookIds[0]}`)
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.type, "text/html");
              assert.equal(res.text, "missing required field comment");
              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post(`/api/books/invalid_id`)
            .send({ comment: "Test2" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.type, "text/html");
              assert.equal(res.text, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete(`/api/books/${bookIds[0]}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html");
            assert.equal(res.text, "delete successful");
            done();
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete(`/api/books/invalid_id`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html");
            assert.equal(res.text, "no book exists");
            done();
          });
      });
    });
  });
});
