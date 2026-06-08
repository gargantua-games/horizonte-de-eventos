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


    this.text1 = this.add.text(
      322,
      90,
      "A nave em que você trabalha como engenheiro está sob ataque. Por sorte, seu colega na sala de controle consegue te ajudar em seu caminho para as naves de fuga. Mas seja rápido, sua nave se aproxima do horizonte de eventos de um buraco negro!",
      {
        fontFamily: "sarpanchregular",
        fontSize: "20px",
        fill: "#63ff8a",
      },
    );

  }

  update() {}
}
export default iniciov;
