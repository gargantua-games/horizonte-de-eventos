var config = {
  type: Phaser.AUTO,
  width: 820,
  height: 480,
  parent: "game-container",
  physics:{
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 200 },
      debug: true
    } 
  },
};

export default config;