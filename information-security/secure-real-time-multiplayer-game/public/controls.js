const controls = (player, socket) => {
  const getKey = e => {
    switch (e.keyCode) {
      case 87:
      case 38:
        return 'up';
      case 83:
      case 40:
        return 'down';
      case 65:
      case 37:
        return 'left';
      case 68:
      case 39:
        return 'right';
    }
  }

  document.onkeydown = e => {
    const dir = getKey(e);
    if (dir) {
      player.moveDir(dir);
      socket.emit("move-player", dir, { x: player.x, y: player.y })
    }
  }

  document.onkeyup = e => {
    const dir = getKey(e);
    if (dir) {
      player.stopDir(dir);
      socket.emit("stop-player", dir, { x: player.x, y: player.y })
    }
  }
}

module.exports = controls;
