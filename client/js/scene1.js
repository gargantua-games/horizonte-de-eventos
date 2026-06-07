class scene1 extends Phaser.Scene {
  constructor() {
    super("scene1");

    this.speed = 200;
    this.estoutrabalhando = false;
    this.doorOpen = 0;
    this.fase4 = true;
    this.fase5 = false;
    this.vida = 300;
    this.invulnerable = false;
    this.positionP2 = false;
    this.puzzleAberto = false;
    this.listaMinigames = ["genius", "helldivers", "quebraCabeca", "termo", "sudoku"];
    this.portaOverlapTime = 0;
    this.porta2OverlapTime = 0;
    this.portalTeleported = false;
    this.portal2Teleported = false;
    this.bulletP1 = true;
    this.shoot = false;
    this.angleCannon = 0;
    this.inimigosalienscount = 0;
    this.outShip = false;
    this.comunicationP2 = true;
    this.enemySpawnBlocked = false;
    this.antenasconsertadas = 0;
    this.collectIa = false;
    this.gameOver = false;
    //fase1: genius; fase2: helldivers; fase3: quebra cabeça; fase4: genius/helldivers; fase5: termo;
  }

  init() {
    this.webrtcMakeCall();
  }

    GameOver() {
    if (this.gameOver) {
      
      return;
    }
    
    console.log("antenas" + this.antenasconsertadas);
    //console.log("game Over:" + this.gameOver);

    if (this.vida > 0) {
      //console.log("life" + this.vida);
      return;
    }

    this.gameOver = true;
    this.game.socket.emit("GameOver", this.game.room, {
      gameOver: this.gameOver,
    });

    this.scene.stop("scene1");
    this.scene.start("gameover1");

  }

  create() {
    //adiciona trilha sonora e efeitos sonoros
    this.trilhasonora = this.sound
      .add("trilhasonora", { loop: true, volume: 0.2 })
      .play();
    this.passos = this.sound.add("passos", { loop: true, volume: 1 });
    this.respiracao = this.sound.add("respiracao", { loop: true, volume: 1 });

    //adiciona o espaço ao fundo
    this.space = this.add.image("space1");
    this.space.setOrigin(0, 0); //.setScrollFactor(0.1, 1);

    //adiciona o tilemap da sala ortogonal
    this.tilemap = this.make.tilemap({ key: "faseortogonal" });

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
      key: "playerIcon",
      frames: this.anims.generateFrameNumbers("playersIcon", {
        start: 2,
        end: 3,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "playerIconVerde",
      frames: this.anims.generateFrameNumbers("playersIcon", {
        start: 4,
        end: 5,
      }),
      frameRate: 2,
      repeat: -1,
    });


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

    this.anims.create({
      key: "idleesquerdaverde",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 60,
        end: 61,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "idlefrenteverde",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 62,
        end: 63,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "idledireitaverde",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 64,
        end: 65,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "andaresquerdaverde",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 66,
        end: 73,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "andarfrenteverde",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 74,
        end: 81,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "andardireitaverde",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 82,
        end: 89,
      }),
      frameRate: 2,
      repeat: -1,
    });

    //animação inimigo
    this.anims.create({
      key: "enemyWalk",
      frames: this.anims.generateFrameNumbers("inimigo", {
        start: 26,
        end: 33,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyWalkCima",
      frames: this.anims.generateFrameNumbers("inimigo", {
        start: 18,
        end: 25,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyWalkBaixo",
      frames: this.anims.generateFrameNumbers("inimigo", {
        start: 34,
        end: 41,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyAtaque",
      frames: this.anims.generateFrameNumbers("inimigo", {
        start: 2,
        end: 5,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyAtaqueBaixo",
      frames: this.anims.generateFrameNumbers("inimigo", {
        start: 7,
        end: 8,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyAtaqueCima",
      frames: this.anims.generateFrameNumbers("inimigo", {
        start: 11,
        end: 12,
      }),
      frameRate: 12,
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

    this.anims.create({
      key: "faiscando",
      frames: this.anims.generateFrameNumbers("faisca", {
        start: 0,
        end: 8,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "avisopiscando",
      frames: this.anims.generateFrameNumbers("avisoconsole", {
        start: 0,
        end: 1,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.createSemicircleLifeBar();


    //adicionar porta
    this.porta = this.physics.add.sprite(638, 719, "porta", 0);
    //this.porta.setAngle(180);
    this.porta.body.allowGravity = false;

    //adicionar segunda porta
    this.porta2 = this.physics.add.sprite(55, 1573, "porta", 0);
    this.porta2.body.allowGravity = false;
    this.porta2.setAngle(90);
    this.porta2.setSize(32, 128);

    this.avisoconsole = this.physics.add.sprite(913, 388, "avisoconsole");
    this.avisoconsole.body.allowGravity = false;
    this.avisoconsole.setVisible(false);

    this.delayedCall = this.time.delayedCall(14000, () => {
      this.avisoconsole.setVisible(true);
      this.avisoconsole.anims.play("avisopiscando");
    });

    this.laserP1 = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

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

    this.cannon = this.add.sprite(656, 1712, "cannon");
    this.cannon.setPipeline("Light2D");

    this.turretP1 = this.add.sprite(656, 1713, "turret");
    this.turretP1.setPipeline("Light2D");

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
      .create(880, 1514, "NewPiskel")
      .setScale(-1, 1)
      .body.setSize(20, 30)
      .setOffset(27, 0);

    //telescopios exterior
    this.telescopios = this.physics.add.group({
      allowGravity: false,
      immovable: true,
      pipeline: "Light2D",
    });

    this.telescopios.create(207, 1363, "telescopio").body.setSize(20, 20);

    this.telescopios.create(338, 1587, "telescopio").body.setSize(20, 20);

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

    this.limitenorte = this.physics.add.sprite(670, 1317, "bigboss"); //662, 1347 667 1460
    this.limitenorte.body.allowGravity = false;
    this.limitenorte.setImmovable(true);
    this.limitenorte.setSize(1280, 17);

    /*this.limitesul = this.physics.add.sprite(670, 1735, "bigboss"); //662, 1347 667 1460
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
    this.limites.setSize(1280, 768);*/

    //faisca na antena
    this.faisca1 = this.physics.add.sprite(175, 1546, "faisca");
    this.faisca1.anims.play("faiscando");
    this.faisca1.body.allowGravity = false;
    this.faisca1.setScale(2);

    this.antena1 = this.physics.add.sprite(175, 1546, "NewPiskel");
    this.antena1.body.allowGravity = false;
    this.antena1.body.setSize(20, 30);
    this.antena1.setOffset(27, 0);
    this.antena1.setScale(-1, 1);
    this.antena1.setImmovable(true);

    //faísca na segunda antena
    this.faisca2 = this.physics.add.sprite(820, 1420, "faisca");
    this.faisca2.anims.play("faiscando");
    this.faisca2.body.allowGravity = false;
    this.faisca2.setScale(2);

    this.antena2 = this.physics.add.sprite(820, 1420, "NewPiskel");
    this.antena2.body.allowGravity = false;
    this.antena2.body.setSize(20, 30);
    this.antena2.setOffset(10, 0);
    this.antena2.setImmovable(true);

    //faisca no telescopio
    this.faisca3 = this.physics.add.sprite(1107, 1490, "faisca");
    this.faisca3.anims.play("faiscando")
      .setScale(2)
      .setVisible(false)
    .body.allowGravity = false;

    this.telescopio3 = this.physics.add.sprite(1107, 1490, "telescopio");
    this.telescopio3.body.allowGravity = false;
    this.telescopio3.body.setSize(20, 20);
    this.telescopio3.setImmovable(true);

    this.faisca4 = this.physics.add.sprite(433, 1468, "faisca");
    this.faisca4.anims.play("faiscando");
    this.faisca4.body.allowGravity = false;
    this.faisca4.setScale(2);

    this.antena4 = this.physics.add.sprite(433, 1468, "NewPiskel");
    this.antena4.body.allowGravity = false;
    this.antena4.body.setSize(20, 30);
    this.antena4.setOffset(10, 0);
    this.antena4.setImmovable(true);

    //adiciona o player roxo
    this.playerroxo = this.physics.add.sprite(640, 448, "playerroxo"); //640,448 interior //650, 1640 exterior //spawn
    this.playerroxo.anims.play("idlecostas", true).body.setSize(25, 10).setOffset(19, 47)
    .allowGravity = false;

    this.caixa = this.physics.add.sprite(
      this.playerroxo.x,
      this.playerroxo.y,
      "bigboss",
    );
    this.caixa.body.setSize(36, 55);
    this.caixa.body.allowGravity = false;
    this.caixa.body.immovable = true;

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
      if (this.doorOpen === 4) {
        if (this.playerroxo.y > 530) {
          if (!this.puzzleAberto) {
            this.puzzleAberto = true;
            this.scene.launch("termo", { portaId: 5, cenaOrigem: "scene1" });
          }
        }
      }
    });
    /*this.doorOpen = 4;
      try {
        this.game.socket.emit("scene1", this.game.room, {
          doorOpen: {
            key: this.doorOpen,
          },
        });
      } catch (e) {
        console.error("Error updating player:", e);
      }
    });*/
    this.physics.add.collider(this.playerroxo, this.consoles);

    this.physics.add.collider(this.playerroxo, this.consoles2);
    this.physics.add.collider(this.playerroxo, this.consoles3);
    this.physics.add.collider(this.playerroxo, this.consoles4, () => {
      if (this.doorOpen === 1) {
        if (this.playerroxo.y > 246) {
          if (!this.puzzleAberto) {
            this.puzzleAberto = true;
            this.scene.launch("helldivers", {
              portaId: 2,
              cenaOrigem: "scene1",
            });
          }
        }
      }
    });

    this.physics.add.collider(this.playerroxo, this.consoles5, () => {
      if (this.doorOpen === 0) {
        if (this.playerroxo.y > 415) {
          if (!this.puzzleAberto) {
            this.puzzleAberto = true;
            this.scene.launch("helldivers", {
              portaId: 1,
              cenaOrigem: "scene1",
            });
          }
        }
      }
    });
    this.physics.add.collider(this.playerroxo, this.consoles6, () => {
      if (this.doorOpen === 2) {
        if (this.playerroxo.y > 566) {
          if (!this.puzzleAberto) {
            this.puzzleAberto = true;
            this.scene.launch("termo", {
              portaId: 3,
              cenaOrigem: "scene1",
            });
          }
        }
        // this.fase4 = true;
      }
    });

    this.physics.add.collider(this.playerroxo, this.consolew);
    this.physics.add.collider(this.playerroxo, this.consolew2);
    this.physics.add.collider(this.playerroxo, this.consolew3);
    this.physics.add.collider(this.playerroxo, this.consolew4);
    this.physics.add.collider(this.playerroxo, this.consolew5);
    this.physics.add.collider(this.playerroxo, this.consolew6);
    this.physics.add.collider(this.playerroxo, this.bigboss);
    this.physics.add.collider(this.playerroxo, this.antenas);
    this.physics.add.collider(this.playerroxo, this.telescopios);
    this.physics.add.collider(this.playerroxo, this.osciloscopios);
    this.physics.add.collider(this.playerroxo, this.limiteporta);
    this.physics.add.collider(this.playerroxo, this.antena1, () => {
      if (!this.puzzleAberto && this.faisca1.visible) {
        this.puzzleAberto = true;
        this.scene.launch("helldivers", {
          onComplete: () => {
            if (this.faisca1) {
              this.faisca1.setVisible(false);
            }
            this.puzzleAberto = false;
            this.antenasconsertadas += 1;
            this.liberarIa();
          },
        });
      }
    });

    this.physics.add.collider(this.playerroxo, this.telescopio3, () => {
      if (!this.puzzleAberto && this.faisca3.visible) {
        this.puzzleAberto = true;
        this.scene.launch("genius", {
          onComplete: () => {
            if (this.faisca3) {
              this.faisca3.setVisible(false);
            }
            this.puzzleAberto = false;
          },
        });
      }
    });

    this.physics.add.collider(this.playerroxo, this.antena2, () => {
      if (!this.puzzleAberto && this.faisca2.visible) {
        this.puzzleAberto = true;
        this.scene.launch("helldivers", {
          onComplete: () => {
            if (this.faisca2) {
              this.faisca2.setVisible(false);
            }
            this.puzzleAberto = false;
            this.antenasconsertadas += 1;
            this.liberarIa();
          },
        });
      }
    });

    this.physics.add.collider(this.playerroxo, this.antena4, () => {
      if (!this.puzzleAberto && this.faisca4.visible) {
        this.puzzleAberto = true;
        this.scene.launch("genius", {
          onComplete: () => {
            if (this.faisca4) {
              this.faisca4.setVisible(false);
            }
            this.puzzleAberto = false;
            this.antenasconsertadas += 1;
            this.liberarIa();
          },
        });
      }
    });

    const destroyLaser = (laser, limit) => {
      if (laser && laser.disableBody) {
        laser.disableBody(true, true);
      } else if (laser && laser.destroy) {
        laser.destroy();
      }
    };

    this.physics.add.collider(
      this.laserP1,
      this.limiteporta,
      destroyLaser,
      null,
      this,
    );
    this.physics.add.collider(
      this.laserP1,
      this.limitenorte,
      destroyLaser,
      null,
      this,
    );
    this.physics.add.collider(
      this.laserP1,
      this.limitesul,
      destroyLaser,
      null,
      this,
    );
    this.physics.add.collider(
      this.laserP1,
      this.limiteoeste,
      destroyLaser,
      null,
      this,
    );
    this.physics.add.collider(
      this.laserP1,
      this.limiteleste,
      destroyLaser,
      null,
      this,
    );
    this.physics.add.collider(
      this.laserP1,
      this.limites,
      destroyLaser,
      null,
      this,
    );

    this.physics.add.overlap(this.playerroxo, this.porta, null, null, this);
    this.physics.add.overlap(this.playerroxo, this.porta2, null, null, this);

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

    this.physics.add.collider(this.inimigosaliens, this.limitenorte);
    this.physics.add.collider(this.inimigosaliens, this.limitesul);
    this.physics.add.collider(this.inimigosaliens, this.limiteoeste);
    this.physics.add.collider(this.inimigosaliens, this.limiteleste);
    this.physics.add.collider(this.inimigosaliens, this.inimigosaliens);
    this.colliderAliensBox = this.physics.add.collider(
      this.caixa,
      this.inimigosaliens,
      this.perdervida,
      null,
      this,
    ); //this.enemyAttack, null, this);

    this.layerParede.setCollisionByProperty({ collides: true });

    this.physics.add.overlap(
      this.inimigosaliens,
      this.laserP1,
      this.killEnemy,
      null,
      this,
    );

    //camera

    if (this.estoutrabalhando === false) {
      this.cameras.main.startFollow(this.playerroxo, true, 0.1, 0.1).zoom = 1.5;
    } else if (this.estoutrabalhando) {
      this.cameras.main.startFollow(this.playerroxo, true, 0.1, 0.1);
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

    this.iaBox = this.physics.add.sprite(400, 80, "iaBox");
    this.iaBox
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(1.5)
      .setPipeline("Light2D").body.allowGravity = false;

    const textoInicial =
      "Sua função é ajudar o seu colega,\nabrindo as portas para que ele possa passar.\nAparecerá um sinal sobre o computador\ncujos desafios você deve resolver";

    this.textoexplicativo = this.add
      .text(460, 80, "", {
        fontSize: "15px",
        fill: "#92f7a0",
        //backgroundColor: "rgba(0,0,0,0.7)",
        padding: { x: 6, y: 4 },
        fontFamily: "sarpanchextrabold",
      })
      .setScrollFactor(0)
      .setOrigin(0, 0);

    //desce a iaBox e depois escreve o texto explicativo
    this.tweens.add({
      targets: this.iaBox,
      y: 80,
      duration: 1200,
      ease: "Power1",
      onComplete: () => {
        this.typeTextoExplicativo(textoInicial, 50, () => {
          this.time.delayedCall(5000, () => {
            if (this.textoexplicativo) {
              this.textoexplicativo.destroy();
            }
            if (this.iaBox) {
              this.iaBox.destroy();
            }
          });
        });
      },
    });

    this.time.addEvent({
      delay: 2000, // Tempo em milissegundos (2000ms = 2 segundos)
      callback: this.spawnAlienAleatorio, // Nome da função que vai rodar (SEM parênteses no final)
      callbackScope: this, // Mantém o escopo da cena correto
      loop: true, // Faz o relógio repetir para sempre
    });

    const pIconX = 200;
    const pIconY = 96;
    const pIconSize = 64;

    this.playerIcon = this.add.sprite(pIconX, pIconY, "playersIcon")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(9)
      .anims.play("playerIcon", true)
      .setScale(1.5);
      // 1. Adiciona a imagem na tela (posição x: 400, y: 300)
    let imagem = this.playerIcon;
    
      
      // 2. Cria um objeto gráfico que servirá de molde (o círculo)
    let molde = this.make.graphics();
        
   // molde.setOrigin(0, 0);
      molde.setScrollFactor(0)
      molde.setDepth(9);
      
      // Define a cor de preenchimento (a cor não importa, pois ficará invisível)
       molde.fillStyle(0xffffff); 
      
      // Desenha o círculo na mesma posição da imagem (x: 400, y: 300) e define o raio (ex: 100 pixels)
      // Dica: O raio idealmente deve ser a metade da largura/altura da sua imagem
        molde.fillCircle(pIconX + 21, pIconY + 14, 32)//.setOrigin(0, 0).setScrollFactor(0); 

        // 3. Cria a máscara geométrica a partir do círculo
        let mascara = molde.createGeometryMask();

        // 4. Aplica a máscara na imagem
        imagem.setMask(mascara);

       this.lifeBarBgGraphics = this.make
        .graphics({
          x: 223,
          y: 113,
          add: true,
        })
        .setScrollFactor(0)
        .setDepth(8);
    
        this.lifeBarBgGraphics.fillStyle(0x000000, 1);
        this.lifeBarBgGraphics.fillCircle(0, 0, 36);
    
       // this.uI = this.add.container(0, 0);

    this.game.socket.on("scene0", (state) => {
      if (state.fase4) {
        this.fase4 = state.fase4.key;
      }
      if (state.fase5) {
        this.fase5 = state.fase5.key;
      }

      if (state.player) {
        this.player2.setPosition(state.player.x, state.player.y - 1184);
        this.player2.anims.play(state.player.animation, true);
      }

      if (state.platform12) {
        this.platform12.setPosition(
          state.platform12.x,
          state.platform12.y - 1184,
        );
      }
      if (state.platform15) {
        this.platform15.setPosition(
          state.platform15.x,
          state.platform15.y - 1184,
        );
      }

      if (state.cannon) {
        this.angleCannon = state.cannon.angle;
        this.shoot = state.cannon.shooting;
      }
    });
  }
 
  liberarIa() {

    if (this.antenasconsertadas != 3) {
      console.log("ia não disponivel");
      this.faisca3.setVisible(false);
      return;
    }

    console.log("ia disponivel");
    this.faisca3.setVisible(true);
  }
   
  playerIa() {
    this.playerIcon.anims.play("playerIconVerde")
    this.collectIa = true;
    }
  
    createSemicircleLifeBar() {
    // Posição da barra de vida segmentada
    const x = 223;
    const y = 113;
    const radius = 30;
    const bgRadius = radius + 6;



    this.lifeBarGraphics = this.make
      .graphics({
        x: x,
        y: y,
        add: true,
      })
      .setScrollFactor(0)
      .setDepth(10);

    this.lifeRadius = radius;
    this.updateSemicircleLifeBar();
  }

  updateSemicircleLifeBar() {
    if (!this.lifeBarGraphics) {
      return;
    }

    const maxLife = 3;
    const radius = this.lifeRadius;
    const segmentCount = 3;
    const gapDegrees = 5;
    const segmentDegrees = (360 - segmentCount * gapDegrees) / segmentCount;

    this.lifeBarGraphics.clear();

    const activeColor = 0x9200B6;
      

    for (let i = 0; i < segmentCount; i++) {
      const startAngle = Phaser.Math.DegToRad(
        270 + i * (segmentDegrees + gapDegrees),
      );
      const endAngle = Phaser.Math.DegToRad(
        270 + i * (segmentDegrees + gapDegrees) + segmentDegrees,
      );
      const color = i < this.vida ? activeColor : 0x555555;

      this.lifeBarGraphics
        .lineStyle(4, color, 1)
        .beginPath()
        .arc(0, 0, radius, startAngle, endAngle, false)
        .strokePath();
    }
  }

  update(time, delta) {
    this.GameOver();
    this.puzzleAberto = this.verificarMinigamesAtivos();
    this.cannon.setAngle(this.angleCannon);

    if (this.doorOpen === 1) {
      this.avisoconsole.setPosition(843, 222);
    } else if (this.doorOpen === 2) {
      this.avisoconsole.setPosition(933, 550);
    } else if (this.doorOpen === 3) {
      this.avisoconsole.setVisible(false);
    } else if (this.doorOpen === 4) {
      this.avisoconsole.setVisible(true);
      this.avisoconsole.setPosition(640, 505);
    }

    //if (this.fase4) {

    if (this.positionP2 && this.fase4) {
      try {
        this.game.socket.emit("scene1", this.game.room, {
          playerroxo: {
            x: this.playerroxo.x,
            y: this.playerroxo.y,
            animation: this.playerroxo.anims.currentAnim
              ? this.playerroxo.anims.currentAnim.key
              : null,
          },
        });
      } catch (e) {
        console.error("Error updating player:", e);
      }
    }
    //}

    if (this.game.audio && this.comunication) {
      this.game.audio.volume = this.comunication.isDown ? 1 : 0;
    }

    if (this.shoot && this.bulletP1) {
      this.bulletP1 = false;
      setTimeout(() => {
        this.bulletP1 = true;
      }, 1000);

      if (this.angleCannon === 0) {
        this.laserP1
          .create(this.cannon.x, this.cannon.y - 20, "bulletP1")
          .setVelocityY(-200);
      } else if (this.angleCannon === 80) {
        this.laserP1
          .create(this.cannon.x + 30, this.cannon.y - 5, "bulletP1")
          .setVelocityY(-33)
          .setVelocityX(165);
      } else if (this.angleCannon === -80) {
        this.laserP1
          .create(this.cannon.x - 30, this.cannon.y - 5, "bulletP1")
          .setVelocityY(-33)
          .setVelocityX(-165);
      } else if (this.angleCannon === 50) {
        this.laserP1
          .create(this.cannon.x + 20, this.cannon.y - 15, "bulletP1")
          .setVelocityY(-150)
          .setVelocityX(150);
      } else if (this.angleCannon === -50) {
        this.laserP1
          .create(this.cannon.x - 20, this.cannon.y - 15, "bulletP1")
          .setVelocityY(-150)
          .setVelocityX(-150);
      }
    }

    /*if (this.puzzleAberto) {
      if (this.playerroxo) {
        this.playerroxo.setVelocity(0, 0);
        this.playerroxo.anims.play("idlecostas", true);
        this.caixa.setPosition(this.playerroxo.x, this.playerroxo.y)
      }
      if (this.passos && this.passos.isPlaying) {
        this.passos.stop();
      }
      return;
    }*/

    if (!this.outShip) {
      this.cameras.main.setBounds(24, 24, this.tilemap.widthInPixels - 48, 708);
      this.playerroxo.setCollideWorldBounds(false);
    } else if (this.outShip) {
      const bx = 43;
      const by = 0;
      const bw = 1222;
      const bh = 1720;
      this.cameras.main.setBounds(bx, by, bw, bh);
      this.physics.world.setBounds(bx, by, bw, bh);
      this.playerroxo.setCollideWorldBounds(true);

      //.startFollow(this.playerroxo, true, .1, .1);
    }

    const portaOverlap = this.physics.overlap(this.playerroxo, this.porta);
    const porta2Overlap = this.physics.overlap(this.playerroxo, this.porta2);

    if (portaOverlap && !this.portalTeleported) {
      this.portaOverlapTime += delta;
      if (this.portaOverlapTime >= 2000) {
        this.portalTeleported = true;
        this.portaOverlapTime = 0;
        this.teletransporte();
      }
    } else if (!portaOverlap) {
      this.portaOverlapTime = 0;
      this.portalTeleported = false;
    }

    if (porta2Overlap && !this.portal2Teleported) {
      this.porta2OverlapTime += delta;
      if (this.porta2OverlapTime >= 2000) {
        this.portal2Teleported = true;
        this.porta2OverlapTime = 0;
        this.teletransporte2();
      }
    } else if (!porta2Overlap) {
      this.porta2OverlapTime = 0;
      this.portal2Teleported = false;
    }

    if (this.puzzleAberto) {
      if (this.playerroxo) {
        this.playerroxo.setVelocity(0, 0);
        this.caixa.setPosition(this.playerroxo.x, this.playerroxo.y)
      }
      if (this.passos && this.passos.isPlaying) {
        this.passos.stop();
      }
      return;
    }


  
    const cursores = this.input.keyboard.createCursorKeys();
    const qe = this.input.keyboard.addKeys("E, Q");

    this.comunication = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT,
    );

    const jkl = this.input.keyboard.addKeys("J,K,L");

    if (this.doorOpen === 2) {
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
    }

    this.caixa.setPosition(this.playerroxo.x, this.playerroxo.y);

    // Captura entrada do teclado
    //const cursors = this.input.keyboard.createCursorKeys();
    const wasd = this.input.keyboard.addKeys("W,S,A,D");

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

    // Aplica velocidade
    this.playerroxo.setVelocityX(horizontal * this.speed);
    this.playerroxo.setVelocityY(vertical * this.speed);

    // Verifica overlap com limites e ajusta as bounds da câmera
    /* const isOverlapLimites = this.physics.overlap(
      this.playerroxo,
      this.limites,
   );
    this.cameras.main.setBounds(24, 24, (this.tilemap.widthInPixels - 48), 708);*/
    if (this.fase5) {
      if (qe.E.isDown) {
        this.cameras.main.setBounds(10, 0, this.tilemap.widthInPixels);
        this.cameras.main.startFollow(this.player2, false, 1, 0).zoom = 1.2;

        this.cameras.main.scrollY = 2348 - this.cameras.main.height / 2 - 120;
      } else if (qe.Q.isDown) {
        this.cameras.main.startFollow(this.playerroxo, true, 0.1, 0.1);
        this.cameras.main.setBounds(
          24,
          24,
          this.tilemap.widthInPixels - 48,
          708,
        );
      }
    }

    // Animações e som baseado no movimento
    const moving = Math.abs(horizontal) > 0.1 || Math.abs(vertical) > 0.1;

    if (moving) {
      if (!this.passos.isPlaying) this.passos.play();
    } else {
      if (this.passos.isPlaying) this.passos.stop();
    }
    if (!this.collectIa){
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
    } else if (this.collectIa) {
      if (horizontal > 0.1) {
        this.playerroxo.anims.play("andardireitaverde", true);
      } else if (horizontal < -0.1) {
        this.playerroxo.anims.play("andaresquerdaverde", true);
      } else if (vertical > 0.1) {
        this.playerroxo.anims.play("andarfrenteverde", true); // assumindo que "andarfrente" é para baixo
      } else if (vertical < -0.1) {
        this.playerroxo.anims.play("andarcostasverde", true);
      } else {
        // Idle baseado na última direção
        if (this.playerroxo.anims.currentAnim) {
          const currentKey = this.playerroxo.anims.currentAnim.key;
          if (currentKey === "andardireitaverde") {
            this.playerroxo.anims.play("idledireitaverde", true);
          } else if (currentKey === "andaresquerdaverde") {
            this.playerroxo.anims.play("idleesquerdaverde", true);
          } else if (currentKey === "andarfrenteverde") {
            this.playerroxo.anims.play("idlefrenteverde", true);
          } else if (currentKey === "andarcostasverde") {
            this.playerroxo.anims.play("idlecostasverde", true);
          }
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

        console.log(enemy.lastDirection)
      if (distance > 0) {
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

    if (this.inimigosaliens && this.inimigosaliens.getLength() > 0) {
      let pacoteAliens = [];

      this.inimigosaliens.getChildren().forEach((alien) => {
        pacoteAliens.push({
          id: alien.getData("id"),
          x: alien.x,
          y: alien.y,
         // vx: alien.body.velocity.x,
         // vy: alien.body.velocity.y,
          flipX: alien.flipX, // Lado para onde está olhando
          anim: alien.anims.currentAnim ? alien.anims.currentAnim.key : null, // Animação atual
        });
      });

      // Transmite o bloco de movimentos para a scene0
      this.game.socket.emit("atualizar-movimento-aliens", pacoteAliens);
    }
  } // fim update

    verificarMinigamesAtivos() {
      for (let i = 0; i < this.listaMinigames.length; i++) {
        if (this.scene.isActive(this.listaMinigames[i])) {
          return true;
        }
      }
      return false;
    }
  // Método de spawn dentro da sua scene1.js
  spawnAlienAleatorio() {
    if (!this.positionP2) {
      return;
    }

    // TESTE 3: O grupo existe e quantos aliens tem?
    if (this.inimigosaliens) {
      if (this.inimigosaliens.getLength() >= 3) {
        return;
      }
    }

    const dadosAlien = {
      // Gera um ID único essencial para saber qual alien foi atingido depois
      id: Phaser.Utils.String.UUID(),
      x: Phaser.Math.Between(87, 1200), // Posição X aleatória
      y: Phaser.Math.Between(1360, 1400), // Começa fora da tela (topo)
      tipo: "inimigo", // Nome da textura/sprite
      velocidadeY: Phaser.Math.Between(100, 200), // Velocidade aleatória
    };

    // 1. Cria o alien na cena atual (scene1) se aplicável
    let alien = this.inimigosaliens
      .create(dadosAlien.x, dadosAlien.y, dadosAlien.tipo)
      .setDepth(10);

    if (alien) {
      alien.setDepth(999);
      alien.body.setSize(30, 37);
      alien.setData("id", dadosAlien.id);
    }

    // 2. Transmite via socket para a rede
    this.game.socket.emit("alien-spawnado-scene1", dadosAlien);
  }

  perdervida(caixa, enemy) {
    // Verifica se já está em cooldown de invencibilidade
    if (this.invulnerable) {
      return;
    }

    // Ativa invencibilidade e desativa colisão por 1 segundo
    this.invulnerable = true;
    this.colliderAliensBox.active = false;
    this.vida -= 1;
    this.updateSemicircleLifeBar();

    // Teletransporta playerroxo, destrói inimigos e bloqueia spawn por 1 segundo
    this.playerroxo.setPosition(111, 1573)
    .anims.play("idlefrente", true);

    if (this.puzzleAberto) {
      console.log("O Alien pegou o player! Fechando o puzzle ativo...");

      // 2. O "truque" está aqui: um loop que manda fechar TODOS da lista
      this.listaMinigames.forEach(minigame => {
        this.scene.stop(minigame); // O Phaser só vai fechar o que estiver aberto de fato
      });
    }
   
if (this.inimigosaliens) {
      // Cria uma cópia da lista de aliens vivos para não bugar enquanto deleta
      let aliensVivos = this.inimigosaliens.getChildren().slice(); 

      aliensVivos.forEach(alien => {
        let idAlien = alien.getData("id");
        
        if (idAlien) {
          // Usa o MESMO socket do laser para avisar a scene0 para destruir este ID
          this.game.socket.emit("destruir-alien", idAlien);
        }
        
        // Destrói o alien localmente
        alien.destroy();
      });
    }
    this.enemySpawnBlocked = true;
    this.time.delayedCall(1000, () => {
    this.enemySpawnBlocked = false;
    });

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
        this.outShip = true;
        this.positionP2 = true;
        this.porta.anims.play("portafechando", true);
      });
    }
  }

  teletransporte2() {
    //if (this.antenasconsertadas === 3)
    {
      this.porta2.anims.play("portaabrindo", true);
      this.positionP2 = false;

      // Define a porta aberta como 4 no estado local e também envia para o servidor.
      this.abrirPorta(4);

      this.time.delayedCall(1000, () => {
        this.playerroxo.setPosition(640, 651); // teletransporte para o interior da nave
        this.outShip = false;
        this.porta2.anims.play("portafechando", true);
      });
    }
  }

  abrirPorta(idPorta) {
    try {
      // Define o estado da porta com base no id fornecido
      this.doorOpen = idPorta;
      this.puzzleAberto = false;

      // Emite atualização de estado para o servidor/jogadores
      this.game.socket.emit("scene1", this.game.room, {
        doorOpen: {
          key: this.doorOpen,
        },
      });

      // Opcional: log para depuração
      console.log("Porta aberta setada para:", this.doorOpen);
    } catch (e) {
      console.error("abrirPorta error:", e);
    }
  }

  typeTextoExplicativo(text, speed = 50, onComplete = null) {
    if (!text || text.length === 0) {
      if (this.textoexplicativo) {
        this.textoexplicativo.setText("");
      }
      if (onComplete) {
        onComplete();
      }
      return;
    }

    if (this.iaTypingEvent) {
      this.iaTypingEvent.remove(false);
      this.iaTypingEvent = null;
    }

    if (this.textoexplicativo) {
      this.textoexplicativo.setText("");
    }

    let index = 0;
    this.iaTypingEvent = this.time.addEvent({
      delay: speed,
      repeat: text.length - 1,
      callback: () => {
        index++;
        if (this.textoexplicativo) {
          this.textoexplicativo.setText(text.substring(0, index));
        }
        if (index >= text.length) {
          this.iaTypingEvent = null;
          if (onComplete) {
            onComplete();
          }
        }
      },
    });
  }

  killEnemy(enemy, laser) {
    let idAlien = enemy.getData("id");

    if (idAlien) {
      // Avisa a outra tela para apagar o alien com esse ID
      this.game.socket.emit("destruir-alien", idAlien);
    }

    enemy.destroy();
    laser.destroy();
  }

  webrtcMakeCall() {
    this.game.localConnection = new RTCPeerConnection(this.game.iceServers);

    this.game.localConnection.onicecandidate = ({ candidate }) => {
      this.game.socket.emit("candidate", this.game.room, candidate);
    };

    this.game.localConnection.ontrack = ({ streams: [stream] }) => {
      this.game.audio.srcObject = stream;
      this.game.audio.volume = 0;
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
