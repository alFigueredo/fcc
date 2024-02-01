const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);
const puzzlesAndSolutions =
  require("../controllers/puzzle-strings").puzzlesAndSolutions;

suite("Functional Tests", function () {
  this.timeout(5000);
  suite("POST /api/solve", () => {
    test("Solve a puzzle with valid puzzle string", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: puzzlesAndSolutions[0][0] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
          done();
        });
    });
    test("Solve a puzzle with missing puzzle string", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });
    test("Solve a puzzle with invalid characters", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: puzzlesAndSolutions[0][0].replace("1", "a") })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    test("Solve a puzzle with incorrect length", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: puzzlesAndSolutions[0][0].slice(0, -1) })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    test("Solve a puzzle that cannot be solved", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: puzzlesAndSolutions[0][0].replace("1", "5") })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });
  suite("POST /api/check", () => {
    test("Check a puzzle placement with all fields", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "A2",
          value: "3",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.valid, true);
          done();
        });
    });
    test("Check a puzzle placement with single placement conflict", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "A2",
          value: "8",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 1);
          done();
        });
    });
    test("Check a puzzle placement with multiple placement conflicts", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "A2",
          value: "1",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 2);
          done();
        });
    });
    test("Check a puzzle placement with all placement conflicts", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "A2",
          value: "2",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 3);
          done();
        });
    });
    test("Check a puzzle placement with missing required fields", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "A2",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });
    test("Check a puzzle placement with invalid characters", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0].replace("1", "a"),
          coordinate: "A2",
          value: "3",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    test("Check a puzzle placement with incorrect length", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0].slice(0, -1),
          coordinate: "A2",
          value: "3",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    test("Check a puzzle placement with invalid placement coordinate", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "A10",
          value: "3",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });
    test("Check a puzzle placement with invalid placement value", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "A2",
          value: "10",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
