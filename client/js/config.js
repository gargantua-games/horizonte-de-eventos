var config = {
  type: Phaser.AUTO,
  width: 1100,
  height: 400,
  input: {
    gamepad: true,
  },
  parent: "game-container",
  physics: {
    default: 'Arcade',
    matter: {
        gravity: { y: 900 },
        debug: false 
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  }
};

export default config;