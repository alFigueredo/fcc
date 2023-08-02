var express = require("express");
var app = express();
var cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const upload = multer();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app
  .route("/api/fileanalyse")
  .post(upload.single("upfile"), (req, res, next) => {
    const { originalname, mimetype, size } = req.file;
    res.json({ name: originalname, type: mimetype, size });
  });

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
