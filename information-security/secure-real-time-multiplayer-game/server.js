require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expect = require("chai");
const socket = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const nocache = require("nocache");
const { v4: uuidv4 } = require("uuid");

const Collectible = require("./public/Collectible");
const { generateStartPos, canvasCalcs } = require("./public/canvas-data");

const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");

const app = express();

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/assets", express.static(process.cwd() + "/assets"));
app.use(
  "/socket.io",
  express.static(process.cwd() + "/node_modules/socket.io/client-dist"),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Security
app.use(
  helmet({
    noCache: true,
    hidePoweredBy: { setTo: "PHP 7.4.3" },
  }),
);
app.use(nocache());

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: "*" }));

// Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log("Tests are not valid:");
        console.error(error);
      }
    }, 1500);
  }
});

const io = new socket.Server(server);
let players = [];
let getCoin = () =>
  new Collectible({
    x: generateStartPos(
      canvasCalcs.playFieldMinX,
      canvasCalcs.playFieldMaxX,
      5,
    ),
    y: generateStartPos(
      canvasCalcs.playFieldMinY,
      canvasCalcs.playFieldMaxY,
      5,
    ),
    value: Math.floor(Math.random() * 3) + 1,
    id: uuidv4(),
  });
let coin = getCoin();

io.on("connection", (socketio) => {
  console.log("a user connected");
  if (!coin) coin = new Collectible({ id });
  socketio.emit("init", { id: socketio.id, players, coin });

  socketio.on("new-player", (obj) => {
    const playerIds = players.map((player) => player.id);
    if (!playerIds.includes(obj.id)) players.push(obj);
    socketio.broadcast.emit("new-player", obj);
  });

  socketio.on("move-player", (dir, posObj) => {
    socketio.broadcast.emit("move-player", { id: socketio.id, dir, posObj });
  });

  socketio.on("stop-player", (dir, posObj) => {
    socketio.broadcast.emit("stop-player", { id: socketio.id, dir, posObj });
  });

  socketio.on("destroy-item", ({ playerId, coinValue, coinId }) => {
    if (coinId === coin.id) {
      const player = players.find((player) => player.id === playerId);
      player.score += coinValue;
      coin = getCoin();
      io.emit("new-coin", coin);
      io.emit("update-player", player);
    }
  });

  socketio.on("disconnect", () => {
    console.log("a user disconnected");
    players = players.filter((player) => player.id !== socketio.id);
    socketio.broadcast.emit("remove-player", socketio.id);
  });
});

module.exports = app; // For testing
