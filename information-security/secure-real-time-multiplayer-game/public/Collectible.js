class Collectible {
  constructor({ x = 10, y = 10, w = 15, h = 15, value = 1, id }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.value = value;
    this.id = id;
  }

  draw = (context, imgObj) => {
    switch (this.value) {
      case 1:
        context.drawImage(imgObj.bronzeCoinArt, this.x, this.y);
        break;
      case 2:
        context.drawImage(imgObj.silverCoinArt, this.x, this.y);
        break;
      default:
        context.drawImage(imgObj.goldCoinArt, this.x, this.y);
    }
  }
}

module.exports = Collectible;
