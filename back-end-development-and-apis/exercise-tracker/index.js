const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: "false" }));
mongoose
  .connect(process.env["MONGO_URI"], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Succesfully connected to DB"))
  .catch((e) => console.log(e));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
});
const User = new mongoose.model("User", userSchema);

const exerciseSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
  },
  date: {
    type: String,
  },
  id: {
    type: String,
    required: true,
    unique: false,
  },
});
const Exercise = new mongoose.model("Exercise", exerciseSchema);

const createAndSaveUser = async (username, done) => {
  try {
    var user = new User({ username });
    const data = await user.save();
    done(null, data);
  } catch (err) {
    return console.error(err);
  }
};

const findOneByUser = async (username, done) => {
  try {
    const data = await User.findOne({ username });
    done(null, data);
  } catch (err) {
    return console.error(err);
  }
};

const findAllUsers = async (done) => {
  try {
    const data = await User.find({});
    done(null, data);
  } catch (err) {
    return console.error(err);
  }
};

const createAndSaveExercise = async (
  _id,
  description,
  duration,
  date,
  done
) => {
  try {
    date = date ? new Date(date).toDateString() : new Date().toDateString();
    const user = await User.findById(_id);
    var exercise = new Exercise({
      username: user.username,
      description,
      duration,
      date,
      id: _id,
    });
    const data = await exercise.save();
    done(null, data);
  } catch (err) {
    return console.error(err);
  }
};

const findExerciseById = async (_id, done) => {
  try {
    const data = await Exercise.findOne({ id: _id });
    done(null, data);
  } catch (err) {
    return console.error(err);
  }
};

const findUserById = async (_id, done) => {
  try {
    const data = await User.findOne({ _id: _id });
    done(null, data);
  } catch (err) {
    return console.error(err);
  }
};

const findExercises = async (_id, done) => {
  try {
    const data = await Exercise.find({ id: _id });
    done(null, data);
  } catch (err) {
    return console.error(err);
  }
};

app
  .route("/api/users")
  .get((req, res, next) => {
    findAllUsers((err, data) => {
      if (err) return next(err);
      else res.json(data);
    });
  })
  .post(
    (req, res, next) => {
      createAndSaveUser(req.body.username, (err, data) => {
        if (err) return next(err);
        else next();
      });
    },
    (req, res, next) => {
      findOneByUser(req.body.username, (err, data) => {
        if (err) return next(err);
        else {
          const { username, _id } = data;
          res.json({ username, _id });
        }
      });
    }
  );

app.route("/api/users/:_id/exercises").post(
  (req, res, next) => {
    createAndSaveExercise(
      req.params._id,
      req.body.description,
      req.body.duration,
      req.body.date,
      (err, data) => {
        if (err) return next(err);
        else next();
      }
    );
  },
  (req, res, next) => {
    findExerciseById(req.params._id, (err, data) => {
      if (err) return next(err);
      else {
        const { id, username, description, duration, date } = data;
        res.json({ _id: id, username, description, duration, date });
      }
    });
  }
);

app.route("/api/users/:_id/logs").get(
  (req, res, next) => {
    findUserById(req.params._id, (err, data) => {
      if (err) return next(err);
      else {
        req.params.username = data.username;
        next();
      }
    });
  },
  (req, res, next) => {
    findExercises(req.params._id, (err, data) => {
      if (err) return next(err);
      else {
        if (req.query.from) {
          const from = new Date(req.query.from);
          data = data.filter((log) => from < new Date(log.date));
        }
        if (req.query.to) {
          const to = new Date(req.query.to);
          data = data.filter((log) => to > new Date(log.date));
        }
        if (!isNaN(req.query.limit)) {
          data = data.slice(0, parseInt(req.query.limit));
        }
        res.json({
          _id: req.params._id,
          username: req.params.username,
          count: data.length,
          log: data.map((log) => {
            const { description, duration, date } = log;
            return {
              description,
              duration,
              date,
            };
          }),
        });
      }
    });
  }
);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
