class preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  init(data) {
    this.nextScene = (data && data.startScene) || "scene1";
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
    this.cameras.main.setBackgroundColor("#000000");

    this.add.rectangle(540, 200, 468, 32).setStrokeStyle(1, 0x63ff8a).setScale(0.8);
    const bar = this.add
      .rectangle(586 - 230, 200, 4, 28, 0x63ff8a)
      .setScale(0.8);

    this.load.on("progress", (progress) => {
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.setPath("assets/");

    this.load.image("terminal", "terminal.png");

    this.load.image("avisoconsole", "avisoconsole.png");

    this.load.audio("passos", "walkamongus.mp3");
    this.load.audio("trilhasonora", "trilhasonora.mp3");

    this.load.image("space", "assets-usados/space1.png", {
      frameWidth: 1536,
      frameHeight: 3000,
    });

    this.load.spritesheet("gargantua", "assets-usados/gargantua.png", {
      frameWidth: 320,
      frameHeight: 320,
    });

    this.load.spritesheet("iaBox", "iaBox.png", {
      frameWidth: 322,
      frameHeight: 51,
    });
    
    
    this.load.tilemapTiledJSON("todasfases", "mapasv4/todasfases.json");

    this.load.image("remasterized", "assets-usados/remasterized.png");
    this.load.image(
      "remasterizedEnfeites",
      "assets-usados/remasterizedEnfeites.png",
    );

    this.load.spritesheet("player", "player.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("invisible", "InvisibleSprite.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("invisibleH", "invisibleH.png", {
      frameWidth: 16,
      frameHeight: 300,
    });

    this.load.spritesheet("plataform", "plataform.png", {
      frameWidth: 64,
      frameHeight: 8,
    });

    this.load.spritesheet("plataformG", "plataformG.png", {
      frameWidth: 96,
      frameHeight: 8,
    });

    this.load.spritesheet("door", "porta.png", {
      frameHeight: 64,
      frameWidth: 64,
    });

    this.load.image("cai", "buttons.png", {
      frameWidth: 416,
      frameHeight: 8,
    });

    this.load.spritesheet("engrenagem", "cartoes.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("box", "box.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("boxD", "boxD.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("jetBag", "jetpack.png", {
      frameWidth: 20,
      frameHeight: 23,
    });

    this.load.spritesheet("inimigo", "inimigo3.png", {
      frameWidth: 117,
      frameHeight: 70,
    });

    this.load.spritesheet("torreta", "torretaetiro.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("turret", "turret.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

   this.load.spritesheet("cannon", "cannon.png", {
      frameWidth: 64,
      frameHeight: 64,
   });
    
   this.load.spritesheet("bulletP1", "laserBullet.png", {
      frameWidth: 12,
      frameHeight: 12,
    });

    //preload do tilemap da faseortogonal
    this.load.tilemapTiledJSON(
      "faseortogonal",
      "mapasv4/faseortogonalatualizada.json",
    );

    this.load.image("remasterized2", "assets-usados/remasterized.png");
    this.load.image(
      "remasterizedEnfeites",
      "assets-usados/remasterizedEnfeites.png",
    );
    this.load.image("NewPiskel", "assets-usados/NewPiskel.png");
    this.load.image("consoles", "assets-usados/console_s.png");
    this.load.image("consolew", "assets-usados/console_w.png");
    this.load.image("tilesetx1", "assets-usados/tilesetx1.png");
    this.load.image("space1", "assets-usados/space1.png");
    this.load.image("consolelongo", "assets-usados/consolelongo.png");
    this.load.image("consolemedio", "assets-usados/consolemedio.png");
    this.load.image("telescopio", "assets-usados/telescopio.png");
    this.load.image("osciloscopio", "assets-usados/osciloscopio.png");

    //preload do sprite do player roxo
    this.load.spritesheet("playerroxo", "playerroxo.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("plataform", "plataform.png", {
      frameWidth: 64,
      frameHeight: 8,
    });

    this.load.spritesheet("bigboss", "InvisibleSprite.png", {
      frameWidth: 25,
      frameHeight: 25,
    });

    this.load.spritesheet("porta", "porta64x64(2).png", {
      frameWidth: 128,
      frameHeight: 32,
    });

    this.load.spritesheet("ativaraliens", "ativaraliens.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("inimigo3", "inimigo3.png", {
      frameWidth: 117,
      frameHeight: 70,
    });

    this.load.spritesheet("vidasroxas", "vidasroxas.png", {
      frameWidth: 48,
      frameHeight: 16,
    });

    this.load.font("sarpanchregular", "sarpanchregular.otf");

    this.load.font("sarpanchextrabold", "sarpanchextrabold.otf");

    //tiro das naves aliadas (gamers)

    this.load.image("tiroaliado", "tiros/tiroaliado.png")
    this.load.image("tiroaliadoforte", "tiros/tiroaliadoforte.png")
    this.load.image("tiroaliadomegapotente", "tiros/tiroaliadomegapotente.png")

    //tiro das naves aliens

    this.load.image("tiroinimigo", "tiros/tiroinimigo.png")
    this.load.image("tiroinimigoforte", "tiros/tiroinimigoforte.png")
    this.load.image("tiroinimigomegapotente", "tiros/tiroinimigomegapotente.png")

    //naves aliadas (dos jogadores)

    this.load.image("nave-1", "naves/nave-1.png");
    this.load.image("nave-2", "naves/nave-2.png");
    this.load.image("nave-3", "naves/nave-3.png");
    this.load.image("nave-4", "naves/nave-4.png");
    this.load.image("nave-5", "naves/nave-5.png");
    this.load.image("naveet", "naves/naveet.png");
  }

  create() {
    this.scene.stop("preloader");
    this.scene.start(this.nextScene //|| "scene1"
    );
  }
}

export default preloader;
