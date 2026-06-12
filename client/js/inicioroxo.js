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
    bg.setAlpha(0);

    this.teclado = this.add.image(150, 0, "funcaoteclado").setOrigin(0, 0).setDepth(999);
    setTimeout(() => {
      this.teclado.setVisible(false);
    }, 10000);


    this.text1 = this.add.text(
      322,
      110,
      "Quando a nave em que trabalhava ficou sob\nataque, você estava na sala de controle.\nAgora, sua função é abrir as portas\nremotamente para que seu colega possa\ncoletar cartões de segurança que lhes darão\nacesso a uma nave de fuga.\nE para piorar, sua nave está se aproximando\ndo horizonte de eventos de um buraco negro!",
      {
        fontFamily: "sarpanchregular",
        fontSize: "19px",
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

    this.delayedCall = this.time.delayedCall(23000, () => { //13000
      this.tweens.add({
        targets: [bg, this.text1],
        alpha: 0,
        duration: 1200,
        ease: "Linear",
        delay: 200,
      });
    });
     
    this.delayedCall = this.time.delayedCall(25000, () => { //15000
      this.scene.stop("inicioroxo");
      this.scene.start("scene1");
    });

  }

  update() {}
}
export default inicioroxo;
