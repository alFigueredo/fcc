const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  this.timeout(5000);
  suite("API ROUTING FOR /api/threads/:board", () => {
    test("POST /api/threads/:board", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/threads/test")
        .send({
          text: "test",
          delete_password: "test",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "text/html");
          done();
        });
    });
    test("GET /api/threads/:board", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/threads/test")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body);
          assert.isAtMost(res.body.length, 10);
          for (let i = 0; i < res.body.length; i++) {
            assert.isArray(res.body[i].replies);
            assert.isAtMost(res.body[i].replies.length, 3);
          }
          done();
        });
    });
    test("DELETE /api/threads/:board", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/threads/test")
        .send({
          text: "test",
          delete_password: "test",
        })
        .end((err, res) => {
          chai
            .request(server)
            .keepOpen()
            .get("/api/threads/test")
            .end((err, res) => {
              chai
                .request(server)
                .keepOpen()
                .delete("/api/threads/test")
                .send({
                  thread_id: res.body[0]._id,
                  delete_password: "test",
                })
                .end((err, res) => {
                  assert.equal(res.status, 200);
                  assert.equal(res.type, "text/html");
                  assert.equal(res.text, "success");
                  done();
                });
            });
        });
    });
    test("DELETE /api/threads/:board with incorrect password", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/threads/test")
        .send({
          text: "test",
          delete_password: "test",
        })
        .end((err, res) => {
          chai
            .request(server)
            .keepOpen()
            .get("/api/threads/test")
            .end((err, res) => {
              chai
                .request(server)
                .keepOpen()
                .delete("/api/threads/test")
                .send({
                  thread_id: res.body[0]._id,
                  delete_password: "incorrect",
                })
                .end((err, res) => {
                  assert.equal(res.status, 404);
                  assert.equal(res.type, "text/html");
                  assert.equal(res.text, "incorrect password");
                  done();
                });
            });
        });
    });
    test("PUT /api/threads/:board", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/threads/test")
        .send({
          text: "test",
          delete_password: "test",
        })
        .end((err, res) => {
          chai
            .request(server)
            .keepOpen()
            .get("/api/threads/test")
            .end((err, res) => {
              chai
                .request(server)
                .keepOpen()
                .put("/api/threads/test")
                .send({
                  thread_id: res.body[0]._id,
                })
                .end((err, res) => {
                  assert.equal(res.status, 200);
                  assert.equal(res.type, "text/html");
                  assert.equal(res.text, "reported");
                  done();
                });
            });
        });
    });
  });
  suite("API ROUTING FOR /api/replies/:board", () => {
    test("POST /api/replies/:board", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/threads/test")
        .send({
          text: "test",
          delete_password: "test",
        })
        .end((err, res) => {
          chai
            .request(server)
            .keepOpen()
            .get("/api/threads/test")
            .end((err, res) => {
              const randomNumber = Math.floor(Math.random() * res.body.length);
              chai
                .request(server)
                .keepOpen()
                .post("/api/replies/test")
                .send({
                  thread_id: res.body[randomNumber]._id,
                  text: "test",
                  delete_password: "test",
                })
                .end((err, res) => {
                  assert.equal(res.status, 200);
                  assert.equal(res.type, "text/html");
                  done();
                });
            });
        });
    });
    test("GET /api/replies/:board", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/threads/test")
        .end((err, res) => {
          const randomNumber = Math.floor(Math.random() * res.body.length);
          const thread_id = res.body[randomNumber]._id;
          chai
            .request(server)
            .keepOpen()
            .get("/api/replies/test")
            .query({
              thread_id,
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.type, "application/json");
              assert.isArray(res.body.replies);
              done();
            });
        });
    });
    test("DELETE /api/replies/:board", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/threads/test")
        .end((err, res) => {
          const randomNumber = Math.floor(Math.random() * res.body.length);
          const thread_id = res.body[randomNumber]._id;
          chai
            .request(server)
            .keepOpen()
            .post("/api/replies/test")
            .send({
              thread_id,
              text: "test",
              delete_password: "test",
            })
            .end((err, res) => {
              chai
                .request(server)
                .keepOpen()
                .get("/api/replies/test")
                .query({
                  thread_id,
                })
                .end((err, res) => {
                  chai
                    .request(server)
                    .keepOpen()
                    .delete("/api/replies/test")
                    .send({
                      thread_id,
                      reply_id: res.body.replies[0]._id,
                      delete_password: "test",
                    })
                    .end((err, res) => {
                      assert.equal(res.status, 200);
                      assert.equal(res.type, "text/html");
                      assert.equal(res.text, "success");
                      done();
                    });
                });
            });
        });
    });
    test("DELETE /api/replies/:board with incorrect password", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/threads/test")
        .end((err, res) => {
          const randomNumber = Math.floor(Math.random() * res.body.length);
          const thread_id = res.body[randomNumber]._id;
          chai
            .request(server)
            .keepOpen()
            .post("/api/replies/test")
            .send({
              thread_id,
              text: "test",
              delete_password: "test",
            })
            .end((err, res) => {
              chai
                .request(server)
                .keepOpen()
                .get("/api/replies/test")
                .query({
                  thread_id,
                })
                .end((err, res) => {
                  chai
                    .request(server)
                    .keepOpen()
                    .delete("/api/replies/test")
                    .send({
                      thread_id: res.body._id,
                      reply_id: res.body.replies[0]._id,
                      delete_password: "incorrect",
                    })
                    .end((err, res) => {
                      assert.equal(res.status, 404);
                      assert.equal(res.type, "text/html");
                      assert.equal(res.text, "incorrect password");
                      done();
                    });
                });
            });
        });
    });
    test("PUT /api/replies/:board", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/threads/test")
        .end((err, res) => {
          const randomNumber = Math.floor(Math.random() * res.body.length);
          const thread_id = res.body[randomNumber]._id;
          chai
            .request(server)
            .keepOpen()
            .post("/api/replies/test")
            .send({
              thread_id,
              text: "test",
              delete_password: "test",
            })
            .end((err, res) => {
              chai
                .request(server)
                .keepOpen()
                .get("/api/replies/test")
                .query({
                  thread_id,
                })
                .end((err, res) => {
                  chai
                    .request(server)
                    .keepOpen()
                    .put("/api/replies/test")
                    .send({
                      thread_id: res.body._id,
                      reply_id: res.body.replies[0]._id,
                    })
                    .end((err, res) => {
                      assert.equal(res.status, 200);
                      assert.equal(res.type, "text/html");
                      assert.equal(res.text, "reported");
                      done();
                    });
                });
            });
        });
    });
  });
});
