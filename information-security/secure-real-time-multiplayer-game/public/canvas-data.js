const canvasWidth = 640;
const canvasHeight = 480;
const playerWidth = 30;
const playerHeight = 30;
const border = 5;
const infoBar = 45;

const canvasCalcs = {
  canvasWidth,
  canvasHeight,
  playFieldMinX: canvasWidth / 2 - (canvasWidth - 10) / 2,
  playFieldMinY: canvasHeight / 2 - (canvasHeight - 100) / 2,
  playFieldWidth: canvasWidth - border * 2,
  playFieldHeight: canvasHeight - border * 2 - infoBar,
  playFieldMaxX: canvasWidth - border - playerWidth,
  playFieldMaxY: canvasHeight - border - playerHeight
}

const generateStartPos = (min, max, multiple) => Math.floor(Math.random() * ((max - min) / multiple)) * multiple + min;

module.exports = { generateStartPos, canvasCalcs };
