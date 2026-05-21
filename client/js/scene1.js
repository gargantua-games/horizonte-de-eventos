class scene1 extends Phaser.Scene {
  constructor() {
    super("scene1");

    this.speed = 200;
    this.estoutrabalhando = true;
    this.doorOpen = 0;
    this.fase4 = true;
    this.vida = 3;
    this.invulnerable = false;
  }

  init() {
    this.webrtcMakeCall();
  }

  /*preload() {
    this.load.setPath("assets/");

    this.load.audio("passos", "walkamongus.mp3");
    this.load.audio("trilhasonora", "trilhasonora.mp3");

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
  }*/

  create() {
    //adiciona trilha sonora e efeitos sonoros
    this.trilhasonora = this.sound
      .add("trilhasonora", { loop: true, volume: 0.2 })
      .play();
    this.passos = this.sound.add("passos", { loop: true, volume: 1 });

    //adiciona o espaço ao fundo
    this.space = this.add.image("space1");
    this.space.setOrigin(0, 0); //.setScrollFactor(0.1, 1);

    //adiciona o tilemap da sala ortogonal
    this.tilemap = this.make.tilemap({ key: "faseortogonal" });

    //adiciona os tilesets utilizados
    //this.tilesetRemasterized = this.tilemap.addTilesetImage("remasterized");
    this.tilesetRemasterized2 = this.tilemap.addTilesetImage("remasterized2");
    this.tilesetRemasterizedEnfeites = this.tilemap.addTilesetImage(
      "remasterizedEnfeites",
    );
    this.tilesetConsoles = this.tilemap.addTilesetImage("consoles");
    this.tilesetConsolew = this.tilemap.addTilesetImage("consolew");
    this.tilesetNewPiskel = this.tilemap.addTilesetImage("NewPiskel");
    this.tilesetx1 = this.tilemap.addTilesetImage("tilesetx1");
    this.tilesetSpace1 = this.tilemap.addTilesetImage("space1");

    this.layerEspaco = this.tilemap
      .createLayer("espaco", [this.tilesetSpace1])
      .setPipeline("Light2D");
    //.setScrollFactor(0.9, 1);

    this.layerPiso = this.tilemap
      .createLayer("piso", [this.tilesetx1, this.tilesetRemasterized2])
      .setPipeline("Light2D");
    //.setScrollFactor(0.9, 1);

    this.layerFundo = this.tilemap
      .createLayer("fundo", [
        this.tilesetRemasterized2,
        this.tilesetRemasterizedEnfeites,
      ])
      .setPipeline("Light2D");
    //.setScrollFactor(0.9, 1);

    this.layerParede = this.tilemap
      .createLayer("parede", [
        this.tilesetx1,
        this.tilesetRemasterizedEnfeites,
        this.tilesetRemasterized2,
      ])
      .setPipeline("Light2D");
    //.setScrollFactor(0.9, 1);

    this.layerNave = this.tilemap
      .createLayer("nave", [
        this.tilesetRemasterized2,
        this.tilesetRemasterizedEnfeites,
      ])
      .setPipeline("Light2D");
    //.setScrollFactor(0.9, 1);

    this.layerEnfeites = this.tilemap
      .createLayer("enfeites", [this.tilesetRemasterizedEnfeites])
      .setPipeline("Light2D");
    // .setScrollFactor(0.9, 1);

    this.layerConserto = this.tilemap
      .createLayer("conserto", [
        this.tilesetRemasterized2,
        this.tilesetRemasterizedEnfeites,
      ])
      .setPipeline("Light2D");
    //.setScrollFactor(0.9, 1);

    this.lights.enable().setAmbientColor(0xe0f7ff);

    //animações
    this.anims.create({
      key: "idlecostas",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 0,
        end: 1,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "idlefrente",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 4,
        end: 5,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "idleesquerda",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 2,
        end: 3,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "idledireita",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 6,
        end: 7,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "andarcostas",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 28,
        end: 35,
      }),
      frameRate: 11,
      repeat: -1,
    });

    this.anims.create({
      key: "andarfrente",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 44,
        end: 51,
      }),
      frameRate: 11,
      repeat: -1,
    });

    this.anims.create({
      key: "andaresquerda",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 36,
        end: 43,
      }),
      frameRate: 11,
      repeat: -1,
    });

    this.anims.create({
      key: "andardireita",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 52,
        end: 59,
      }),
      frameRate: 11,
      repeat: -1,
    });

    //animação inimigo
    this.anims.create({
      key: "enemyWalk",
      frames: this.anims.generateFrameNumbers("inimigo3", {
        start: 26,
        end: 33,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyWalkCima",
      frames: this.anims.generateFrameNumbers("inimigo3", {
        start: 18,
        end: 25,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyWalkBaixo",
      frames: this.anims.generateFrameNumbers("inimigo3", {
        start: 34,
        end: 41,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyAtaque",
      frames: this.anims.generateFrameNumbers("inimigo3", {
        start: 2,
        end: 5,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyAtaqueBaixo",
      frames: this.anims.generateFrameNumbers("inimigo3", {
        start: 7,
        end: 8,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyAtaqueCima",
      frames: this.anims.generateFrameNumbers("inimigo3", {
        start: 11,
        end: 12,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "vidascheias",
      frames: this.anims.generateFrameNumbers("vidasroxas", {
        start: 0,
        end: 0,
      }),
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: "duasvidas",
      frames: this.anims.generateFrameNumbers("vidasroxas", {
        start: 1,
        end: 1,
      }),
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: "umavida",
      frames: this.anims.generateFrameNumbers("vidasroxas", {
        start: 2,
        end: 2,
      }),
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: "zerovidas",
      frames: this.anims.generateFrameNumbers("vidasroxas", {
        start: 3,
        end: 3,
      }),
      frameRate: 1,
      repeat: -1,
    });

    //anim porta
    this.anims.create({
      key: "portaabrindo",
      frames: this.anims.generateFrameNumbers("porta", { start: 0, end: 7 }),
      frameRate: 7,
      repeat: 0,
    });

    this.anims.create({
      key: "portafechando",
      frames: this.anims.generateFrameNumbers("porta", { start: 7, end: 0 }),
      frameRate: 7,
      repeat: 0,
    });

    this.anims.create({
      key: "walk-leftJp",
      frames: this.anims.generateFrameNumbers("player", { start: 14, end: 20 }),
      frameRate: 11,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-rightJp",
      frames: this.anims.generateFrameNumbers("player", { start: 21, end: 27 }),
      frameRate: 11,
      repeat: -1,
    });

    this.anims.create({
      key: "idleRightJP",
      frames: this.anims.generateFrameNumbers("player", { start: 2, end: 3 }),
      frameRate: 3,
      repeat: -1,
    });

    this.anims.create({
      key: "idleLeftJP",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
      frameRate: 3,
      repeat: -1,
    });

    this.anims.create({
      key: "jumpJP",
      frames: this.anims.generateFrameNumbers("player", { start: 10, end: 13 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "jumpLJP",
      frames: this.anims.generateFrameNumbers("player", { start: 5, end: 8 }),
      frameRate: 6,
      repeat: -1,
    });

    this.vidasroxas = this.physics.add.sprite(250, 130, "vidasroxas");
    this.vidasroxas.setScrollFactor(0);
    this.vidasroxas.anims.play("vidascheias");
    this.vidasroxas.body.allowGravity = false;
    this.vidasroxas.setDepth(1);

    //adicionar porta
    this.porta = this.physics.add.sprite(638, 719, "porta", 0);
    //this.porta.setAngle(180);
    this.porta.body.allowGravity = false;

    //adicionar segunda porta
    this.porta2 = this.physics.add.sprite(55, 1573, "porta", 0);
    this.porta2.body.allowGravity = false;
    this.porta2.setAngle(90);
    this.porta2.setSize(32, 128);

    //faz um grupo para os bigbosses
    this.bigboss = this.physics.add.group({
      allowGravity: false,
      immovable: true,
      pipeline: "Light2D",
    });

    //adiciona o bigboss como sprite físico para colidir com o player
    //COMPUTADOR 1, SPRITES DA DIREITA PRA ESQUERDA
    this.bigboss.create(465, 275, "bigboss"); //bigboss 1
    /* this.bigboss.create(452, 260, "bigboss").setSize(40, 10);
      this.bigboss.create(385, 260, "bigboss").setSize(70, 20);
    this.bigboss.create(335, 267, "bigboss").setSize(25, 17);*/

    //COMPUTADOR 2(ABAIXO DO 1), SPRITES DA DIREITA PRA ESQUERDA
    //-62 +160
    this.bigboss.create(403, 435, "bigboss"); //bigboss 2
    /*this.bigboss.create(390, 420, "bigboss").setSize(40, 10);
    this.bigboss.create(323, 420, "bigboss").setSize(70, 20);
    this.bigboss.create(273, 427, "bigboss").setSize(25, 17);*/

    //COMPUTADOR 3(ABAIXO DO 2), SPRITES DA DIREITA PRA ESQUERDA
    //-33 -160
    this.bigboss.create(370, 595, "bigboss"); //bigboss 3
    /*this.bigboss.create(357, 580, "bigboss").setSize(40, 10);
    this.bigboss.create(290, 580, "bigboss").setSize(70, 20);
    this.bigboss.create(240, 587, "bigboss").setSize(25, 17);*/

    //COMPUTADOR 4 (DIREITA DO 3), SPRITES DA DIREITA PRA ESQUERDA
    //+690 X A PARTIR DO 3
    this.bigboss.create(1040, 598, "bigboss"); //bigboss 4, posição alterada
    /*this.bigboss.create(1047, 580, "bigboss").setSize(40, 10);
    this.bigboss.create(980, 580, "bigboss").setSize(70, 20);
    this.bigboss.create(930, 587, "bigboss").setSize(25, 17);*/

    //COMPUTADOR 5 (DIREITA DO 2), SPRITES DA DIREITA PRA ESQUERDA
    //+627 X A PARTIR DO 2
    this.bigboss.create(1008, 443, "bigboss"); //bigboss 5, posição alterada
    /*this.bigboss.create(1017, 420, "bigboss").setSize(40, 10);
    this.bigboss.create(950, 420, "bigboss").setSize(70, 20);
    this.bigboss.create(900, 427, "bigboss").setSize(25, 17);*/

    //COMPUTADOR 6 (DIREITA DO 1), SPRITES DA DIREITA PRA ESQUERDA
    //+500 X A PARTIR DO 1
    this.bigboss.create(950, 282, "bigboss"); //bigboss 6, posiçao alterada
    /*this.bigboss.create(952, 260, "bigboss").setSize(40, 10);
    this.bigboss.create(885, 260, "bigboss").setSize(70, 20);
    this.bigboss.create(835, 267, "bigboss").setSize(25, 17);
    
    //COMPUTADOR 7 (CENTRAL DE CIMA), SPRITES DA DIREITA PRA DIREITA
    this.bigboss.create(770, 203, "bigboss").setSize(30, 20);
    this.bigboss.create(650, 197, "bigboss").setSize(210, 17);
    this.bigboss.create(530,203, "bigboss").setSize(30, 20);
    
    //COMPUTADOR 8 (CENTRAL), SPRITES DA DIREITA PRA DIREITA
    //+160 ABAIXO DO 7
    this.bigboss.create(800, 363, "bigboss").setSize(30, 20);
    this.bigboss.create(650, 357, "bigboss").setSize(270, 17);
    this.bigboss.create(500, 363, "bigboss").setSize(30, 20);
    
    //COMPUTADOR 9 (CENTRAL DE BAIXO), SPRITES DA DIREITA PRA DIREITA
    //+352 Y ABAIXO DO 7 TBM
    this.bigboss.create(770, 555, "bigboss").setSize(30, 20);
    this.bigboss.create(650, 549, "bigboss").setSize(210, 17);
    this.bigboss.create(530, 555, "bigboss").setSize(30, 20);*/

    //console do meio
    this.consolelongo = this.physics.add.sprite(645, 350, "consolelongo");
    this.consolelongo.body.setSize(323, 25).setOffset(0, 27);
    this.consolelongo.body.allowGravity = false;
    this.consolelongo.setImmovable(true);

    this.consolemedio = this.physics.add.group({
      allowGravity: false,
      immovable: true,
      pipeline: "Light2D",
    });

    //console de cima centro
    this.consolemedio
      .create(640, 190, "consolemedio")
      .setSize(255, 25)
      .setOffset(0, 27);

    //console de baixo centro
    this.consolemedio
      .create(640, 540, "consolemedio")
      .setSize(255, 25)
      .setOffset(0, 27);

    //console_s da esquerda cima
    this.consoles = this.physics.add.sprite(382, 258, "consoles");
    this.consoles.body.setSize(102, 25).setOffset(0, 27);
    this.consoles.body.allowGravity = false;
    this.consoles.setImmovable(true);

    //console_w da esuqerda cima, com bigboss 1
    this.consolew = this.physics.add.sprite(446, 268, "consolew");
    this.consolew.body.setSize(47, 17).setOffset(15, 20);
    this.consolew.body.allowGravity = false;
    this.consolew.setImmovable(true);

    //console_s da esquerda meio
    this.consoles2 = this.physics.add.sprite(310, 418, "consoles");
    this.consoles2.body.setSize(102, 25).setOffset(0, 27);
    this.consoles2.body.allowGravity = false;
    this.consoles2.setImmovable(true);

    //console_w da esuqerda meio, com bigboss 2
    this.consolew2 = this.physics.add.sprite(385, 429, "consolew");
    this.consolew2.body.setSize(47, 17).setOffset(15, 20);
    this.consolew2.body.allowGravity = false;
    this.consolew2.setImmovable(true);

    //console_s da esquerda baixo
    this.consoles3 = this.physics.add.sprite(278, 580, "consoles");
    this.consoles3.body.setSize(102, 25).setOffset(0, 27);
    this.consoles3.body.allowGravity = false;
    this.consoles3.setImmovable(true);

    //console_w da esuqerda baixo, com bigboss 3
    this.consolew3 = this.physics.add.sprite(350, 587, "consolew");
    this.consolew3.body.setSize(47, 17).setOffset(15, 20);
    this.consolew3.body.allowGravity = false;
    this.consolew3.setImmovable(true);

    //console_s da direita cima
    this.consoles4 = this.physics.add.sprite(863, 261, "consoles");
    this.consoles4.body.setSize(102, 25).setOffset(0, 27);
    this.consoles4.body.allowGravity = false;
    this.consoles4.setImmovable(true);

    //console_w da direita cima, com bigboss 6
    this.consolew4 = this.physics.add.sprite(930, 273, "consolew");
    this.consolew4.body.setSize(47, 17).setOffset(15, 20);
    this.consolew4.body.allowGravity = false;
    this.consolew4.setImmovable(true);

    //console_s da direita meio
    this.consoles5 = this.physics.add.sprite(915, 423, "consoles");
    this.consoles5.body.setSize(102, 25).setOffset(0, 27);
    this.consoles5.body.allowGravity = false;
    this.consoles5.setImmovable(true);

    //console_w da direita meio, com bigboss 5
    this.consolew5 = this.physics.add.sprite(989, 434, "consolew");
    this.consolew5.body.setSize(47, 17).setOffset(15, 20);
    this.consolew5.body.allowGravity = false;
    this.consolew5.setImmovable(true);

    //console_s da direita baixo
    this.consoles6 = this.physics.add.sprite(950, 580, "consoles");
    this.consoles6.body.setSize(102, 25).setOffset(0, 27);
    this.consoles6.body.allowGravity = false;
    this.consoles6.setImmovable(true);

    //console_w da direita baixo, com bigboss 4
    this.consolew6 = this.physics.add.sprite(1022, 590, "consolew");
    this.consolew6.body.setSize(47, 17).setOffset(15, 20);
    this.consolew6.body.allowGravity = false;
    this.consolew6.setImmovable(true);

    //exterior da nave antenas
    this.antenas = this.physics.add.group({
      allowGravity: false,
      immovable: true,
      pipeline: "Light2D",
    });

    this.antenas
      .create(537, 1324, "NewPiskel")
      .setScale(-1, 1)
      .body.setSize(20, 30)
      .setOffset(27, 0);

    this.antenas
      .create(880, 1355, "NewPiskel")
      .setScale(-1, 1)
      .body.setSize(20, 30)
      .setOffset(27, 0);

    this.antenas
      .create(1170, 1327, "NewPiskel")
      .body.setSize(20, 30)
      .setOffset(10, 0);

    this.antenas
      .create(820, 1420, "NewPiskel")
      .setScale(-1, 1)
      .body.setSize(20, 30)
      .setOffset(27, 0);

    this.antenas
      .create(433, 1483, "NewPiskel")
      .body.setSize(20, 30)
      .setOffset(10, 0);

    this.antenas
      .create(880, 1514, "NewPiskel")
      .setScale(-1, 1)
      .body.setSize(20, 30)
      .setOffset(27, 0);

    this.antenas
      .create(175, 1546, "NewPiskel")
      .body.setSize(20, 30)
      .setOffset(10, 0);

    //telescopios exterior
    this.telescopios = this.physics.add.group({
      allowGravity: false,
      immovable: true,
      pipeline: "Light2D",
    });

    this.telescopios.create(207, 1363, "telescopio").body.setSize(20, 20);

    this.telescopios.create(338, 1587, "telescopio").body.setSize(20, 20);

    this.telescopios.create(1107, 1490, "telescopio").body.setSize(20, 20);

    //osciloscopios exterior
    this.osciloscopios = this.physics.add.group({
      allowGravity: false,
      immovable: true,
      pipeline: "Light2D",
    });

    this.osciloscopios.create(626, 1400, "osciloscopio").body.setSize(35, 17);

    this.osciloscopios.create(980, 1560, "osciloscopio").body.setSize(35, 17);

    this.limiteporta = this.physics.add.sprite(638, 750, "bigboss");
    this.limiteporta.body.allowGravity = false;
    this.limiteporta.setSize(128, 32);
    this.limiteporta.setImmovable(true);

    this.limitenorte = this.physics.add.sprite(670, 1270, "bigboss"); //662, 1347 667 1460
    this.limitenorte.body.allowGravity = false;
    this.limitenorte.setImmovable(true);
    this.limitenorte.setSize(1280, 17);

    this.limitesul = this.physics.add.sprite(670, 1735, "bigboss"); //662, 1347 667 1460
    this.limitesul.body.allowGravity = false;
    this.limitesul.setImmovable(true);
    this.limitesul.setSize(1280, 17);

    this.limiteoeste = this.physics.add.sprite(27, 1502, "bigboss"); //662, 1347 667 1460
    this.limiteoeste.body.allowGravity = false;
    this.limiteoeste.setImmovable(true);
    this.limiteoeste.setSize(17, 448);

    this.limiteleste = this.physics.add.sprite(1315, 1502, "bigboss"); //662, 1347 667 1460
    this.limiteleste.body.allowGravity = false;
    this.limiteleste.setImmovable(true);
    this.limiteleste.setSize(17, 448);

    this.limites = this.physics.add.sprite(670, 1347, "bigboss"); //662, 1347 667 1460
    this.limites.body.allowGravity = false;
    this.limites.setImmovable(true);
    this.limites.setSize(1280, 768);

    //adiciona o player roxo
    this.playerroxo = this.physics.add.sprite(640, 448, "playerroxo"); //640,448 interior //650, 1640 exterior //spawn
    this.playerroxo.body.setSize(25, 10).setOffset(19, 52);
    this.playerroxo.body.allowGravity = false;

    this.caixa = this.physics.add.sprite(
      this.playerroxo.x,
      this.playerroxo.y,
      "bigboss",
    );
    this.caixa.body.setSize(45, 55);
    this.caixa.body.allowGravity = false;
    //this.caixa.immovable = false;

    this.platforms = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.platform51 = this.platforms
      .create(115, 3420 - 1184, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platform52 = this.platforms
      .create(769, 3400 - 1184, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platform53 = this.platforms
      .create(841, 3375 - 1184, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platform54 = this.platforms
      .create(1230, 3375 - 1184, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platforms
      .create(220, 3365 - 1184, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D").body.allowGravity = false;

    this.platform12 = this.physics.add.sprite(361, 2233, "plataform");
    this.platform12
      .setImmovable(true)
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D").body.allowGravity = false;

    this.platform15 = this.physics.add.sprite(976, 2183, "plataform");
    this.platform15
      .setImmovable(true)
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D").body.allowGravity = false;

    this.player2 = this.add.sprite(113, 2340, "player");

    //colisoes
    this.physics.add.collider(this.playerroxo, this.layerPiso);
    this.physics.add.collider(this.playerroxo, this.layerParede);
    this.physics.add.collider(this.playerroxo, this.consolelongo);
    this.physics.add.collider(this.playerroxo, this.consolemedio, () => {
      this.doorOpen = 4;
      try {
        this.game.socket.emit("scene1", this.game.room, {
          doorOpen:
            /*{
            key: this.doorOpen,
          },*/ this.doorOpen,
        });
      } catch (e) {
        console.error("Error updating player:", e);
      }
    });
    this.physics.add.collider(this.playerroxo, this.consoles);
    this.physics.add.collider(this.playerroxo, this.consoles2);
    this.physics.add.collider(this.playerroxo, this.consoles3);
    this.physics.add.collider(this.playerroxo, this.consoles4);
    this.physics.add.collider(this.playerroxo, this.consoles5, () => {
      this.doorOpen = 1;
      try {
        this.game.socket.emit("scene1", this.game.room, {
          doorOpen:
            /*{
            key: this.doorOpen,
          },*/ this.doorOpen,
        });
      } catch (e) {
        console.error("Error updating player:", e);
      }
    });
    this.physics.add.collider(this.playerroxo, this.consoles6, () => {
      this.doorOpen = 3;
      try {
        this.game.socket.emit("scene1", this.game.room, {
          doorOpen:
            /*{
            key: this.doorOpen,
          },*/ this.doorOpen,
        });
      } catch (e) {
        console.error("Error updating player:", e);
      }
    });
    this.physics.add.collider(this.playerroxo, this.consolew);
    this.physics.add.collider(this.playerroxo, this.consolew2);
    this.physics.add.collider(this.playerroxo, this.consolew3);
    this.physics.add.collider(this.playerroxo, this.consolew4, () => {
      this.doorOpen = 2;
      try {
        this.game.socket.emit("scene1", this.game.room, {
          doorOpen:
            /*{
            key: this.doorOpen,
          },*/ this.doorOpen,
        });
      } catch (e) {
        console.error("Error updating player:", e);
      }
    });
    this.physics.add.collider(this.playerroxo, this.consolew5);
    this.physics.add.collider(this.playerroxo, this.consolew6);
    this.physics.add.collider(this.playerroxo, this.bigboss);
    this.physics.add.collider(this.playerroxo, this.antenas);
    this.physics.add.collider(this.playerroxo, this.telescopios);
    this.physics.add.collider(this.playerroxo, this.osciloscopios);
    this.physics.add.collider(this.playerroxo, this.limiteporta);
    this.physics.add.overlap(
      this.playerroxo,
      this.porta,
      this.teletransporte,
      null,
      this,
    );
    this.physics.add.overlap(
      this.playerroxo,
      this.porta2,
      this.teletransporte2,
      null,
      this,
    );

    /*this.physics.add.overlap(this.playerroxo, this.porta, () => {
      this.doorOpen += 1;
    });*/

    if (this.estoutrabalhando === false) {
      this.physics.add.collider(this.playerroxo, this.limitenorte);
      this.physics.add.collider(this.playerroxo, this.limitesul);
      this.physics.add.collider(this.playerroxo, this.limiteoeste);
      this.physics.add.collider(this.playerroxo, this.limiteleste);
    }

    this.inimigosaliens = this.physics.add.group({
      allowGravity: false,
      immovable: false,
      pipeline: "Light2D",
    });

    var spawninimigosx = Phaser.Math.Between(87, 1260);
    var spawninimigosy = Phaser.Math.Between(1200, 1400);

    for (let i = 0; i < 3; i++) {
      spawninimigosx = Phaser.Math.Between(87, 1260);
      spawninimigosy = Phaser.Math.Between(1300, 1400);
      const enemy = this.inimigosaliens.create(
        spawninimigosx,
        spawninimigosy,
        "inimigo3",
      );
      enemy.body.setSize(30, 37);
      enemy.lastDirection = "horizontal";
      enemy.lastFlipX = false;
      enemy.isAttacking = false;
    }

    this.physics.add.collider(this.inimigosaliens, this.limitenorte);
    this.physics.add.collider(this.inimigosaliens, this.limitesul);
    this.physics.add.collider(this.inimigosaliens, this.limiteoeste);
    this.physics.add.collider(this.inimigosaliens, this.limiteleste);
    this.colliderAliensBox = this.physics.add.collider(
      this.caixa,
      this.inimigosaliens,
      this.perdervida,
      null,
      this,
    ); //this.enemyAttack, null, this);

    this.layerParede.setCollisionByProperty({ collides: true });

    //camera
    this.cameras.main.startFollow(this.playerroxo, true, 0.1, 0.1);

    if (this.estoutrabalhando === false) {
      this.cameras.main.startFollow(this.playerroxo, true, 0.1, 0.1).zoom = 1.5;
    }

    // Texto de posição do playerroxo atualizado a cada segundo
    this.positionText = this.add
      .text(200, 80, "X: 0 Y: 0", {
        fontSize: "18px",
        fill: "#ffffff",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: { x: 6, y: 4 },
      })
      .setScrollFactor(0);

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.positionText.setText(
          `X: ${Math.round(this.playerroxo.x)} Y: ${Math.round(this.playerroxo.y)}`,
        );
      },
    });

    this.game.socket.on("scene0", (state) => {
      if (state.fase4) {
        this.fase4 = state.fase4.key;
      }
      if (state.player) {
        this.player2.setPosition(state.player.x, state.player.y - 1184);
        //   this.player2.sprite.anims.play(state.player.animation, true);
      }

      if (state.player.animation) {
        this.player2.anims.play(state.player.animation, true);
      }

      this.platform12.setPosition(
        state.platform12.x,
        state.platform12.y - 1184,
      );
      this.platform15.setPosition(
        state.platform15.x,
        state.platform15.y - 1184,
      );
    });
  } //fim create

  update() {
    if (this.fase4) {
      try {
        this.game.socket.emit("scene1", this.game.room, {
          playerroxo: {
            x: this.playerroxo.x,
            y: this.playerroxo.y,
            //animation: this.playerroxo.anims.currentAnim ? this.playerroxo.anims.currentAnim.key : null,
          },
        });
      } catch (e) {
        console.error("Error updating player:", e);
      }
    }

    const cursores = this.input.keyboard.createCursorKeys();
    const qe = this.input.keyboard.addKeys("E, Q");

    //const cursores = this.input.keyboard.createCursorKeys();
    const jkl = this.input.keyboard.addKeys("J,K,L");

    try {
      this.game.socket.emit("scene1", this.game.room, {
        jkl: {
          J: jkl.J.isDown,
          L: jkl.L.isDown,
          K: jkl.K.isDown,
        },
      });
    } catch (e) {
      console.error("Error updating player:", e);
    }

    this.caixa.setPosition(this.playerroxo.x, this.playerroxo.y);

    // Captura entrada do teclado
    //const cursors = this.input.keyboard.createCursorKeys();
    const wasd = this.input.keyboard.addKeys("W,S,A,D");

    // Captura entrada do gamepad
    const pad =
      this.input.gamepad && this.input.gamepad.total > 0
        ? this.input.gamepad.getPad(0)
        : null;

    let horizontal = 0;
    let vertical = 0;

    // Teclado WASD
    if (wasd.A.isDown) {
      horizontal = -1;
    } else if (wasd.D.isDown) {
      horizontal = 1;
    }

    if (wasd.W.isDown) {
      vertical = -1;
    } else if (wasd.S.isDown) {
      vertical = 1;
    }

    // Gamepad (usando eixos como em scene0, mas adaptado para ortogonal)
    if (pad) {
      if (pad.axes.length > 0) {
        horizontal = pad.axes[0].getValue();
      }
      if (pad.axes.length > 1) {
        vertical = pad.axes[1].getValue();
      }
    }

    // Aplica velocidade
    this.playerroxo.setVelocityX(horizontal * this.speed);
    this.playerroxo.setVelocityY(vertical * this.speed);

    // Verifica overlap com limites e ajusta as bounds da câmera
    const isOverlapLimites = this.physics.overlap(
      this.playerroxo,
      this.limites,
    );

    if (qe.E.isDown) {
      this.cameras.main.setBounds(10, 0, this.tilemap.widthInPixels);
      this.cameras.main.startFollow(this.player2, false, 1, 0).zoom = 1.2;

      this.cameras.main.scrollY = 2348 - this.cameras.main.height / 2 - 120;
    } else if (qe.Q.isDown) {
      this.cameras.main.startFollow(this.playerroxo, true, 0.1, 0.1);

      if (this.estoutrabalhando === false) {
        if (isOverlapLimites) {
          // Define as bounds da câmera baseado no sprite limites
          const limitesLeft = 40;
          const limitesTop = 950;
          const limitesRight = 1302;
          const limitesBottom = 1720;
          this.cameras.main.setBounds(
            limitesLeft,
            limitesTop,
            limitesRight - limitesLeft,
            limitesBottom - limitesTop,
          );
        } else if (!isOverlapLimites) {
          // Se não estiver mais sobre os limites, redefine as bounds para o tamanho total do mapa
          this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, 735); //this.tilemap.heightInPixels);
        }
      }
    }

    if (this.estoutrabalhando === false) {
      if (isOverlapLimites) {
        // Define as bounds da câmera baseado no sprite limites
        const limitesLeft = 40;
        const limitesTop = 950;
        const limitesRight = 1302;
        const limitesBottom = 1720;
        this.cameras.main.setBounds(
          limitesLeft,
          limitesTop,
          limitesRight - limitesLeft,
          limitesBottom - limitesTop,
        );
      } else if (!isOverlapLimites) {
        // Se não estiver mais sobre os limites, redefine as bounds para o tamanho total do mapa
        this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, 735); //this.tilemap.heightInPixels);
      }
    }

    // Animações e som baseado no movimento
    const moving = Math.abs(horizontal) > 0.1 || Math.abs(vertical) > 0.1;

    if (moving) {
      if (!this.passos.isPlaying) this.passos.play();
    } else {
      if (this.passos.isPlaying) this.passos.stop();
    }

    if (horizontal > 0.1) {
      this.playerroxo.anims.play("andardireita", true);
    } else if (horizontal < -0.1) {
      this.playerroxo.anims.play("andaresquerda", true);
    } else if (vertical > 0.1) {
      this.playerroxo.anims.play("andarfrente", true); // assumindo que "andarfrente" é para baixo
    } else if (vertical < -0.1) {
      this.playerroxo.anims.play("andarcostas", true);
    } else {
      // Idle baseado na última direção
      if (this.playerroxo.anims.currentAnim) {
        const currentKey = this.playerroxo.anims.currentAnim.key;
        if (currentKey === "andardireita") {
          this.playerroxo.anims.play("idledireita", true);
        } else if (currentKey === "andaresquerda") {
          this.playerroxo.anims.play("idleesquerda", true);
        } else if (currentKey === "andarfrente") {
          this.playerroxo.anims.play("idlefrente", true);
        } else if (currentKey === "andarcostas") {
          this.playerroxo.anims.play("idlecostas", true);
        }
      }
    }

    // Movimento dos inimigos aliens
    if (this.inimigosaliens) {
      this.inimigosaliens.children.each((enemy) => {
        const dx = this.playerroxo.x - enemy.x;
        const dy = this.playerroxo.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isTouchingCaixa = this.physics.overlap(enemy, this.caixa);

        if (distance > 0) {
          enemy.setVelocityX((dx / distance) * 80);
          enemy.setVelocityY((dy / distance) * 80);
        } else {
          enemy.setVelocity(0, 0);
        }

        if (Math.abs(dx) > Math.abs(dy)) {
          enemy.lastDirection = "horizontal";
          enemy.lastFlipX = dx > 0;
        } else if (dy < 0) {
          enemy.lastDirection = "up";
        } else {
          enemy.lastDirection = "down";
        }

        if (isTouchingCaixa) {
          enemy.isAttacking = true;
        } else {
          enemy.isAttacking = false;
        }

        if (enemy.isAttacking) {
          if (enemy.lastDirection === "horizontal") {
            enemy.anims.play("enemyAtaque", true);
            enemy.setFlipX(enemy.lastFlipX);
            enemy.setVelocity(0, 0);
          } else if (enemy.lastDirection === "up") {
            enemy.anims.play("enemyAtaqueCima", true);
            enemy.setFlipX(false);
            enemy.setVelocity(0, 0);
          } else {
            enemy.anims.play("enemyAtaqueBaixo", true);
            enemy.setFlipX(false);
            enemy.setVelocity(0, 0);
          }
        } else if (distance > 0) {
          if (Math.abs(dx) > Math.abs(dy)) {
            enemy.anims.play("enemyWalk", true);
            enemy.setFlipX(dx > 0);
          } else if (dy < 0) {
            enemy.anims.play("enemyWalkCima", true);
            enemy.setFlipX(false);
          } else {
            enemy.anims.play("enemyWalkBaixo", true);
            enemy.setFlipX(false);
          }
        } else {
          enemy.anims.stop();
        }
      });
    }
  } // fim update

  perdervida(caixa, alien) {
    // Verifica se já está em cooldown de invencibilidade
    if (this.invulnerable) {
      return;
    }

    // Ativa invencibilidade e desativa colisão por 1 segundo
    this.invulnerable = true;
    this.colliderAliensBox.active = false;
    this.vida = this.vida - 1;

    // Efeito de piscada do playerroxo (300ms visível/invisível, 1000ms total)
    //this.playerroxo.setVisible(false);
    this.time.delayedCall(100, () => this.playerroxo.setVisible(true));
    this.time.delayedCall(200, () => this.playerroxo.setVisible(false));
    this.time.delayedCall(300, () => this.playerroxo.setVisible(true));
    this.time.delayedCall(400, () => this.playerroxo.setVisible(true));
    this.time.delayedCall(500, () => this.playerroxo.setVisible(false));
    this.time.delayedCall(600, () => this.playerroxo.setVisible(true));
    this.time.delayedCall(700, () => this.playerroxo.setVisible(false));
    this.time.delayedCall(800, () => this.playerroxo.setVisible(true));
    this.time.delayedCall(900, () => this.playerroxo.setVisible(false));
    this.time.delayedCall(1000, () => this.playerroxo.setVisible(true));

    this.time.delayedCall(100, () => this.vidasroxas.setVisible(true));
    this.time.delayedCall(200, () => this.vidasroxas.setVisible(false));
    this.time.delayedCall(300, () => this.vidasroxas.setVisible(true));
    this.time.delayedCall(400, () => this.vidasroxas.setVisible(true));
    this.time.delayedCall(500, () => this.vidasroxas.setVisible(false));
    this.time.delayedCall(600, () => this.vidasroxas.setVisible(true));
    this.time.delayedCall(700, () => this.vidasroxas.setVisible(false));
    this.time.delayedCall(800, () => this.vidasroxas.setVisible(true));
    this.time.delayedCall(900, () => this.vidasroxas.setVisible(false));
    this.time.delayedCall(1000, () => this.vidasroxas.setVisible(true));

    // Atualiza animação das vidas
    if (this.vida === 3) {
      this.vidasroxas.anims.play("vidascheias");
    } else if (this.vida === 2) {
      this.vidasroxas.anims.play("duasvidas");
      //this.playerroxo.setPosition(111, 1573);
    } else if (this.vida === 1) {
      this.vidasroxas.anims.play("umavida");
      //this.playerroxo.setPosition(111, 1573);
    } else if (this.vida === 0) {
      this.vidasroxas.anims.play("zerovidas");
      this.inimigosaliens.setVelocity(0, 0);
      this.time.delayedCall(1000, () => {
        this.scene.start("gameover1");
      });
      return; // Não precisa reativar colisão se morreu
    }

    // Reativa colisão e invencibilidade após 1 segundo
    this.time.delayedCall(1000, () => {
      this.invulnerable = false;
      this.colliderAliensBox.active = true;
    });
  }

  teletransporte() {
    if (this.fase4) {
      this.porta.anims.play("portaabrindo", true);
      this.time.delayedCall(1000, () => {
        this.playerroxo.setPosition(111, 1573); //teletransporte para o exterior da nave
        this.porta.anims.play("portafechando", true);
      });
    }
  }

  teletransporte2() {
    this.porta2.anims.play("portaabrindo", true);
    this.time.delayedCall(1000, () => {
      this.playerroxo.setPosition(640, 651); //teletransporte para o interior da nave
      this.porta2.anims.play("portafechando", true);
      this.fase4 = false;
    });
  }

  webrtcMakeCall() {
    this.game.localConnection = new RTCPeerConnection(this.game.iceServers);

    this.game.localConnection.onicecandidate = ({ candidate }) => {
      this.game.socket.emit("candidate", this.game.room, candidate);
    };

    this.game.localConnection.ontrack = ({ streams: [stream] }) => {
      this.game.audio.srcObject = stream;
    };

    if (this.game.media) {
      this.game.media
        .getTracks()
        .forEach((track) =>
          this.game.localConnection.addTrack(track, this.game.media),
        );
    }

    this.game.localConnection
      .createOffer()
      .then((offer) => this.game.localConnection.setLocalDescription(offer))
      .then(() =>
        this.game.socket.emit(
          "offer",
          this.game.room,
          this.game.localConnection.localDescription,
        ),
      );

    this.game.socket.on("answer", (description) => {
      this.game.localConnection.setRemoteDescription(description);
    });

    this.game.socket.on("candidate", (candidate) => {
      this.game.localConnection.addIceCandidate(candidate);
    });
  }
} //fim

export default scene1;
