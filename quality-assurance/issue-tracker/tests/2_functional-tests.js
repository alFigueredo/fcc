const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const issueIds = [];

suite("Functional Tests", function () {
  this.timeout(5000);
  suite("POST /api/issues/{project}", () => {
    test("Create an issue with every field", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send({
          issue_title: "Test",
          issue_text: "Test",
          created_by: "Test",
          assigned_to: "Test",
          status_text: "Test",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          issueIds.push(res.body._id);
          assert.equal(res.body.issue_title, "Test");
          assert.equal(res.body.issue_text, "Test");
          assert.equal(res.body.created_by, "Test");
          assert.equal(res.body.assigned_to, "Test");
          assert.equal(res.body.status_text, "Test");
          assert.equal(res.body.open, true);
          assert.isNotNull(res.body.created_on);
          assert.isNotNull(res.body.updated_on);
          done();
        });
    });
    test("Create an issue with only required fields", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send({
          issue_title: "Test2",
          issue_text: "Test2",
          created_by: "Test2",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          issueIds.push(res.body._id);
          assert.equal(res.body.issue_title, "Test2");
          assert.equal(res.body.issue_text, "Test2");
          assert.equal(res.body.created_by, "Test2");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(res.body.open, true);
          assert.isNotNull(res.body.created_on);
          assert.isNotNull(res.body.updated_on);
          done();
        });
    });
    test("Create an issue with missing required fields", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send({
          issue_title: "Test3",
          issue_text: "Test3",
          assigned_to: "Test3",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });

  suite("GET /api/issues/{project}", () => {
    test("View issues on a project", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body);
          assert.isNotEmpty(res.body);
          done();
        });
    });
    test("View issues on a project with one filter", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")
        .query({ issue_title: "Test2" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body);
          assert.equal(res.body[0].issue_title, "Test2");
          done();
        });
    });
    test("View issues on a project with multiple filters", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")
        .query({ created_by: "Test", assigned_to: "Test" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body);
          assert.equal(res.body[0].created_by, "Test");
          assert.equal(res.body[0].assigned_to, "Test");
          done();
        });
    });
  });

  suite("PUT /api/issues/{project}", () => {
    test("Update one field on an issue", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: issueIds[1],
          issue_title: "Test4",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, issueIds[1]);
          done();
        });
    });
    test("Update multiple fields on an issue", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: issueIds[1],
          issue_title: "Test5",
          issue_text: "Test5",
          created_by: "Test5",
          assigned_to: "Test5",
          status_text: "Test5",
          open: "false",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, issueIds[1]);
          done();
        });
    });
    test("Update an issue with missing _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          issue_title: "Test6",
          issue_text: "Test6",
          created_by: "Test6",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
    test("Update an issue with no fields to update", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: issueIds[1],
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "no update field(s) sent");
          assert.equal(res.body._id, issueIds[1]);
          done();
        });
    });
    test("Update an issue with an invalid _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: "invalid id",
          issue_title: "Test7",
          issue_text: "Test7",
          created_by: "Test7",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "could not update");
          assert.equal(res.body._id, "invalid id");
          done();
        });
    });
  });
  suite("DELETE /api/issues/{project}", () => {
    test("Delete an issue", (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest")
        .send({
          _id: issueIds[1],
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.result, "successfully deleted");
          assert.equal(res.body._id, issueIds[1]);
          issueIds.pop();
          done();
        });
    });
    test("Delete an issue with an invalid _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest")
        .send({
          _id: "invalid id",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.body._id, "invalid id");
          done();
        });
    });
    test("Delete an issue with missing _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
  });
});
