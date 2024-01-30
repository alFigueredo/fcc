const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  project_id: mongoose.Schema.Types.ObjectId,
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: "" },
  open: { type: Boolean, default: true },
  status_text: { type: String, default: "" },
});
const Issue = mongoose.model("Issue", issueSchema);

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const Project = mongoose.model("Project", projectSchema);

module.exports = {
  Issue,
  Project,
};
