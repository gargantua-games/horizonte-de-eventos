class preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  init(data) {
    // Recebe a próxima cena (padrão "scene1")
    this.nextScene = (data && data.startScene) || "scene1";
  }

  preload() {
    this.cameras.main.setBackgroundColor("#000000");

    // --- SISTEMA DA BARRA DE CARREGAMENTO VISUAL (GRAPHICS) ---
    // Criamos os componentes gráficos para evitar bugs de posicionamento e escala
    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();

    // Desenha o contorno da barra de carregamento centralizada na tela
    progressBox.lineStyle(2, 0x63ff8a, 1);
    progressBox.strokeRect(340, 200, 400, 30);

    // Evento que atualiza a barra conforme os ficheiros são descarregados
    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x63ff8a, 1);
      // O preenchimento cresce proporcionalmente de 0 a 396px da esquerda para a direita
      progressBar.fillRect(342, 202, 396 * value, 26);
    });

    this.load.on("complete", () => {
      progressBox.destroy();
      progressBar.destroy();
    });

    // --- CARREGAMENTO DOS ASSETS ---
    this.load.setPath("assets/");

    // Imagens de Interface e Sistema
    this.load.image("terminal", "terminal.png");
    this.load.spritesheet("avisoconsole", "avisoconsole.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("iaBox", "iaBox.png", {
      frameWidth: 322,
      frameHeight: 51,
    });
    this.load.spritesheet("bigIa", "iaBoxBig.png", {
      frameWidth: 640,
      frameHeight: 224,
    });
    this.load.image("cai", "buttons.png");

    // Áudios
    this.load.audio("passos", "walkamongus.mp3");
    this.load.audio("trilhasonora", "trilhasonora.mp3");

    // Mapas e Elementos de Cenário
    this.load.tilemapTiledJSON("todasfases", "mapasv4/todasfases.json");
    this.load.tilemapTiledJSON(
      "faseortogonal",
      "mapasv4/faseortogonalatualizada.json",
    );

    this.load.image("space", "assets-usados/space1.png");
    this.load.image("space1", "assets-usados/space1.png");
    this.load.image("remasterized", "assets-usados/remasterized.png");
    this.load.image(
      "remasterizedEnfeites",
      "assets-usados/remasterizedEnfeites.png",
    );
    this.load.image("NewPiskel", "assets-usados/NewPiskel.png");
    this.load.image("consoles", "assets-usados/console_s.png");
    this.load.image("consolew", "assets-usados/console_w.png");
    this.load.image("tilesetx1", "assets-usados/tilesetx1.png");
    this.load.image("consolelongo", "assets-usados/consolelongo.png");
    this.load.image("consolemedio", "assets-usados/consolemedio.png");
    this.load.image("telescopio", "assets-usados/telescopio.png");
    this.load.image("osciloscopio", "assets-usados/osciloscopio.png");
      this.load.image("remasterized2", "assets-usados/remasterized.png");
      this.load.image("remasterizedEnfeites","assets-usados/remasterizedEnfeites.png", );

    // Personagens e Entidades
    this.load.spritesheet("player", "player.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("playerroxo", "playerroxo.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("playersIcon", "playersIcon.png", {
      frameWidth: 30,
      frameHeight: 30,
    });
    this.load.spritesheet("gargantua", "assets-usados/gargantua.png", {
      frameWidth: 320,
      frameHeight: 320,
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
    this.load.spritesheet("porta", "porta64x64(2).png", {
      frameWidth: 128,
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
    this.load.spritesheet("engrenagem", "cartoes.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("jetBag", "jetpack.png", {
      frameWidth: 20,
      frameHeight: 23,
    });

    // Inimigos
    this.load.spritesheet("inimigo", "inimigo3.png", {
      frameWidth: 117,
      frameHeight: 70,
    });
    this.load.spritesheet("inimigo3", "inimigo3.png", {
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
    this.load.spritesheet("ativaraliens", "ativaraliens.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("bigboss", "InvisibleSprite.png", {
      frameWidth: 25,
      frameHeight: 25,
    });

    // Projéteis e Efeitos
    this.load.spritesheet("bulletP1", "laserBullet.png", {
      frameWidth: 12,
      frameHeight: 12,
    });
    this.load.spritesheet("faisca", "spark.png", {
      frameWidth: 28,
      frameHeight: 28,
    });
    this.load.image("tiroaliado", "tiros/tiroaliado.png");
    this.load.image("tiroaliadoforte", "tiros/tiroaliadoforte.png");
    this.load.image("tiroaliadomegapotente", "tiros/tiroaliadomegapotente.png");
    this.load.image("tiroinimigo", "tiros/tiroinimigo.png");
    this.load.image("tiroinimigoforte", "tiros/tiroinimigoforte.png");
    this.load.image(
      "tiroinimigomegapotente",
      "tiros/tiroinimigomegapotente.png",
    );

    // Naves Aliadas (Jogadores)
    this.load.image("nave-1", "naves/nave-1.png");
    this.load.image("nave-2", "naves/nave-2.png");
    this.load.image("nave-3", "naves/nave-3.png");
    this.load.image("nave-4", "naves/nave-4.png");
    this.load.image("nave-5", "naves/nave-5.png");
    this.load.image("naveet", "naves/naveet.png");

    // UI e Fontes
    this.load.spritesheet("vidasroxas", "vidasroxas.png", {
      frameWidth: 48,
      frameHeight: 16,
    });
    this.load.spritesheet("redLife", "redLife.png", {
      frameHeight: 18,
      frameWidth: 46,
    });
    // Fontes carregadas via CSS ou WebFontLoader
    this.load.spritesheet("comojogar", "comojogarsprite.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    // SEÇÃO CORRIGIDA: O plano de fundo agora é calculado aqui, garantindo que
    // bg.width e bg.height possuam o tamanho real do ficheiro carregado!
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

    // Finaliza a cena atual e inicia a próxima
    this.scene.stop("preloader");
    this.scene.start(this.nextScene);
  }
}

export default preloader;
