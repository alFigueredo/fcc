// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();
require("dotenv").config();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

app.use(express.json());

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get(
  "/api",
  (req, res, next) => {
    const now = new Date();
    req.unix = now.getTime();
    req.utc = now.toUTCString();
    next();
  },
  (req, res) => {
    res.json({ unix: req.unix, utc: req.utc });
  }
);

app.get(
  "/api/:date",
  (req, res, next) => {
    const now = new Date(
      isNaN(req.params.date) ? req.params.date : parseInt(req.params.date)
    );
    req.unix = now.getTime();
    req.utc = now.toUTCString();
    next();
  },
  (req, res) => {
    if (req.utc == "Invalid Date") res.json({ error: req.utc });
    else res.json({ unix: req.unix, utc: req.utc });
  }
);

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
