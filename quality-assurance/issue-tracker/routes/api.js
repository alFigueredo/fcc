"use strict";

const IssueTracker = require("../controllers/IssueTracker");
const issueTracker = new IssueTracker();

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      issueTracker.getIssues(project, req.query, (err, data) => {
        if (err) {
          return res.json(err);
        }
        return res.json(data);
      });
    })

    .post(function (req, res) {
      let project = req.params.project;
      issueTracker.createIssue(project, req.body, (err, data) => {
        if (err) {
          return res.json(err);
        }
        return res.json(data);
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
      issueTracker.updateIssue(project, req.body, (err, data) => {
        if (err) {
          return res.json(err);
        }
        return res.json(data);
      });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      issueTracker.deleteIssue(project, req.body, (err, data) => {
        if (err) {
          return res.json(err);
        }
        return res.json(data);
      });
    });
};
