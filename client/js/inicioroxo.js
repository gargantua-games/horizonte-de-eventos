class inicioroxo extends Phaser.Scene {
  constructor() {
    super("inicioroxo");
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
      "Quando a nave em que trabalhava ficou sob\nataque, você estava na sala de controle.\nAgora, sua função é abrir as portas\nremotamente para que seu colega possa coletar\ncartões de segurança que lhes darão acesso a uma nave de fuga.\nE para piorar, sua nave está se aproximando\ndo horizonte de eventos de um buraco negro!",
      {
        fontFamily: "sarpanchregular",
        fontSize: "20px",
        fill: "#63ff8a",
      },
    );

  }

  update() {}
}
export default inicioroxo;
