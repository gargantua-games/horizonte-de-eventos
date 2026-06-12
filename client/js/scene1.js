class scene1 extends Phaser.Scene {
  constructor() {
    super("scene1");

    this.speed = 200;
    this.estoutrabalhando = false;
    this.doorOpen = 0;
    this.fase4 = false;
    this.fase5 = false;
    this.vida = 4;
    this.invulnerable = false;
    this.positionP2 = false;
    this.puzzleAberto = false;
    this.listaMinigames = [
      "genius",
      "helldivers",
      "quebraCabeca",
      "termo",
      "sudoku",
    ];
    this.bulletP1 = true;
    this.shoot = false;
    this.inimigosalienscount = 0;
    this.outShip = false;
    this.comunicationP2 = true;
    this.enemySpawnBlocked = false;
    this.antenasconsertadas = 0;
    this.collectIa = false;
    this.gameOver = false;
    this.bloqueioColisao = false;
    this.bancoMinigames = [
      { id: "genius", aparicoes: 0 },
      { id: "helldivers", aparicoes: 0 },
    ];

    this.inFinalDoorP1 = false;
    this.inFinalDoorP2 = false;
    this.camP1 = false;
    this.score = 0;
    this.concertando = false;
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

    if (this.vida > 0) {
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
    this.physics.world.gravity.y = 0;
    this.infase = 1;
    
    //adiciona trilha sonora e efeitos sonoros
    this.trilhasonora = this.sound.add("trilhasonora", {
      loop: true,
      volume: 0.2,
    });
    //this.trilhasonora.play();

    this.passos = this.sound.add("passos", { loop: true, volume: 1 });
    this.respiracao = this.sound.add("respiracao", { loop: true, volume: 2 });
    this.batimentocardiaco = this.sound.add("batimentocardiaco", {
      loop: true,
      volume: 1,
    });
    this.disparo = this.sound.add("disparo",{ volume: 0.7 });

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
       key: "engrenagem-idleciano",
       frames: this.anims.generateFrameNumbers("engrenagem", {
         start: 6,
         end: 7,
       }),
       frameRate: 2,
       repeat: -1,
     });
    
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
      frameRate: 11,
      repeat: -1,
    });

    this.anims.create({
      key: "andarfrenteverde",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 74,
        end: 81,
      }),
      frameRate: 11,
      repeat: -1,
    });

    this.anims.create({
      key: "andardireitaverde",
      frames: this.anims.generateFrameNumbers("playerroxo", {
        start: 82,
        end: 89,
      }),
      frameRate: 11,
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
      key: "open-door",
      frames: this.anims.generateFrameNumbers("door", { start: 0, end: 7 }),
      frameRate: 7,
      repeat: 0,
    });

    this.anims.create({
      key: "close-door",
      frames: this.anims.generateFrameNumbers("door", { start: 7, end: 0 }),
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


    this.anims.create({
      key: "fiosconsertando",
      frames: this.anims.generateFrameNumbers("painelfios", {
        start: 0,
        end: 3,
      }),
      frameRate: 3,
      repeat: 0,
    });

    this.createSemicircleLifeBar();

    this.painelfios = this.physics.add.sprite(175, 1546, "painelfios");
    this.painelfios.setDepth(99).setScale(5).disableBody(true, true);

    //adicionar porta
    this.porta = this.physics.add.sprite(1200, 640, "porta", 0);
    this.porta.setAngle(90).setSize(32, 128);

    //adicionar segunda porta
    this.porta2 = this.physics.add.sprite(55, 1573, "porta", 0);
    this.porta2.setAngle(90).setSize(32, 128);

    this.portaFinal = this.physics.add.sprite(641, 719, "porta", 0);

    this.avisoconsole = this.physics.add.sprite(913, 388, "avisoconsole");
    this.avisoconsole.anims.play("avisopiscando");
    

    this.laserP1 = this.physics.add.group({
      immovable: true,
    });

    //faz um grupo para os bigbosses
    this.bigboss = this.physics.add.group({
      immovable: true,
      pipeline: "Light2D",
    });

    //adiciona o bigboss como sprite físico para colidir com o player
    //COMPUTADOR 1, SPRITES DA DIREITA PRA ESQUERDA
    this.bigboss.create(465, 275, "bigboss"); //bigboss 1
    
    //COMPUTADOR 2(ABAIXO DO 1), SPRITES DA DIREITA PRA ESQUERDA
    //-62 +160
    this.bigboss.create(403, 435, "bigboss"); 

    //COMPUTADOR 3(ABAIXO DO 2), SPRITES DA DIREITA PRA ESQUERDA
    //-33 -160
    this.bigboss.create(370, 595, "bigboss"); //bigboss 3
   

    //COMPUTADOR 4 (DIREITA DO 3), SPRITES DA DIREITA PRA ESQUERDA
    //+690 X A PARTIR DO 3
    this.bigboss.create(1040, 598, "bigboss"); //bigboss 4, posição alterada
    

    //COMPUTADOR 5 (DIREITA DO 2), SPRITES DA DIREITA PRA ESQUERDA
    //+627 X A PARTIR DO 2
    this.bigboss.create(1008, 443, "bigboss"); //bigboss 5, posição alterada
    

    //COMPUTADOR 6 (DIREITA DO 1), SPRITES DA DIREITA PRA ESQUERDA
    //+500 X A PARTIR DO 1
    this.bigboss.create(950, 282, "bigboss"); //bigboss 6, posiçao alterada
    
    
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
    this.bigboss.create(530, 555, "bigboss").setSize(30, 20);

    //console do meio
    this.consolelongo = this.physics.add.sprite(645, 350, "consolelongo");
    this.consolelongo.body.setSize(323, 25).setOffset(0, 27);
    this.consolelongo;
    this.consolelongo.setImmovable(true);

    this.consolemedio = this.physics.add.group({
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
    this.consoles;
    this.consoles.setImmovable(true);

    //console_w da esuqerda cima, com bigboss 1
    this.consolew = this.physics.add.sprite(446, 268, "consolew");
    this.consolew.body.setSize(47, 17).setOffset(15, 20);
    this.consolew;
    this.consolew.setImmovable(true);

    //console_s da esquerda meio
    this.consoles2 = this.physics.add.sprite(310, 418, "consoles");
    this.consoles2.body.setSize(102, 25).setOffset(0, 27);
    this.consoles2;
    this.consoles2.setImmovable(true);

    //console_w da esuqerda meio, com bigboss 2
    this.consolew2 = this.physics.add.sprite(385, 429, "consolew");
    this.consolew2.body.setSize(47, 17).setOffset(15, 20);
    this.consolew2;
    this.consolew2.setImmovable(true);

    //console_s da esquerda baixo
    this.consoles3 = this.physics.add.sprite(278, 580, "consoles");
    this.consoles3.body.setSize(102, 25).setOffset(0, 27);
    this.consoles3;
    this.consoles3.setImmovable(true);

    //console_w da esuqerda baixo, com bigboss 3
    this.consolew3 = this.physics.add.sprite(350, 587, "consolew");
    this.consolew3.body.setSize(47, 17).setOffset(15, 20);
    this.consolew3;
    this.consolew3.setImmovable(true);

    //console_s da direita cima
    this.consoles4 = this.physics.add.sprite(863, 261, "consoles");
    this.consoles4.body.setSize(102, 25).setOffset(0, 27);
    this.consoles4;
    this.consoles4.setImmovable(true);

    //console_w da direita cima, com bigboss 6
    this.consolew4 = this.physics.add.sprite(930, 273, "consolew");
    this.consolew4.body.setSize(47, 17).setOffset(15, 20);
    this.consolew4;
    this.consolew4.setImmovable(true);

    //console_s da direita meio
    this.consoles5 = this.physics.add.sprite(915, 423, "consoles");
    this.consoles5.body.setSize(102, 25).setOffset(0, 27);
    this.consoles5;
    this.consoles5.setImmovable(true);

    //console_w da direita meio, com bigboss 5
    this.consolew5 = this.physics.add.sprite(989, 434, "consolew");
    this.consolew5.body.setSize(47, 17).setOffset(15, 20);
    this.consolew5;
    this.consolew5.setImmovable(true);

    //console_s da direita baixo
    this.consoles6 = this.physics.add.sprite(950, 580, "consoles");
    this.consoles6.body.setSize(102, 25).setOffset(0, 27);
    this.consoles6;
    this.consoles6.setImmovable(true);

    //console_w da direita baixo, com bigboss 4
    this.consolew6 = this.physics.add.sprite(1022, 590, "consolew");
    this.consolew6.body.setSize(47, 17).setOffset(15, 20);
    this.consolew6;
    this.consolew6.setImmovable(true);

    this.cannon = this.add.sprite(656, (4320 - 2616), "torreta");
    this.cannon.setPipeline("Light2D").setAngle(180).setDepth(999).setScale(1.5);

    //exterior da nave antenas
    this.antenas = this.physics.add.group({
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



    this.antenas.create(207, 1363, "telescopio").body.setSize(20, 20);

    this.antenas.create(338, 1587, "telescopio").body.setSize(20, 20);

    this.antenas.create(626, 1400, "osciloscopio").body.setSize(35, 17);

    this.antenas.create(980, 1560, "osciloscopio").body.setSize(35, 17);

    this.limiteporta = this.physics.add.sprite(638, 750, "bigboss");
    this.limiteporta.setSize(128, 32);
    this.limiteporta.setImmovable(true);

    this.limitenorte = this.physics.add.sprite(638, 1324, "bigboss"); //662, 1347 667 1460
    this.limitenorte.setImmovable(true);
    this.limitenorte.setSize(1280, 17);

    //faisca na antena
    
    this.antena1 = this.physics.add.sprite(175, 1546, "NewPiskel");
    this.antena1.body.setSize(20, 30);
    this.antena1.setOffset(27, 0);
    this.antena1.setScale(-1, 1);
    this.antena1.setImmovable(true);
    
    //faísca na segunda antena
    this.antena2 = this.physics.add.sprite(820, 1420, "NewPiskel");
    this.antena2.body.setSize(20, 30);
    this.antena2.setOffset(10, 0);
    this.antena2.setImmovable(true);
   
    this.faisca1 = this.physics.add.sprite(175, 1546, "faisca");
    this.faisca1.anims.play("faiscando");
    this.faisca1.setScale(2);
    
    this.faisca2 = this.physics.add.sprite(820, 1420, "faisca");
    this.faisca2.anims.play("faiscando");
    this.faisca2.setScale(2); 
    
    this.faisca3 = this.add.sprite(1107, 1490, "faisca");
    this.faisca3.anims.play("faiscando").setScale(2);
    this.faisca3.setVisible(false);
    
    this.faisca4 = this.physics.add.sprite(433, 1468, "faisca");
    this.faisca4.anims.play("faiscando");
    this.faisca4.setScale(2);

    this.anims.create({
      key: "chipIdle",
      frames: this.anims.generateFrameNumbers("iaChip", {
        start: 0,
        end: 2,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.iaChip = this.physics.add.sprite(1107, 1490, "iaChip");
    this.iaChip.anims.play("chipIdle");

    this.iaChip.disableBody(true, true);

    this.telescopio3 = this.physics.add.sprite(1107, 1490, "telescopio");
    this.telescopio3.body.setSize(20, 20)
    .setImmovable(true);



    this.antena4 = this.physics.add.sprite(433, 1468, "NewPiskel");
    this.antena4.body.setSize(20, 30);
    this.antena4.setOffset(10, 0);
    this.antena4.setImmovable(true);

    //adiciona o player roxo
    this.playerroxo = this.physics.add.sprite(640, 448, "playerroxo"); //640,448 interior //650, 1640 exterior //spawn
    this.playerroxo.anims
      .play("idlecostas", true)
      .body.setSize(25, 10)
      .setOffset(19, 47).allowGravity = false;

    this.caixa = this.physics.add.sprite(
      this.playerroxo.x,
      this.playerroxo.y,
      "bigboss",
    );
    this.caixa.body.setSize(36, 55);
    this.caixa;
    this.caixa.body.immovable = true;

    this.platforms = this.physics.add.group({
      immovable: true,
    });

    this.platform51 = this.platforms
      .create(115, 3420 - 1184, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platform52 = this.platforms //primeira da segunda parte
      .create(773, 2310, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platform53 = this.platforms //segunda d segunda parte
      .create(850, 2215, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platform54 = this.platforms //mais da direita
      .create(1222, 2191, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.porta3 = this.add
      .sprite(1152, 2337, "door")
      .setScrollFactor(0.95, 1)
      .setPipeline("Light2D");
    
    this.door15 = this.add.sprite(92, 2337, "door", 7)
      .setScrollFactor(0.95, 1)
      .setPipeline("Light2D")

    this.painelLuz = this.physics.add.sprite(350, 2230, "painelLuz").setScale(0.3).setPipeline("Light2D");

    this.painelO2 = this.physics.add
      .sprite(1222, 2178, "painelO2")
      .setScale(0.3)
      .setPipeline("Light2D");

    this.platforms //esquerda do primeiro interagier, acima
      .create(220, 3365 - 1184, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.cracha = this.physics.add.sprite(535, 2165, "engrenagem");
    this.cracha.anims.play("engrenagem-idleciano");
    this.cracha.setScale(0.8).setPipeline("Light2D");

    this.platform12 = this.physics.add.sprite(350, 2243, "plataform"); //primeiro interagir
    this.platform12
      .setImmovable(true)
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platform15 = this.physics.add.sprite(950, 2183, "plataform");
    this.platform15
      .setImmovable(true)
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.player2 = this.add.sprite(113, 2340, "player");

    //colisoes
    this.physics.add.collider(this.playerroxo, this.layerPiso);
    this.physics.add.collider(this.playerroxo, this.layerParede);
    this.physics.add.collider(this.playerroxo, this.consolelongo);
    this.physics.add.collider(this.playerroxo, this.consolemedio, () => {
      if (this.doorOpen === 4 && this.infase === 5) {
        if (this.playerroxo.y > 530) {
          if (!this.puzzleAberto) {
            this.puzzleAberto = true;
            this.scene.launch("termo", { portaId: 5, cenaOrigem: "scene1" });
          }
        }
      }
    });

    this.physics.add.collider(this.playerroxo, this.consoles);

    this.physics.add.collider(this.playerroxo, this.consoles2);
    this.physics.add.collider(this.playerroxo, this.consoles3);
    this.physics.add.collider(this.playerroxo, this.consoles4, () => {
      if (this.doorOpen === 1 && this.infase === 2) {
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
      if (this.doorOpen === 0 && this.infase === 1) {
        if (this.playerroxo.y > 415) {
          if (!this.puzzleAberto) {
            this.puzzleAberto = true;
            this.scene.launch("genius", {
              portaId: 1,
              cenaOrigem: "scene1",
            });
          }
        }
      }
    });
    this.physics.add.collider(this.playerroxo, this.consoles6, () => {
      if (this.doorOpen === 2 && this.infase === 3) {
        if (this.playerroxo.y > 566) {
          if (!this.puzzleAberto) {
            this.puzzleAberto = true;
            this.scene.launch("quebraCabeca", {
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
    this.physics.add.collider(this.playerroxo, this.limiteporta);
    this.physics.add.collider(this.playerroxo, this.antena1, () => {
      console.log("antena1");
      if (this.isConsertando) {
        return;
      } // Trava para impedir que o código rode nos próximos frames de colisão
      this.isConsertando = true;
      this.puzzleAberto = true;
      this.painelfios.enableBody(true, 175, 1546, true, true);
      this.painelfios.setDepth(999);
      this.painelfios.anims
            .play("fiosconsertando");
      this.painelfios.once("animationcomplete", (anim, frame) => {
        if (anim.key === "fiosconsertando") { 
        if (this.faisca1) {
          this.faisca1.setVisible(false);
        }
        this.antena1.disableBody(true);
        this.puzzleAberto = false;
        this.isConsertando = false;
        this.painelfios.disableBody(true, true);
        this.antenasconsertadas += 1;
          this.liberarIa();
        
      }
      });
        
    });

    this.physics.add.collider(this.playerroxo, this.telescopio3, () => {
      if(this.antenasconsertadas === 3) {
      if (this.isConsertando) {
        return;
      }
      
      // Trava para impedir que o código rode nos próximos frames de colisão
      this.isConsertando = true;
        this.puzzleAberto = true;
        this.painelfios.enableBody(true,1107, 1490, true, true)
        this.painelfios.setDepth(999)
      this.painelfios.anims
            .play("fiosconsertando");
      this.painelfios.once("animationcomplete", (anim, frame) => {
        if (anim.key === "fiosconsertando") {
          
          this.faisca3.setVisible(false);
          this.telescopio3.disableBody(true);
          this.puzzleAberto = false;
          this.isConsertando = false;
          this.painelfios.disableBody(true, true);
          this.iaChip.enableBody(true, (this.playerroxo.x + 64), this.playerroxo.y, true, true)
        }
      });
    }
      });


    this.physics.add.overlap(this.playerroxo, this.iaChip, () => {
      this.playerIa();
    });

    this.physics.add.collider(this.playerroxo, this.antena2, () => {
      console.log("antena2");
      if (this.isConsertando) {
        return;
      }
    
      this.isConsertando = true;
      this.puzzleAberto = true;
      this.painelfios.setDepth(999)
      .enableBody(true, 820, 1420, true, true);
      this.painelfios.anims
      .play("fiosconsertando");
      this.painelfios.once("animationcomplete", (anim, frame) => {
        if (anim.key === "fiosconsertando") {
          if (this.faisca2) {
            this.faisca2.setVisible(false);
          }
          this.antena2.disableBody(true);
          this.puzzleAberto = false;
           this.isConsertando = false;
          this.painelfios.disableBody(true, true);
          this.antenasconsertadas += 1;
          this.liberarIa();
          
          
        }
      });
    });


    this.physics.add.collider(this.playerroxo, this.antena4, () => {
      console.log("antena4");
      if (this.isConsertando) {
        return;
      }
      // Trava para impedir que o código rode nos próximos frames de colisão
      this.puzzleAberto = true;
      this.isConsertando = true;
      this.painelfios.setDepth(999)
      this.painelfios.enableBody(true, 433, 1468, true, true)
      this.painelfios.anims
            .play("fiosconsertando");
      this.painelfios.once("animationcomplete", (anim, frame) => {
        if (anim.key === "fiosconsertando") {
          if (this.faisca4) {
            this.faisca4.setVisible(false);
          }
          this.painelfios.disableBody(true, true);
          this.antena4.disableBody(true);
          this.puzzleAberto = false;
           this.isConsertando = false;
          this.antenasconsertadas += 1;
          this.liberarIa();
          
          
        }
      });
    });


    this.physics.add.collider(
      this.laserP1,
      this.limitenorte, () => {
        this.laserP1.children.each((laser) => {
          laser.destroy();
        });

      });

    this.physics.add.overlap(this.caixa, this.porta, () => {
      
      //if (this.infase === 4) {
        this.porta.anims.play("portaabrindo", true);
        
        this.porta.once("animationcomplete", (anim, frame) => {
          if (anim.key === "portaabrindo") {
            this.playerroxo.setPosition(111, 1573); //teletransporte para o exterior da nave
            this.outShip = true;
            this.positionP2 = true;
            this.spawnAlienAleatorio();
            this.porta.anims.play("portafechando", true);
            this.trilhasonora.pause();
            this.respiracao.play();
            this.batimentocardiaco.play();
          }
        });
     // }
    });
    
    this.physics.add.overlap(this.playerroxo, this.porta2, () => {
      
      if (this.antenasconsertadas === 3) {
        this.porta2.anims.play("portaabrindo", true);
        
        this.porta2.once("animationcomplete", (anim, frame) => {
          if (anim.key === "portaabrindo") {
            
            this.abrirPorta(4);
            this.playerroxo.setPosition(640, 651);
            this.outShip = false;
            this.positionP2 = false;
            this.spawnAlienAleatorio();
            this.porta.anims.play("portafechando", true);
            this.trilhasonora.play();
            this.respiracao.pause();
            this.batimentocardiaco.pause();

          }
        });
      }
    });

    this.physics.add.overlap(this.playerroxo, this.portaFinal, () => {
      if (this.doorOpen >= 5 && this.inFinalDoorP1) {
        this.inFinalDoorP2 = true;
        this.portaFinal.anims.play("portaabrindo", true);

        this.portaFinal.once("animationcomplete", (anim, frame) => {
          if (anim.key === "portaabrindo") {
            this.portaFinal.disableBody(true);
            this.portaFinal.setFrame("7");
          }
        });
      }
    });

  
  this.physics.add.collider(this.playerroxo, this.limitenorte);

    this.inimigosaliens = this.physics.add.group({
      immovable: false,
      pipeline: "Light2D",
    });

    this.physics.add.collider(this.inimigosaliens, this.limitenorte);
    this.physics.add.collider(this.inimigosaliens, this.inimigosaliens);
    this.colliderAliensBox = this.physics.add.collider(
      this.caixa,
      this.inimigosaliens,
      this.perdervida,
      null,
      this,
    ); 

    this.layerParede.setCollisionByProperty({ collides: true });

    this.physics.add.overlap(
      this.inimigosaliens,
      this.laserP1,
      this.killEnemy,
      null,
      this,
    );

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
      .setPipeline("Light2D");

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

    this.playerIcon = this.add
      .sprite(pIconX, pIconY, "playersIcon")
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
    molde.setScrollFactor(0);
    molde.setDepth(9);

    // Define a cor de preenchimento (a cor não importa, pois ficará invisível)
    molde.fillStyle(0xffffff);

    // Desenha o círculo na mesma posição da imagem (x: 400, y: 300) e define o raio (ex: 100 pixels)
    // Dica: O raio idealmente deve ser a metade da largura/altura da sua imagem
    molde.fillCircle(pIconX + 21, pIconY + 14, 32); //.setOrigin(0, 0).setScrollFactor(0);

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

   this.uI = this.add.container(0, 0);

    this.uI.add([
      this.lifeBarBgGraphics,
      this.lifeBarGraphics,
      this.playerIcon,
    ]);

    this.uI.setScrollFactor(0, 0);

    this.game.socket.on("scene0", (state) => {
      this.inFinalDoorP1 = state.inFinalDoorP1;
      this.score = state.engrenagens
      
      if (state.infase) {
        this.infase = (state.infase);
        console.log("Scene 1 capturou a fase da Scene 0: ", this.infase);
      }
    });

    

    this.game.socket.on("GameOver", (state) => {
      this.gameOver = state.gameOver;
    });

    this.game.socket.on("scene0", (state) => {
      if (state.fase4) {
        this.fase4 = state.fase4;
        console.log("fase4:" + this.fase4)
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
      if (state.door15) {
        this.door15.anims.play(state.door15)
      }

      if (state.door25) {
        this.door25.anims.play(state.door25)
      }

      if (state.cannon) {
        this.cannon.setPosition(state.cannon.x, (state.cannon.y - 2624))
        this.shoot = state.cannon.shooting;
      }
    });

  this.teclaFalar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    // Quando APERTAR o SHIFT (Abre o microfone)
    this.teclaFalar.on('down', () => {
      // Checa se o microfone existe e se a comunicação está liberada
      if (this.game.media && this.comunication) {
        const myAudioTrack = this.game.media.getAudioTracks()[0];
        if (myAudioTrack) {
          myAudioTrack.enabled = true;
          console.log("P2: Falando (SHIFT pressionado)");
        }
      }
    });

    // Quando SOLTAR o SHIFT (Fecha o microfone)
    this.teclaFalar.on('up', () => {
      if (this.game.media) {
        const myAudioTrack = this.game.media.getAudioTracks()[0];
        if (myAudioTrack) {
          myAudioTrack.enabled = false;
          console.log("P2: Mutado (SHIFT solto)");
        }
      }
    });
    
  }



  liberarIa() {
    if (this.antenasconsertadas === 3) {
      this.faisca3.setVisible(true);
      //this.faisca3.anims.play("faiscando");
      console.log("ia disponivel");
      return;
    } else if (this.antenasconsertadas != 3) {
      this.faisca3.setVisible(false);
    }
  }
  
  playerIa() {
    this.iaChip.disableBody(true, true);
    this.collectIa = true;
    this.playerIcon.anims.play("playerIconVerde");
    this.game.socket.emit("scene1", this.game.room, {
        collectIa: this.collectIa,
      });
  
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

    const maxLife = 4;
    const radius = this.lifeRadius;
    const segmentCount = 4;
    const gapDegrees = 5;
    const segmentDegrees = (360 - segmentCount * gapDegrees) / segmentCount;

    this.lifeBarGraphics.clear();

    const activeColor = 0x9200b6;

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

      

    this.liberarIa();

   // console.log("P1:" + this.inFinalDoorP1 + "P2:" + this.inFinalDoorP2);

    if (this.inFinalDoorP2) {
      this.game.socket.emit("scene1", this.game.room, {
        inFinalDoorP2: this.inFinalDoorP2,
      });

      if (this.inFinalDoorP1) {
        this.game.socket.removeAllListeners();
        this.scene.stop("scene1");
        this.scene.start("scene2", { role: "shooter", engrenagens: this.score,});
      }
    }

    if (this.puzzleAberto) {
      let minigamesRodando = [];

      // 1. Checa quais minigames estão abertos AGORA e anota o nome deles
      this.bancoMinigames.forEach((m) => {
        if (this.scene.isActive(m.id)) {
          minigamesRodando.push(m.id);
        }
      });

      // 2. Se a lista tiver mais de 1 minigame aberto... TEMOS UM PROBLEMA!
      if (minigamesRodando.length > 1) {
        // 3. Deixa o primeiro em paz (índice 0), e fecha todos os outros!
        for (let i = 1; i < minigamesRodando.length; i++) {
          console.log(
            "Failsafe ativado! Fechando o minigame intruso: " +
              minigamesRodando[i],
          );

          // Manda o Phaser parar e destruir a cena extra na mesma hora
          this.scene.stop(minigamesRodando[i]);
        }
      }
    }

    if (this.infase === 1) {
      this.avisoconsole.setVisible(true);
      this.avisoconsole.setPosition(this.consoles5.x, this.consoles5.y);
    } else if (this.infase === 2) {
      this.avisoconsole.setVisible(true);
      this.avisoconsole.setPosition(this.consoles4.x, this.consoles4.y);
    } else if (this.infase === 3) {
      this.avisoconsole.setVisible(true);
      this.avisoconsole.setPosition(this.consoles6.x, this.consoles6.y);
    } else if (this.infase === 4) {
      this.avisoconsole.setVisible(true);
      this.avisoconsole.setPosition(this.porta.x, this.porta.y);
    } else if (this.infase === 5) {
      this.avisoconsole.setVisible(true);
      this.avisoconsole.setPosition(this.consolemedio.x, this.consolemedio.y);
    } else {
      this.avisoconsole.setVisible(false);
    }

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
          porta2: this.porta2.anims.currentAnim
              ? this.porta2.anims.currentAnim.key
              : null,
          faisca1: {
            visible: this.faisca1 ? this.faisca1.visible : false,
          },
          faisca2: {
            visible: this.faisca2 ? this.faisca2.visible : false,
          },
          faisca3: {
            visible: this.faisca3 ? this.faisca3.visible : false,
          },
          faisca4: {
            visible: this.faisca4 ? this.faisca4.visible : false,
          },
        });
      } catch (e) {
        console.error("Error updating player:", e);
      }
    }
    

   /* */

    if (this.shoot && this.bulletP1) {
      this.bulletP1 = false;
      setTimeout(() => {
        this.bulletP1 = true;
      }, 1000);
      
        this.laserP1
          .create(this.cannon.x, this.cannon.y - 20, "bulletP1")
          .setVelocityY(-200);
      
    }

    const cursores = this.input.keyboard.createCursorKeys();
    const qe = this.input.keyboard.addKeys("E, Q");

    if (!this.outShip) {

      if (this.fase5) {
        if(!this.puzzleAberto){
          if (qe.E.isDown && !this.camP1) {
          this.uI.setVisible(false);
          this.cameras.main.setBounds(10, 0, this.tilemap.widthInPixels);
          this.cameras.main.startFollow(this.player2, false, 1, 0).zoom = 1.2;
          this.lights.setAmbientColor(0x303030);
          this.camP1 = true

          this.cameras.main.scrollY = 2348 - this.cameras.main.height / 2 - 120;
        } else if (qe.Q.isDown && this.camP1) {
          this.uI.setVisible(true);
          this.cameras.main.startFollow(this.playerroxo, true, 0.1, 0.1).zoom = 1.5;
          this.cameras.main.setBounds(
            24,
            24,
            this.tilemap.widthInPixels - 48,
            708,
          );
          this.lights.setAmbientColor(0xe0f7ff);
          this.playerroxo.setCollideWorldBounds(false);
          this.camP1 = false;
        }
      }
      } else if(!this.fase5) {
        this.cameras.main.startFollow(this.playerroxo, true, 0.1, 0.1).zoom = 1.5;
        this.cameras.main.setBounds(24, 24, this.tilemap.widthInPixels - 48, 708);
        this.playerroxo.setCollideWorldBounds(false);
        this.lights.setAmbientColor(0xe0f7ff);
      }
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


  
    if (this.puzzleAberto) {
      if (this.playerroxo) {
        this.playerroxo.setVelocity(0, 0);
        if (!this.collectIa) {
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
        } else if (this.collectIa) {
          // Idle baseado na última direção
          if (this.playerroxo.anims.currentAnim) {
            const currentKey = this.playerroxo.anims.currentAnim.key;
            if (currentKey === "andardireitaverde") {
              this.playerroxo.anims.play("idledireitaverde", true);
            } else if (currentKey === "andaresquerdaverde") {
              this.playerroxo.anims.play("idleesquerdaverde", true);
            } else if (currentKey === "andarfrenteverde") {
              this.playerroxo.anims.play("idlefrenteverde", true);
            } else if (currentKey === "andarcostas") {
              this.playerroxo.anims.play("idlecostas", true);
            }
          }
        }
      }

      this.caixa.setPosition(this.playerroxo.x, this.playerroxo.y);
      if (this.passos && this.passos.isPlaying) {
        this.passos.stop();
      }
      return;
    }



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
   /* if (this.fase5) {
      if (qe.E.isDown) {
        this.cameras.main.setBounds(10, 0, this.tilemap.widthInPixels);
        this.cameras.main.startFollow(this.player2, false, 1, 0).zoom = 1.2;
        this.lights.setAmbientColor(0x303030);

        this.cameras.main.scrollY = 2348 - this.cameras.main.height / 2 - 120;
      } else if (qe.Q.isDown) {
        this.cameras.main.startFollow(this.playerroxo, true, 0.1, 0.1);
        this.cameras.main.setBounds(
          24,
          24,
          this.tilemap.widthInPixels - 48,
          708,
        );
        this.lights.setAmbientColor(0xe0f7ff);
      } /*else if (qe.E.isUp) {
        this.lights.setAmbientColor(0xe0f7ff);
        this.cameras.main.startFollow(this.playerroxo, true, 0.1, 0.1).zoom =
          1.5;
      }
    }*/

    if (jkl.K.isDown) { this.disparo.play(); } 
    // Animações e som baseado no movimento
    const moving = Math.abs(horizontal) > 0.1 || Math.abs(vertical) > 0.1;

    if (moving) {
      if (!this.passos.isPlaying) this.passos.play();
    } else {
      if (this.passos.isPlaying) this.passos.stop();
    }
    if (!this.collectIa) {
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
       this.playerIcon.anims.play("playerIconVerde")

      if (horizontal > 0.1) {
        this.playerroxo.anims.play("andardireitaverde", true);
      } else if (horizontal < -0.1) {
        this.playerroxo.anims.play("andaresquerdaverde", true);
      } else if (vertical > 0.1) {
        this.playerroxo.anims.play("andarfrenteverde", true); // assumindo que "andarfrente" é para baixo
      } else if (vertical < -0.1) {
        this.playerroxo.anims.play("andarcostas", true);
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
          } else if (currentKey === "andarcostas") {
            this.playerroxo.anims.play("idlecostas", true);
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

        if (distance > 0) {
          if (Math.abs(dx) > Math.abs(dy)) {
            enemy.anims.play("enemyWalk", true);
            enemy.setFlipX(dx > 0);
            if (!enemy.flipX) {
              enemy.body.setSize(30, 37)
                  .setOffset(55, 17);
            } else if (enemy.flipX) {
              enemy.body.setSize(30, 37)
                  .setOffset(27, 17);
            }

          } else if (dy < 0) {
            enemy.anims.play("enemyWalkCima", true);
            enemy.setFlipX(false);
            enemy.body
                  .setOffset(33, 17);
          } else {
            enemy.anims.play("enemyWalkBaixo", true);
            enemy.setFlipX(false);
            enemy.body
                  .setOffset(33, 17);
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

    if (this.puzzleAberto) {
      this.puzzleAberto = false;
    }

    // Ativa invencibilidade e desativa colisão por 1 segundo
    this.invulnerable = true;
    this.colliderAliensBox.active = false;
    this.vida -= 1;
    this.updateSemicircleLifeBar();

    // Teletransporta playerroxo, destrói inimigos e bloqueia spawn por 1 segundo
    this.playerroxo.setPosition(111, 1573).setVelocity(0, 0);
    if (!this.collectIa) {
      this.playerroxo.anims.play("idlefrente", true);
    } else if (this.collectIa) {

      this.playerroxo.anims.play("idlefrenteverde", true);
    };

    if (this.puzzleAberto) {
      console.log("O Alien pegou o player! Fechando o puzzle ativo...");

      // 2. O "truque" está aqui: um loop que manda fechar TODOS da lista
      this.listaMinigames.forEach((minigame) => {
        this.scene.stop(minigame); // O Phaser só vai fechar o que estiver aberto de fato
      });
    }

    if (this.inimigosaliens) {
      // Cria uma cópia da lista de aliens vivos para não bugar enquanto deleta
      let aliensVivos = this.inimigosaliens.getChildren().slice();

      aliensVivos.forEach((alien) => {
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

  
  teletransporte2() {
    if (this.antenasconsertadas === 3) { 
    
      this.porta2.anims.play("portaabrindo", true);
      

      // Define a porta aberta como 4 no estado local e também envia para o servidor.
      this.abrirPorta(4);
      //this.fase5 = true;  
        
      this.playerroxo.setPosition(640, 651); // teletransporte para o interior da nave
      this.positionP2 = false;
      this.spawnAlienAleatorio();
      this.outShip = false;
        this.porta2.anims.play("portafechando", true);
        this.trilhasonora.play();
        this.respiracao.pause();
        this.batimentocardiaco.pause();
      
    
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

   destroyLaser(laser, limit) {
     laser.destroy();
    };

  webrtcMakeCall() {
    this.game.localConnection = new RTCPeerConnection(this.game.iceServers);

    this.game.localConnection.onicecandidate = ({ candidate }) => {
      this.game.socket.emit("candidate", this.game.room, candidate);
      console.log("emitcandidate")
    };

    this.game.localConnection.ontrack = ({ streams: [stream] }) => {
      this.game.audio.srcObject = stream;
      this.game.audio.volume = 1;
      this.game.audio.play().catch(error => {
          console.error("Erro ao tentar reproduzir o áudio:", error);
      });
    };

    if (this.game.media) {
      this.game.media
        .getTracks()
        .forEach((track) => {
          // 1. Adiciona a trilha na conexão
          this.game.localConnection.addTrack(track, this.game.media);
          
          // 2. Força o mudo inicial se for a trilha de áudio
          if (track.kind === 'audio') {
            track.enabled = false; 
            console.log("P2: Microfone iniciado no mudo.");
          }
        });
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
        console.log("offer")
      );

    this.game.socket.on("answer", (description) => {
      this.game.localConnection.setRemoteDescription(description);
    });

    this.game.socket.on("candidate", (candidate) => {
      this.game.localConnection.addIceCandidate(candidate);
       console.log("answer")
    });
  }
} //fim

export default scene1;
