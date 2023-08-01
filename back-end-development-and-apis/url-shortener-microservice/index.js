require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let dns = require("dns");
let urlparser = require("url");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: "false" }));
mongoose
  .connect(process.env["MONGO_URI"], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Succesfully connected to DB"))
  .catch((e) => console.log(e));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
    unique: true,
  },
  short_url: {
    type: Number,
    required: true,
    unique: true,
  },
});

const Url = new mongoose.model("Url", urlSchema);

const createAndSaveUrl = async (url, short_url, done) => {
  try {
    var url = new Url({ original_url: url, short_url });
    const data = await url.save();
    done(null, data);
  } catch (err) {
    // return console.error(err);
  }
};

const findOneByUrl = async (url, done) => {
  try {
    const data = await Url.findOne({ original_url: url });
    done(null, data);
  } catch (err) {
    // return console.error(err);
  }
};

const findOneByShortUrl = async (short_url, done) => {
  try {
    const data = await Url.findOne({ short_url });
    done(null, data);
  } catch (err) {
    done(err, null);
  }
};

// Your first API endpoint
app.route("/api/shorturl").post((req, res, next) => {
  let url = req.body.url;
  url = url[url.length - 1] === "/" ? url.slice(0, -1) : url;
  let short_url;
  dns.lookup(urlparser.parse(url).hostname, async (err, address) => {
    if (!address) {
      res.json({ error: "invalid url" });
    } else {
      const count = await Url.countDocuments({});
      short_url = count + 1;
      createAndSaveUrl(url, short_url, (err, data) => {
        if (err) return next(err);
      });
      findOneByUrl(url, (err, data) => {
        if (err) return next(err);
        const { original_url, short_url } = data;
        res.json({ original_url, short_url });
      });
    }
  });
});

app.get("/api/shorturl/:short_url", (req, res, next) => {
  let short_url = req.params.short_url;
  findOneByShortUrl(short_url, (err, data) => {
    if (err) res.json({ error: "No short URL found for the given input" });
    else res.redirect(data.original_url);
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
