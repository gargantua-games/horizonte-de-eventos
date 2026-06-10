class gameover2 extends Phaser.Scene {
  constructor() {
    super("gameover2");
  }

  //preload() {
    //this.load.image("terminal", "assets/terminal.png");
 // }

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

    const Text1 = "SIMULAÇÃO TERMINADA";
    const Text2 = "COM SUCESSO";
    const Text3 = "Parabéns, você conseguiu\nescapar da nave a tempo e\nconcluiu a simulação com êxito!"

    this.text1 = this.add.text(330, 110, "", {
      fontFamily: "sarpanchregular",
      fontSize: "29px",
      fill: "#63ff8a",
    });

    this.text2 = this.add.text(415, 150, "", {
      fontFamily: "sarpanchregular",
      fontSize: "29px",
      fill: "#63ff8a",
    });

    this.text3 = this.add.text(335, 220, "", {
      fontFamily: "sarpanchregular",
      fontSize: "23px",
      fill: "#63ff8a",
    });

    let displayed1 = "";
    let index1 = 0;
    let displayed2 = "";
    let index2 = 0;
    let displayed3 = "";
    let index3 = 0;

    const typeChar1 = () => {
      if (index1 < Text1.length) {
        displayed1 += Text1[index1++];
        this.text1.setText(displayed1);
        this.time.delayedCall(100, typeChar1, [], this);
      } else {
        // quando terminar o Text1, aguarda um pouco e inicia o segundo
          this.time.delayedCall(100, typeChar2, [], this);
        }
    };

    const typeChar2 = () => {
      if (index2 < Text2.length) {
        displayed2 += Text2[index2++];
        this.text2.setText(displayed2);
        this.time.delayedCall(100, typeChar2, [], this);
      } else {
        this.time.delayedCall(600, typeChar3, [], this);
      }
    };
    
    const typeChar3 = () => {
      if (index3 < Text3.length) {
        displayed3 += Text3[index3++];
        this.text3.setText(displayed3);
        this.time.delayedCall(80, typeChar3, [], this);
      }
    };

    typeChar1();
 this.delayedCall = this.time.delayedCall(13000, () => {
   //12000
   this.tweens.add({
     targets: [bg, this.text1, this.text2,this.text3],
     alpha: 0,
     duration: 1200,
     ease: "Linear",
     delay: 200,
   });
 });

 this.time.delayedCall(15000, () => {
   this.scene.stop("gameover2");
   this.scene.start("creditos");
 });
   
  }

  update() {}
}
export default gameover2;
