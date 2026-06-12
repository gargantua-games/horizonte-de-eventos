class iniciov extends Phaser.Scene {
  constructor() {
    super("iniciov");
  }

  //preload() {
  // this.load.image("terminal", "assets/terminal.png");
  //}

  create() {
    const bg = this.add.image(0, 0, "terminal").setOrigin(0, 0).setDepth(0);
    const imageRatio = bg.width / bg.height;
    const screenRatio = this.scale.width / this.scale.height;

    let displayWidth = this.scale.width;
    let displayHeight = this.scale.height;

    if (screenRatio > imageRatio) {
      displayWidth = this.scale.height * imageRatio;
      displayHeight = this.scale.height;
    } else {
      displayWidth = this.scale.width;
      displayHeight = this.scale.width / imageRatio;
    }

    bg.setDisplaySize(displayWidth, displayHeight);
    bg.setPosition(
      (this.scale.width - displayWidth) / 2,
      (this.scale.height - displayHeight) / 2,
    );
    //this.terminal = this.add.image(200, 0, "terminal").setOrigin(0, 0);
    bg.setAlpha(0);
    
    this.manche = this.add.image(150, 0, "funcaomanche").setOrigin(0, 0).setDepth(999);
    setTimeout(() => {
      this.manche.setVisible(false);
    }, 8000);


    this.text1 = this.add.text(
      322,
      110,
      "A nave em que você trabalha como\nengenheiro está sob ataque. Por sorte,\nseu colega na sala de controle consegue te\najudar em seu caminho para as naves\nde fuga. Mas seja rápido, sua nave se\naproxima do horizonte de eventos de\num buraco negro!",
      {
        fontFamily: "sarpanchregular",
        fontSize: "20px",
        fill: "#63ff8a",
      },
    );
    this.text1.setAlpha(0);

    this.tweens.add({
      targets: [bg, this.text1],
      alpha: 1,
      duration: 1200,
      ease: "Linear",
      delay: 200,
    });

      this.delayedCall = this.time.delayedCall(12000, () => { //12000
        this.tweens.add({
          targets: [bg, this.text1],
          alpha: 0,
          duration: 1200,
          ease: "Linear",
          delay: 200,
        });
      });

      this.delayedCall = this.time.delayedCall(14000, () => { //14000
        this.scene.stop("iniciov");
        this.scene.start("scene0");
      });
  }

  update() {}
}
export default iniciov;
