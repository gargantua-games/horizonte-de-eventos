class gameover1 extends Phaser.Scene {
  constructor() {
    super("gameover1");
  }

  //preload() {
   // this.load.image("terminal", "assets/terminal.png");
  //}

  create() {
    this.sound.stopAll();
    
    this.trilhacreditos = this.sound.add("trilhacreditos", {
      loop: true,
      volume: 1,
    });
    this.trilhacreditos.play();


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

    const Text1 = "SIMULAÇÃO FRACASSADA";
    const Text2 = "Você falhou.\nMais sorte da próxima vez";

    this.text1 = this.add.text(325, 110, "", {
      fontFamily: "sarpanchregular",
      fontSize: "33px",
      fill: "#63ff8a",
    });

    this.text2 = this.add.text(320, 200, "", {
      fontFamily: "sarpanchregular",
      fontSize: "25px",
      fill: "#63ff8a",
    });

    let displayed1 = "";
    let index1 = 0;
    let displayed2 = "";
    let index2 = 0;

    const typeChar1 = () => {
      if (index1 < Text1.length) {
        displayed1 += Text1[index1++];
        this.text1.setText(displayed1);
        this.time.delayedCall(100, typeChar1, [], this);
      } else {
        // quando terminar o Text1, aguarda um pouco e inicia o segundo
        this.time.delayedCall(600, typeChar2, [], this);
      }
    };

    const typeChar2 = () => {
      if (index2 < Text2.length) {
        displayed2 += Text2[index2++];
        this.text2.setText(displayed2);
        this.time.delayedCall(80, typeChar2, [], this);
      }
    };

    typeChar1();

     this.delayedCall = this.time.delayedCall(10000, () => {
       //12000
       this.tweens.add({
         targets: [bg, this.text1,this.text2],
         alpha: 0,
         duration: 1200,
         ease: "Linear",
         delay: 200,
       });
     });
    
    this.time.delayedCall(12000, () => {
      this.scene.stop("gameover1");
      this.scene.start("creditos");
    });

  }

  update() {}
}
export default gameover1;
