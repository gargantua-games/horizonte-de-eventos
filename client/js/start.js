class start extends Phaser.Scene {
  constructor() {
    super("start");
  }

  init() {
    //let room = new URLSearchParams(location.search).get("room");
    //if (room) this.game.room = room;
  }

  preload() {
    this.load.image("capa", "assets/fundocapatitulo.png");
    this.load.image("playroxo", "assets/playerroxocapa2.png");
    this.load.image("playvermelho", "assets/playervermelhocapa.png");
    this.load.image("terminal", "assets/terminal.png");
    this.load.font("sarpanchregular", "assets/sarpanchregular.otf");
    /*this.load.setPath("assets/assets-usados");
    this.load.image("start", "Startsceneredimencionada.png");
    this.load.spritesheet("gargantuac", "gargantuac.png", {
      frameWidth: 220,
      frameHeight: 160,
    });*/
  }

  create() {
    // Fundo da tela de título com proporção preservada
    const bg = this.add.image(0, 0, "capa").setOrigin(0, 0).setDepth(0);
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
    this.cameras.main.setBackgroundColor("#000000");

    // Player roxo e player vermelho na capa
    const margin = 60;
    //const roxoX = bg.x + margin;
    //const roxoY = bg.y + displayHeight - margin;
    this.playerRoxo = this.add
      .image(525, 260, "playroxo")
      .setScale(0.35)
      .setInteractive({ cursor: "pointer" })
      .setDepth(1);

    this.playerVermelho = this.add
      .image(600, 250, "playvermelho")
      .setScale(0.35)
      .setInteractive({ cursor: "pointer" })
      .setDepth(1);

    // Animação de subida e descida leve para os personagens (fora de sincronia)
    this.tweens.add({
      targets: this.playerRoxo,
      y: "+=10",
      duration: 1200,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: this.playerVermelho,
      y: "+=10",
      duration: 1400,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
      delay: 300,
    });

    // Click no player roxo abre scene1
    this.playerRoxo.on("pointerdown", () => {
      this.webrtcGetMic();
      this.scene.stop("start");
      this.scene.start("preloader", { startScene: "scene1" });
    });

    // Click no player vermelho abre scene0
    this.playerVermelho.on("pointerdown", () => {
      this.webrtcGetMic();
      this.scene.stop("start");
      this.scene.start("preloader", { startScene: "scene1" });
    });

    this.textoInstrucao = this.add.text(
    this.scale.width / 2,     // Centralizado no eixo X
    this.scale.height - 50,   // Um pouco acima do fundo da tela
    "Aperte na tela ou Q para iniciar", // Texto padrão
    {
      fontFamily: "sarpanchregular",
      fontSize: "16px",
      fill: "#dd9039",            // Cor do texto pedida
      stroke: "#625042",          // Cor do contorno pedida
      strokeThickness: 6          // Espessura do contorno (ajuste se achar grosso/fino)
    }
  ).setOrigin(0.5).setDepth(2);

  // 2. Efeito do texto sumindo e aparecendo (Piscar)
  this.tweens.add({
    targets: this.textoInstrucao,
    alpha: 0,                    // Vai reduzir a opacidade até ficar invisível
    duration: 750,               // Tempo para sumir (750 milissegundos)
    yoyo: true,                  // Quando terminar de sumir, faz o caminho inverso (aparece)
    repeat: -1                   // -1 significa que vai repetir para sempre
  });
  
  this.padStartTriggered = false;
  }

  update() {

    const pad =
      this.input.gamepad && this.input.gamepad.total > 0
        ? this.input.gamepad.getPad(0)
        : null;
    
    if (pad) {
    this.textoInstrucao.setText("Aperte qualquer botão para iniciar");
  } else if(!pad){
    this.textoInstrucao.setText("Aperte na tela ou Q para iniciar");
  }
    
    let horizontal = 0;
    let reloadPressed = false;
    //let padPressed = false;

    if (pad && pad.axes.length > 0) {
      horizontal = pad.axes[0].getValue();
      reloadPressed = !!pad.R1;
    }
    const padPressed = !!pad && Array.isArray(pad.buttons)
      ? pad.buttons.some((button) => button && (button.pressed || button.value > 0.1))
      : false;


    const qer = this.input.keyboard.addKeys("Q,E,R");

    if (qer.Q.isDown) {
      //this.scene.start("scene1");
      this.webrtcGetMic();
      this.scene.stop("start");
      this.scene.start("preloader", { startScene: "inicioroxo" });
    }

    if (reloadPressed) {
      window.location.reload();
    } else if (!reloadPressed && (qer.E.isDown || (padPressed))) {
      //this.scene.start("scene0");
      this.webrtcGetMic();
      this.scene.stop("start");
      this.scene.start("preloader", { startScene: "iniciov" });
      //this.padStartTriggered = true;
    } 
        if (qer.R.isDown) {
      //this.scene.start("scene1");
      this.webrtcGetMic();
      this.scene.stop("start");
      this.scene.start("preloader", { startScene: "scene2" });
    }

  }

  webrtcGetMic() {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        this.game.media = stream;
      })
    //.catch((error) => console.error(error));
  }
}

export default start;
