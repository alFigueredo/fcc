const { Issue, Project } = require("../models/issue");
const mongoose = require("mongoose");

function IssueTracker() {
  this.createIssue = async (projectName, issueData, done) => {
    try {
      if (
        !issueData.issue_title ||
        !issueData.issue_text ||
        !issueData.created_by
      )
        throw { error: "required field(s) missing" };
      const newIssue = new Issue(issueData);
      const project = await Project.findOne({ name: projectName });
      if (!project) {
        const newProject = new Project({ name: projectName });
        await newProject.save();
        newIssue.project_id = newProject._id;
      } else {
        newIssue.project_id = project._id;
      }
      await newIssue.save();
      done(null, newIssue);
    } catch (err) {
      done(err, null);
    }
  };

  this.getIssues = async (projectName, query, done) => {
    try {
      const project = await Project.findOne({ name: projectName });
      if (!project) {
        done(null, []);
      } else {
        const issues = await Issue.find({ project_id: project._id, ...query });
        done(null, issues);
      }
    } catch (err) {
      done(err, null);
    }
  };

  this.updateIssue = async (projectName, updatedData, done) => {
    try {
      const issueId = updatedData._id;
      if (!issueId) throw { error: "missing _id" };
      if (!mongoose.Types.ObjectId.isValid(issueId))
        throw { error: "could not update", _id: issueId };
      if (
        !updatedData.issue_title &&
        !updatedData.issue_text &&
        !updatedData.created_by &&
        !updatedData.assigned_to &&
        !updatedData.status_text &&
        !updatedData.open
      )
        throw { error: "no update field(s) sent", _id: issueId };
      const project = await Project.findOne({ name: projectName });
      if (!project) throw { error: "could not update", _id: issueId };
      const issue = await Issue.findOneAndUpdate(
        { _id: issueId, project_id: project._id },
        { ...updatedData, updated_on: Date.now() }
      );
      if (!issue) throw { error: "could not update", _id: issueId };
      await issue.save();
      done(null, {
        result: "successfully updated",
        _id: issueId,
      });
    } catch (err) {
      done(err, null);
      if (
        ["missing _id", "no update field(s) sent", "could not update"].includes(
          err.error
        )
      )
        done(err, null);
      else done({ error: "could not update", _id: updatedData._id }, null);
    }
  };

  this.deleteIssue = async (projectName, issueData, done) => {
    try {
      const issueId = issueData._id;
      if (!issueId) throw { error: "missing _id" };
      if (!mongoose.Types.ObjectId.isValid(issueId))
        throw { error: "could not delete", _id: issueId };
      const project = await Project.findOne({ name: projectName });
      if (!project) throw { error: "could not delete", _id: issueId };
      const issue = await Issue.findOneAndDelete({
        _id: issueId,
        project_id: project._id,
      });
      if (!issue) throw { error: "could not delete", _id: issueId };
      done(null, { result: "successfully deleted", _id: issueId });
    } catch (err) {
      if (["missing _id", "could not delete"].includes(err.error))
        done(err, null);
      else done({ error: "could not delete", _id: issueData._id }, null);
    }
  };
}

module.exports = IssueTracker;
