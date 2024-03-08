// import Player from './Player.mjs';
// import Collectible from './Collectible.mjs';
// import controls from "./controls.mjs";
// import { generateStartPos, canvasCalcs } from "./canvas-data.mjs";
const Player = require("./Player.js");
const Collectible = require("./Collectible.js");
const controls = require("./controls.js");
const { generateStartPos, canvasCalcs } = require("./canvas-data.js")

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d', { alpha: false });

const loadImage = src => {
  const img = new Image();
  img.src = src;
  return img;
}

const bronzeCoinArt = loadImage("https://cdn.freecodecamp.org/demo-projects/images/bronze-coin.png");
const silverCoinArt = loadImage("https://cdn.freecodecamp.org/demo-projects/images/silver-coin.png")
const goldCoinArt = loadImage("https://cdn.freecodecamp.org/demo-projects/images/gold-coin.png")
const mainPlayerArt = loadImage("https://cdn.freecodecamp.org/demo-projects/images/main-player.png")
const otherPlayerArt = loadImage("https://cdn.freecodecamp.org/demo-projects/images/other-player.png")

let tick;
let currPlayers = [];
let item;
let endGame;

socket.on("init", ({ id, players, coin }) => {
  console.log(`Connected ${id}`);
  cancelAnimationFrame(tick);
  const mainPlayer = new Player({
    x: generateStartPos(
      canvasCalcs.playFieldMinX,
      canvasCalcs.playFieldMaxX,
      5
    ),
    y: generateStartPos(
      canvasCalcs.playFieldMinY,
      canvasCalcs.playFieldMaxY,
      5
    ),
    id,
    main: true
  });

  controls(mainPlayer, socket);

  socket.emit("new-player", mainPlayer);

  socket.on("new-player", obj => {
    const playerIds = currPlayers.map(player => player.id);
    if (!playerIds.includes(obj.id)) currPlayers.push(new Player(obj));
  });

  socket.on("move-player", ({ id, dir, posObj }) => {
    const movingPlayer = currPlayers.find(obj => obj.id === id);
    movingPlayer.moveDir(dir);
    movingPlayer.x = posObj.x;
    movingPlayer.y = posObj.y;
  })

  socket.on("stop-player", ({ id, dir, posObj }) => {
    const stoppingPlayer = currPlayers.find(obj => obj.id === id);
    stoppingPlayer.stopDir(dir);
    stoppingPlayer.x = posObj.x;
    stoppingPlayer.y = posObj.y;
  });

  socket.on("new-coin", newCoin => item = new Collectible(newCoin))

  socket.on("remove-player", id => {
    console.log(`${id} disconnected`);
    currPlayers = currPlayers.filter(player => player.id !== id);
  })

  socket.on("end-game", result => endGame = result);

  socket.on("update-player", playerObj => {
    const scoringPlayer = currPlayers.find(obj => obj.id === playerObj.id);
    scoringPlayer.score = playerObj.score;
  })

  currPlayers = players.map(val => new Player(val)).concat(mainPlayer);
  item = new Collectible(coin);

  draw();
});

const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#220";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "white";
  context.strokeRect(
    canvasCalcs.playFieldMinX,
    canvasCalcs.playFieldMinY,
    canvasCalcs.playFieldWidth,
    canvasCalcs.playFieldHeight
  );

  context.fillStyle = "white";
  context.font = `13px 'Press Start 2p'`;
  context.textAlign = "center";
  context.fillText("Controls WASD", 100, 32.5)

  context.font = `16px 'Press Start 2p'`;
  context.fillText("Coin Race", canvasCalcs.canvasWidth / 2, 32.5);

  currPlayers.forEach(player => player.draw(context, item, { mainPlayerArt, otherPlayerArt }, currPlayers));

  item.draw(context, { bronzeCoinArt, silverCoinArt, goldCoinArt });

  if (item.destroyed) socket.emit("destroy-item", {
    playerId: item.destroyed,
    coinValue: item.value,
    coinId: item.id
  })

  if (endGame) {
    context.fillStyle = "white";
    context.font = `13px 'Press Start 2p'`;
    context.fillText(`You ${endGame}! Restart and try again.`,
      canvasCalcs.canvasWidth / 2,
      80)
  }

  if (!endGame) tick = requestAnimationFrame(draw);
}
