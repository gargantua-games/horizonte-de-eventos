class scene0 extends Phaser.Scene {
  constructor() {
    super("scene0");

    this.direction = true;
    this.doubleJump = false;
    this.score = 0;
    this.fase3 = false;
    this.fase4 = false;
    this.fase5 = false;
    this.platMoviment = false;
    this.jetPack = false;
    this.energy = true;
    this.keys = null;
    this.cargaJp = 1000;
    this.cargaJPpercentage = this.cargaJp / 10;
    this.o2 = 100;
    this.o2Ship = true; 
    this.collectEng1 = false;
    this.collectEng2 = false;
    this.collectEng3 = false;
    this.collectEng5 = false;
    this.life = 10;
    this.canTakeDamage = true;
    this.enemyGravity = false;
    this.doorOpen = 0;
    this.bullet = true;
    this.platform12Interval = null;
    this.platform15Interval = null;
    this.movingTorreta = false;
    this.camP2 = true;
    this.movingP1 = true;
    this.bulletP1 = true;
    this.shooting = false;
    this.interecting = false;
    this.doubleInterecting = true;
    this.comunication = true;
    this.gameOver = false;
    this.painelJaAcionado = 0;
    this.esperandoInteracao = 0;
    this.inFinalDoorP1 = false;
    this.inFinalDoorP2 = false;
    this.infase = 1;
  }

  init() {
    this.webrtcAnswerCall();
  }

    GameOver() {
    if (this.gameOver === true || this.life <= 0) {
    this.gameOver = true;
    this.game.socket.emit("GameOver", this.game.room, {
      gameOver: this.gameOver,
    });
      
      this.scene.stop("scene0");
    this.scene.start("gameover1");
    }
    
  }

 startPlatformMovement() {
    if (!this.platMoviment) {
      return;
    }

    if (!this.platform12Interval) {
      this.platform12.setVelocityX(150);
      this.platform12Interval = setInterval(() => {
        if (this.platform12 && this.platMoviment) {
          this.platform12.setVelocityX(this.platform12.body.velocity.x * -1);
        }
      }, 2300);
    }

    if (!this.platform15Interval) {
      this.platform15.setVelocityX(150);
      this.platform15Interval = setInterval(() => {
        if (this.platform15 && this.platMoviment) {
          this.platform15.setVelocityX(this.platform15.body.velocity.x * -1);
        }
      }, 1300);
    }
  }

  stopPlatformMovement() {
    if (this.platform12Interval) {
      clearInterval(this.platform12Interval);
      this.platform12Interval = null;
    }
    if (this.platform15Interval) {
      clearInterval(this.platform15Interval);
      this.platform15Interval = null;
    }

    if (this.platform12) {
      this.platform12.setVelocityX(0);
    }
    if (this.platform15) {
      this.platform15.setVelocityX(0);
    }
  }

  create() {
    const pad =
      this.input.gamepad && this.input.gamepad.total > 0
        ? this.input.gamepad.getPad(0)
        : null;
    let horizontal = 0;
    let vertical = 0;
    let jumpPressed = false;
    let interectPressed = false;

    let comunicationPressed = false;

    // === ADICIONE ESTE TRECHO NO MÉTODO create() ===
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    // ===============================================
    this.disparo = this.sound.add("disparo", { volume: 0.7 });
    this.passos = this.sound.add("passos", { loop: true, volume: .9 });
    this.trilhasonora = this.sound.add("trilhasonora", {
      loop: true,
      volume: 0.3,
    });
    this.trilhasonora.play();

    this.space = this.add.image(0, 0, "space");
    this.space.setPipeline("Light2D").setOrigin(0, 0).setScrollFactor(0.1, 1);
    this.space = this.add.image(500, 3890, "space");
    this.space.setPipeline("Light2D");

    this.anims.create({
      key: "bigIaIdle",
      frames: this.anims.generateFrameNumbers("bigIa", {
        start: 0,
        end: 1,
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.bigIa = this.add
      .sprite(225, 60, "bigIa")
      .setPipeline("Light2D")
      .setOrigin(0, 0)
      .setScrollFactor(0.9, 1);
    this.bigIa.anims.play("bigIaIdle", true);

    this.anims.create({
      key: "gargantua-idle",
      frames: this.anims.generateFrameNumbers("gargantua", {
        start: 0,
        end: 49,
      }),
      frameRate: 14,
      repeat: -1,
    });

    this.blackHole = this.add.group({
      allowGravity: false,
      pipeline: "Light2D",
    });

    this.blackHole
      .create(650, 200, "gargantua") //873, 950 //400, 40
      .setScale(2)
      .setOrigin(0, 0)
      .setScrollFactor(0.33)
      .anims.play("gargantua-idle", true);

    this.blackHole
      .create(500, 430, "gargantua") //455, 1750 //200, 40
      .setScale(2)
      .setOrigin(0, 0)
      .setScrollFactor(0.33)
      .anims.play("gargantua-idle", true);

    this.tilemap = this.make.tilemap({ key: "todasfases" });

    this.tilesetRemasterized = this.tilemap.addTilesetImage("remasterized");
    this.tilesetRemasterizedEnfeites = this.tilemap.addTilesetImage(
      "remasterizedEnfeites",
    );
    this.tilesetSpace1 = this.tilemap.addTilesetImage("space");

    this.layerFundo = this.tilemap
      .createLayer("fundo", [
        this.tilesetRemasterized,
        this.tilesetRemasterizedEnfeites,
        this.tilesetSpace1,
      ])
      .setPipeline("Light2D")
      .setScrollFactor(0.9, 1);
    this.layerNave = this.tilemap
      .createLayer("nave", [this.tilesetRemasterized])
      .setPipeline("Light2D");
    //.setScrollFactor(0.9, 1);
    this.layerEnfeites = this.tilemap
      .createLayer("enfeites", [
        this.tilesetRemasterizedEnfeites,
        this.tilesetRemasterized,
      ])
      .setPipeline("Light2D")
      .setScrollFactor(0.9, 1);
    this.layerVidro = this.tilemap
      .createLayer("vidro", [this.tilesetRemasterized])
      .setPipeline("Light2D")
      .setScrollFactor(0.9, 1);
    this.layerVidroh = this.tilemap
      .createLayer("vidroh", [this.tilesetRemasterized])
      .setPipeline("Light2D")
      .setScrollFactor(0.9, 1);
    this.layerComp39 = this.tilemap
      .createLayer("comp39", [this.tilesetRemasterized])
      .setPipeline("Light2D")
      .setScrollFactor(0.9, 1);
    this.layerPiso = this.tilemap
      .createLayer("piso", [this.tilesetRemasterized])
      .setPipeline("Light2D")
      .setScrollFactor(0.9, 1);

    this.physics.world.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels,
    );

    this.cameras.main.setBounds(10, 0, this.tilemap.widthInPixels);

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
      key: "acionandoLuz",
      frames: this.anims.generateFrameNumbers("painelLuz", {
        start: 0,
        end: 15,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "acionandoO2",
      frames: this.anims.generateFrameNumbers("painelO2", {
        start: 0,
        end: 10,
      }),
      frameRate: 10,
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
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("player", { start: 42, end: 48 }),
      frameRate: 11,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("player", { start: 49, end: 55 }),
      frameRate: 11,
      repeat: -1,
    });

    this.anims.create({
      key: "idleRight",
      frames: this.anims.generateFrameNumbers("player", { start: 30, end: 31 }),
      frameRate: 3,
      repeat: -1,
    });

    this.anims.create({
      key: "idleLeft",
      frames: this.anims.generateFrameNumbers("player", { start: 28, end: 29 }),
      frameRate: 3,
      repeat: -1,
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player", { start: 38, end: 41 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "jumpL",
      frames: this.anims.generateFrameNumbers("player", { start: 33, end: 36 }),
      frameRate: 6,
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
      key: "faiscando",
      frames: this.anims.generateFrameNumbers("faisca", {
        start: 0,
        end: 8,
      }),
      frameRate: 8,
      repeat: -1,
    });

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
      key: "engrenagem-idlelaranja",
      frames: this.anims.generateFrameNumbers("engrenagem", {
        start: 0,
        end: 1,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "engrenagem-idleroxo",
      frames: this.anims.generateFrameNumbers("engrenagem", {
        start: 2,
        end: 3,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "engrenagem-idlerosa",
      frames: this.anims.generateFrameNumbers("engrenagem", {
        start: 4,
        end: 5,
      }),
      frameRate: 2,
      repeat: -1,
    });

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
      key: "engrenagem-icon",
      frames: this.anims.generateFrameNumbers("engrenagem", {
        start: 8,
        end: 9,
      }),
      frameRate: 2,
      repeat: 1,
    });

    this.anims.create({
      key: "jetBag-idle",
      frames: this.anims.generateFrameNumbers("jetBag", {
        start: 0,
        end: 1,
      }),
      frameRate: 3,
      repeat: -1,
    });

    this.anims.create({
      key: "box-idle",
      frames: this.anims.generateFrameNumbers("box", {
        start: 0,
        end: 3,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "box-idle1",
      frames: this.anims.generateFrameNumbers("box", {
        start: 3,
        end: 0,
      }),
      frameRate: 2,
      repeat: -1,
    });

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
      key: "enemyAtack",
      frames: this.anims.generateFrameNumbers("inimigo", {
        start: 2,
        end: 5,
      }),
      frameRate: 13,
      repeat: 0,
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

    this.laser = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.laserP1 = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.jetBag = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.engrenagens = this.physics.add.group({
      allowGravity: false,
      immovable: true,
      pipeline: "Light2D",
    });

    this.engrenagem1 = this.engrenagens
      .create(1138, 965, "engrenagem")
      .setScale(0.7)
      .anims.play("engrenagem-idlelaranja", true);

    this.engrenagem2 = this.engrenagens
      .create(1059, 1652, "engrenagem")
      .setScale(0.7)
      .anims.play("engrenagem-idleroxo", true);

    this.engrenagem3 = this.engrenagens
      .create(1209, 2604, "engrenagem")
      .setScale(0.7)
      .anims.play("engrenagem-idlerosa", true);

    this.engrenagem5 = this.engrenagens
      .create(531, 3340, "engrenagem")
      .setScale(0.7)
      .setPipeline("Light2D")
      .anims.play("engrenagem-idleciano", true);

    this.anims.create({
      key: "iaSpeak",
      frames: this.anims.generateFrameNumbers("iaBox", {
        start: 0,
        end: 1,
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.boxes = this.physics.add.group({
      allowGravity: false,
      immovable: true,
      pipeline: "Light2D",
    });

    this.boxes
      .create(319, 2400, "box")
      .setAngle(10)
      .anims.play("box-idle", true)
      .body.setSize(36, 58);
    this.boxes
      .create(244, 2530, "box")
      .setAngle(-10)
      .anims.play("box-idle1", true)
      .body.setSize(36, 58);
    this.boxes
      .create(394, 2490, "box")
      .setAngle(5)
      .anims.play("box-idle", true)
      .body.setSize(36, 58);
    this.boxes
      .create(504, 2556, "box")
      .setAngle(-5)
      .anims.play("box-idle1", true)
      .body.setSize(36, 58);
    this.boxes
      .create(571, 2416, "box")
      .setAngle(10)
      .anims.play("box-idle1", true)
      .body.setSize(36, 58);
    this.boxes
      .create(634, 2446, "box")
      .setAngle(10)
      .anims.play("box-idle", true)
      .body.setSize(36, 58);
    this.boxes
      .create(679, 2580, "box")
      .setAngle(10)
      .anims.play("box-idle1", true)
      .body.setSize(36, 58);
    this.boxes
      .create(769, 2502, "box")
      .setAngle(-10)
      .anims.play("box-idle", true)
      .body.setSize(36, 58);
    this.boxes
      .create(849, 2377, "box")
      .setAngle(7)
      .anims.play("box-idle1", true)
      .body.setSize(36, 58);
    this.boxes
      .create(895, 2558, "box")
      .setAngle(5)
      .anims.play("box-idle", true)
      .body.setSize(36, 58);
    this.boxes
      .create(1064, 2479, "box")
      .setAngle(-7)
      .anims.play("box-idle1", true)
      .body.setSize(36, 58);
    this.boxes
      .create(977, 2430, "box")
      .setAngle(-10)
      .anims.play("box-idle", true)
      .body.setSize(36, 58);
    this.boxes
      .create(192, 2604, "box") //RAFAEL
      .anims.play("box-idle", true)
      .setAngle(90)
      .body.setSize(57, 38);
    this.boxes
      .create(327, 2604, "box")
      .setAngle(-90)
      .anims.play("box-idle1", true)
      .body.setSize(57, 38);
    this.boxes
      .create(1155, 2604, "box")
      .setAngle(90)
      .anims.play("box-idle", true)
      .body.setSize(57, 38);
    //*BOTAR UMAS 15 CARGAS NO JETPACK*

    this.cai = this.physics.add.sprite(500, 1160, "cai");
    this.cai
      .setImmovable(true)
      .setPipeline("Light2D")
      .setSize(1000, 8).body.allowGravity = false;

    //porta N da fase N
    this.door11 = this.physics.add.sprite(92, 1056, "door", 0);
    this.door11
      .setScrollFactor(0.95, 1)
      .setPipeline("Light2D").body.allowGravity = false;

    this.door21 = this.physics.add.sprite(430, 897, "door", 0);
    this.door21
      .setScrollFactor(0.95, 1)
      .setPipeline("Light2D").body.allowGravity = false;

    this.door12 = this.physics.add.sprite(108, 1825, "door", 7);
    this.door12
      .setScrollFactor(0.95, 1)
      .setPipeline("Light2D").body.allowGravity = false;

    this.door22 = this.physics.add.sprite(1185, 1825, "door", 0);
    this.door22
      .setScrollFactor(0.95, 1)
      .setPipeline("Light2D").body.allowGravity = false;

    this.door13 = this.physics.add.sprite(69, 2496, "door", 7);
    this.door13
      .setScrollFactor(0.95, 1)
      .setPipeline("Light2D").body.allowGravity = false;

    this.door23 = this.physics.add.sprite(1224, 2432, "door", 0);
    this.door23
      .setScrollFactor(0.95, 1)
      .setPipeline("Light2D").body.allowGravity = false;

    this.door14 = this.physics.add.sprite(92, 288, "door", 7);
    this.door14
      .setScrollFactor(0.95, 1)
      .setPipeline("Light2D").body.allowGravity = false;

    this.door24 = this.physics.add.sprite(1152, 288, "door", 0);
    this.door24
      .setScrollFactor(0.95, 1)
      .setPipeline("Light2D").body.allowGravity = false;

    this.door15 = this.physics.add.sprite(92, 3520, "door", 7);
    this.door15
      .setScrollFactor(0.95, 1)
      .setPipeline("Light2D").body.allowGravity = false;

    this.door25 = this.physics.add.sprite(1152, 3520, "door", 0);
    this.door25
      .setScrollFactor(0.95, 1)
      .setPipeline("Light2D").body.allowGravity = false;
    
    this.porta2 = this.add.sprite(55, (1573 + 2624), "porta", 0);
    this.porta2.setAngle(90)

    this.platforms = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.platforms
      .create(431, 930, "plataformG")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platforms
      .create(1059, 1666, "plataformG")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    //cria plataforma 1 e defne como imovível e de velocidade x = 100 além de fazê-la ignorar a gravidade680, 1094
    this.platform1 = this.physics.add.sprite(680, 1094, "plataform");
    this.platform1
      .setImmovable(true)
      .setVelocityX(-100)
      .setPipeline("Light2D").body.allowGravity = false;

    setInterval(() => {
      this.platform1.setVelocityX(this.platform1.body.velocity.x * -1);
    }, 3000);

    //num intervalo de 3400ms, inverte a velocidade da plataforma 1

    this.platforms
      .create(1140, 980, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platforms
      .create(160, 1710, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platforms
      .create(220, 3365, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platform51 = this.platforms
      .create(115, 3420, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platform52 = this.platforms
      .create(769, 3495, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platform53 = this.platforms
      .create(841, 3400, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platform54 = this.platforms
      .create(1230, 3375, "plataform")
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D");

    this.platform3 = this.physics.add.sprite(1050, 935, "plataform");
    this.platform3
      .setImmovable(true)
      .setVelocityX(-150)
      .setPipeline("Light2D").body.allowGravity = false;

    setInterval(() => {
      this.platform3.setVelocityX(this.platform3.body.velocity.x * -1);
    }, 3490);

    this.platform4 = this.physics.add.sprite(855, 1796, "plataform");
    this.platform4
      .setImmovable(true)
      .setVelocityX(120)
      .setPipeline("Light2D").body.allowGravity = false;

    setInterval(() => {
      this.platform4.setVelocityX(this.platform4.body.velocity.x * -1);
    }, 1500);

    this.platform5 = this.physics.add.sprite(802, 1764, "plataform");
    this.platform5
      .setImmovable(true)
      .setVelocityX(-150)
      .setPipeline("Light2D").body.allowGravity = false;
    setInterval(() => {
      this.platform5.setVelocityX(this.platform5.body.velocity.x * -1);
    }, 1000);

    this.platform6 = this.physics.add.sprite(640, 1732, "plataform");
    this.platform6
      .setImmovable(true)
      .setPipeline("Light2D")
      .setVelocityX(-150).body.allowGravity = false;
    setInterval(() => {
      this.platform6.setVelocityX(this.platform6.body.velocity.x * -1);
    }, 2300);

    this.platform8 = this.physics.add.sprite(560, 1640, "plataform");
    this.platform8
      .setImmovable(true)
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D")
      .setVelocityX(-150).body.allowGravity = false;
    setInterval(() => {
      this.platform8.setVelocityX(this.platform8.body.velocity.x * -1);
    }, 2400);

    this.platform9 = this.physics.add.sprite(625, 1640, "plataform");
    this.platform9
      .setImmovable(true)
      .setVelocityX(150)
      .setPipeline("Light2D").body.allowGravity = false;
    setInterval(() => {
      this.platform9.setVelocityX(this.platform9.body.velocity.x * -1);
    }, 2400);

    this.platform12 = this.physics.add.sprite(340, 3425, "plataform");
    this.platform12
      .setImmovable(true)
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D").body.allowGravity = false;

    this.platform15 = this.physics.add.sprite(955, 3375, "plataform");
    this.platform15
      .setImmovable(true)
      .setScrollFactor(0.99, 1)
      .setPipeline("Light2D").body.allowGravity = false;

    this.painelLuz = this.physics.add.sprite(340, 3396, "painelLuz");
    this.painelLuz
      .setImmovable(true)
      .setScale(0.3)
      .setPipeline("Light2D")
      .setScrollFactor(0.9, 1).body.allowGravity = false;

    this.bigPainelLuz = this.add.sprite(340, 3396, "painelLuz");
    this.bigPainelLuz.setScale(4).setDepth(999).setVisible(false);

    this.invisibleH2 = this.physics.add.sprite(475, 870, "invisibleH");
    this.invisibleH2
      .setImmovable(true)
      .setPipeline("Light2D")
      .setScale(0.5).body.allowGravity = false;

    this.invisibleH = this.physics.add.sprite(942, 1020, "invisibleH");
    this.invisibleH
      .setImmovable(true)
      .setPipeline("Light2D")
      .setScale(0.5).body.allowGravity = false;

    this.painelO2 = this.physics.add.sprite(1231, 3351, "painelO2");
    this.painelO2
      .setImmovable(true)
      .setScale(0.3)
      .setScrollFactor(0.9, 1)
      .setPipeline("Light2D").body.allowGravity = false;

    this.bigPainelO2 = this.add.sprite(1080, 3396, "painelO2");
    this.bigPainelO2.setScale(4).setDepth(999).setVisible(false);

    this.invisible3 = this.physics.add.sprite(540, 300, "invisible");
    this.invisible3
      .setImmovable(true)
      .setPipeline("Light2D").body.allowGravity = false;

    this.anims.create({
      key: "torretaidle",
      frames: this.anims.generateFrameNumbers("torreta", {
        start: 0,
        end: 5,
      }),
      frameRate: 4,
      repeat: 0,
    });

    this.torreta = this.physics.add.sprite(540, 1584, "torreta", 0);
    this.torreta.setPipeline("Light2D").setImmovable(true).setScale(1.5);
    this.torreta.body.allowGravity = false;



    setInterval(() => {
      if (this.o2 < 100 && this.o2Ship === true) {
        this.o2 += 1;
        this.o2Text.setText("Oxigênio: " + this.o2 + "%");
        this.updateO2Bar();
      } else if (this.o2 > 0 && this.o2Ship === false) {
        this.o2 -= 1;
        this.o2Text.setText("Oxigênio: " + this.o2 + "%");
        this.updateO2Bar();
      } else if (this.o2 === 0) {
        this.player
          .setPosition(92, 3532)
          .setVelocity(0, 0)
          .anims.play("idleRightJP");

        this.painelJaAcionado = 0;
        this.esperandoInteracao = 0;
        if (this.bigPainelLuz.visible) {
          this.bigPainelLuz.setVisible(false);
        }

        if (this.bigPainelO2.visible) {
          this.bigPainelO2.setVisible(false);
        }

        this.o2 = 100;
        this.o2Text.setText("Oxigênio: " + this.o2 + "%");
        this.updateO2Bar();
        this.direction = true;
        if (this.collectEng5) {
          this.engrenagem5.enableBody(true, 531, 3340, true, true);

          this.score -= 1;
          this.collectEng5 = false;
          this.scoreText.setText(this.score + "/4");
        }

        this.platMoviment = false;
        this.stopPlatformMovement();
        this.life -= 1;
      }
    }, 500);

    this.light21 = this.lights
      .addLight(this.door21.x, this.door21.y - 20, 40)
      .setIntensity(1.5)
      .setScrollFactor(0.95, 1)
      .setColor(0xff0000);

    this.lights
      .addLight(this.door11.x, this.door11.y - 20, 40)
      .setIntensity(1.5)
      .setScrollFactor(0.95, 1)
      .setColor(0xff0000);

    this.light12 = this.lights
      .addLight(this.door12.x, this.door12.y - 20, 40)
      .setIntensity(1.5)
      .setScrollFactor(0.95, 1)
      .setColor(0x90ee90);

    this.light22 = this.lights
      .addLight(this.door22.x, this.door22.y - 20, 40)
      .setIntensity(1.5)
      .setScrollFactor(0.95, 1)
      .setColor(0xff0000);

    this.light13 = this.lights
      .addLight(this.door13.x, this.door13.y - 20, 40)
      .setIntensity(1.5)
      .setScrollFactor(0.95, 1)
      .setColor(0x90ee90);

    this.light23 = this.lights
      .addLight(this.door23.x, this.door23.y - 20, 40)
      .setIntensity(1.5)
      .setScrollFactor(0.95, 1)
      .setColor(0xff0000);

    this.light14 = this.lights
      .addLight(this.door14.x, this.door14.y - 20, 40)
      .setIntensity(1.5)
      .setScrollFactor(0.95, 1)
      .setColor(0x90ee90);

    this.light24 = this.lights
      .addLight(this.door24.x, this.door24.y - 20, 40)
      .setIntensity(1.5)
      .setScrollFactor(0.95, 1)
      .setColor(0xff0000);

    this.light15 = this.lights
      .addLight(this.door15.x, this.door15.y - 20, 40)
      .setIntensity(1.5)
      .setScrollFactor(0.95, 1)
      .setColor(0x90ee90);

    this.light25 = this.lights
      .addLight(this.door25.x, this.door25.y - 20, 40)
      .setIntensity(1.5)
      .setScrollFactor(0.95, 1)
      .setColor(0xff0000);

    this.iaBox = this.physics.add.sprite(1009, 33, "iaBox");
    this.iaBox
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .anims.play("iaSpeak", true).body.allowGravity = false;

    const texto = " ";
    const texto1 = "Olá, eu sou ... e estou aqui para\najudar vocês a sairem daqui.";
    const texto2 = "Você pode saltar nas paredes para\nir mais alto.";
    const texto3 = "Você pode coletar os crachás para\nconseguir uma fuga melhor.";
    const texto4 = "Porém mesmo que você não consiga\ncoletar os crachás vocês conseguem\nfugir daqui.";
    const texto5 = "Fuja deste alien até que o Roxo\nelimine ele.";
    const texto6 = "Assim você pode pegar o jetpack\ndele e para passar pela próxima\nsala.";
    const texto7 = "Esta sala esta com uma anomalia\ngravitacional, é bom você usar\no jetpack";
    const texto8 = "Tome cuidado com os RTG's nesta\nsala eles estão sobreaquecidos";
    const texto9 = "Os aliens cortaram as comunicações. Rápido! Use\na torreta através destes computadores para ajudar\no Roxo enquanto ele restabelece a comunicação."
   const texto10 = "Cuidado! Os aliens desligaram\nas luzes e o seu oxigênio."
    this.iaText = this.add
      .text(735, 38, texto, { font: "13px", fill: "#fffc51" })
      .setScrollFactor(0)
      .setPipeline("Light2D")
      .setOrigin(0, 0);
    this.iaTypingEvent = null;

    this.bigIaText = this.add
      .text(257, 65, texto9, { font: "19px", fill: "#fffc51" })
      .setPipeline("Light2D")
      .setOrigin(0, 0)
      .setScrollFactor(0.9, 1);
    this.iaTypingEvent = null;

    this.player = this.physics.add.sprite(92, 1066, "player", 3); //fase1:92, 1066/445, 911//fase2:108, 1836/1138, 1836//fase3: 69, 2496/1256,2356//fase4: 92,300//fase5:92, 3532//
    this.player.body.setSize(20, 40);
    this.cameras.main.startFollow(this.player, false, 1, 0).zoom = 1.2;
    this.cameras.main.scrollY =
      this.player.y - this.cameras.main.height / 2 - 120; // Ajuste para começar mais para cima (100 pixels acima do centro do jogador)
    this.player.anims.play("idleRight", true).setPipeline("Light2D");

    this.antenas = this.add.group({
      immovable: true,
      pipeline: "Light2D",
    });

    this.antenas.create(537, 3948, "NewPiskel").setScale(-1, 1);
    this.antenas.create(880, 3979, "NewPiskel").setScale(-1, 1);
    this.antenas.create(1170, 3951, "NewPiskel").setScale(-1, 1);
    this.antenas.create(820, 4044, "NewPiskel").setScale(-1, 1);
    this.antenas.create(433, 4107, "NewPiskel").setScale(-1, 1);
    this.antenas.create(880, 4138, "NewPiskel").setScale(-1, 1);
    this.antenas.create(175, 4170, "NewPiskel").setScale(-1, 1);
    this.antenas.create(207, 3987, "telescopio");
    this.antenas.create(338, 4211, "telescopio");
    this.antenas.create(1107, 4114, "telescopio");
    this.antenas.create(626, 4024, "osciloscopio");
    this.antenas.create(980, 4184, "osciloscopio");

    this.player2 = this.add.sprite(92, 3890, "playerroxo", 3);
    this.player2.setPipeline("Light2D");

    this.faisca1 = this.add.sprite(175, (1546 + 2624), "faisca");
    this.faisca1.anims.play("faiscando");
    this.faisca1.setScale(2);
    
    this.faisca2 = this.add.sprite(820, (1420 + 2624), "faisca");
    this.faisca2.anims.play("faiscando");
    this.faisca2.setScale(2); 
    
    this.faisca3 = this.add.sprite(1107, (1490 + 2624), "faisca");
    this.faisca3.anims.play("faiscando").setScale(2);
    this.faisca3.setVisible(false);
    
    this.faisca4 = this.add.sprite(433, (1468 + 2624), "faisca");
    this.faisca4.anims.play("faiscando");
    this.faisca4.setScale(2);

    this.cannon = this.physics.add.sprite(656, 4320, "torreta");
    this.cannon.setPipeline("Light2D").setAngle(180).setScale(1.5).
      body.allowGravity = false;
    
    this.cannon.setCollideWorldBounds(true);

    this.limitenorte = this.physics.add.sprite(670, (1324 + 2624), "bigboss"); //662, 1347 667 1460
    this.limitenorte.setImmovable(true);
    this.limitenorte.setSize(1280, 17);

    this.inimigosaliens = this.add.group({
      immovable: false,
      pipeline: "Light2D",
    });

    //inimigo
    this.inimigo = this.physics.add.sprite(595, 1584, "inimigo", 14);
    this.inimigo
      .setPipeline("Light2D")
      .body.setSize(30, 37)
      .setOffset(36, 17).allowGravity = false;

    this.lamp = this.lights
      .addLight(this.player.x, this.player.y, 40)
      .setIntensity(0)
      .setColor(0xf5f5f5);


    this.createSemicircleLifeBar();

    this.physics.add.overlap(
      this.player,
      this.engrenagens,
      this.collectEng,
      null,
      this,
    );

    this.physics.add.overlap(this.player, this.engrenagem1, () => {
      this.engrenagem1.disableBody(true, true);
      this.collectEng1 = true;
    });
    this.physics.add.overlap(this.player, this.engrenagem2, () => {
      this.engrenagem2.disableBody(true, true);
      this.collectEng2 = true;
    });
    this.physics.add.overlap(this.player, this.engrenagem3, () => {
      this.engrenagem3.disableBody(true, true);
      this.collectEng3 = true;
    });
    this.physics.add.overlap(this.player, this.engrenagem5, () => {
      this.engrenagem5.disableBody(true, true);
      this.collectEng5 = true;
    });

    // Overlap entre inimigo e player //voltar
    this.physics.add.overlap(
      this.player,
      this.inimigo,
      this.enemyAt,
      null,
      this,
    );

    this.physics.add.collider(this.player, this.layerPiso);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.platform1);
    this.physics.add.collider(this.player, this.platform3);
    this.physics.add.collider(this.player, this.platform4);
    this.physics.add.collider(this.player, this.platform5);
    this.physics.add.collider(this.player, this.platform6);
    this.physics.add.collider(this.player, this.platform8);
    this.physics.add.collider(this.player, this.platform9);
    this.physics.add.collider(this.player, this.platform12);
    this.physics.add.collider(this.player, this.platform15);

    this.physics.add.collider(this.torreta, this.layerPiso);

    //inimigo
    this.physics.add.collider(this.inimigo, this.layerPiso);

    this.physics.add.collider(this.laser, this.layerPiso, this.laserFloor, null, this);
    this.physics.add.collider(this.laserP1, this.layerPiso, this.laserFloor, null, this);
    this.physics.add.collider(this.laserP1, this.limitenorte, this.laserFloor, null, this);

    this.physics.add.collider(this.laser, this.inimigo, () => {
      this.inimigo.disableBody(true, true);
      this.laser.clear(true, true);
      this.jetBag
        .create(this.inimigo.x, this.inimigo.y, "jetBag")
        //.setScrollFactor(0.9, 1)
        .setPipeline("Light2D")
        .anims.play("jetBag-idle", true)
        this.physics.add.collider(this.jetBag, this.layerPiso);
    });
      
  

    this.physics.add.overlap(this.player, this.painelLuz, () => {
      if (this.painelJaAcionado === 1) return;
      this.painelJaAcionado = 1;

      this.painelLuz.disableBody(true, false);
      this.bigPainelLuz.setVisible(true);

      this.movingP1 = false;
      this.player.setVelocity(0);
      this.esperandoInteracao = 1;
    });

    this.physics.add.overlap(this.player, this.painelO2, () => {
      if (this.painelJaAcionado === 2) return;
      this.painelJaAcionado = 2;

      this.painelO2.disableBody(true, false);
      this.bigPainelO2.setVisible(true);

      this.movingP1 = false;
      this.player.setVelocity(0);
      this.esperandoInteracao = 2;
    });

    this.physics.add.overlap(this.player, this.invisibleH, () => {
      this.invisibleH.disableBody(true, true);
      this.iaBox.setVelocityX(-100);

      setTimeout(() => {
        this.iaBox.setVelocityX(0);

        this.typeIaText(texto1, 50, () => {
          this.time.delayedCall(1000, () => {
            this.typeIaText(texto2, 50, () => {
              this.time.delayedCall(1000, () => {
                this.typeIaText(texto3, 50, () => {
                  this.time.delayedCall(1000, () => {
                    this.typeIaText(texto4, 50);
                  });
                });
              });
            });
          });
        });
      }, 3237);
    });

    this.physics.add.overlap(this.player, this.invisibleH2, () => {
      this.invisibleH2.disableBody(true, true);
      //this.iaBox.anims.stop();

      this.typeIaText(texto, 50);
     
        this.iaBox.setVelocityX(100);
      
    });

    this.physics.add.overlap(
      this.player,
      this.jetBag,
      this.collectBag,
      null,
      this,
    );

    this.physics.add.overlap(this.player, this.boxes, () => {
      this.player
        .setPosition(82, 2508)
        .setVelocity(0, 0)
        .anims.play("idleRight");
      this.direction = true;
      this.life -= 1;
      this.updateSemicircleLifeBar();
      this.cargaJp = 1000;
      this.cargaJPpercentage = 100;
      this.cargaJpText.setText(
        [...this.cargaJPpercentage.toString(), "%"].join("\n"),
      );
      this.updateCargaBar();
      if (this.collectEng3 === true) {
        this.score -= 1;
        this.engrenagem3.enableBody(true, 1209, 2604, true, true);
        this.collectEng3 = false;
        this.scoreText.setText(this.score + "/4");
      }
    });

    this.physics.add.overlap(this.player, this.cai, () => {
      this.player
        .setPosition(92, 1066)
        .setVelocity(0, 0)
        .anims.play("idleRight");

      this.life -= 1;
      this.updateSemicircleLifeBar();
      this.iaBox.setPosition(1009, 33).setVelocityX(0);
      this.typeIaText(texto, 50);

      this.invisibleH.enableBody(true, 942, 1020, true, true);
      this.invisibleH2.enableBody(true, 475, 870, true, true);

      this.direction = true;
      if (this.collectEng1 === true) {
        this.score -= 1;
        this.engrenagem1.enableBody(true, 1138, 968, true, true);
        this.collectEng1 = false;
        this.scoreText.setText(this.score + "/4");
      }
    });

    this.physics.add.overlap(this.player, this.door12, () => {
      this.movingP1 = true;
    });

    this.physics.add.overlap(this.player, this.door13, () => {
      this.movingP1 = true;
    });

    this.physics.add.overlap(this.player, this.door14, () => {
      this.movingP1 = true;
    });

    this.physics.add.overlap(this.player, this.door15, () => {
      this.movingP1 = true;
    });

    this.physics.add.overlap(this.player, this.door21, () => {
      if (this.doorOpen === 1) {
        setTimeout(() => {
          this.movingP1 = false;
        }, 200);
        this.player.setVelocity(0, 100);
        if (this.direction) {
          this.player.anims.play("idleRight", true);
        } else if (!this.direction) {
          this.player.anims.play("idleLeft", true);
        }

        this.door21.anims.play("open-door", true);
        this.light21.setColor(0x90ee90);

        this.door21.once("animationcomplete", (anim, frame) => {
          if (anim.key === "open-door") {
            this.iaBox.setPosition(1009, 33).setVelocityX(0);
            this.player
              .setPosition(108, 1835)
              .setVelocity(0, 0)
              .anims.play("idleRight");
            this.infase = 2;
            try {
              this.game.socket.emit("scene0", this.game.room, {
                infase: this.infase,
              });
            } catch (e) {
              console.error("Error updating player:", e);
            }
            this.direction = true;
            this.enemyGravity = true;
            this.cameras.main.scrollY =
              this.player.y - this.cameras.main.height / 2 - 120;
            this.door12.anims.play("close-door", true);
            
            this.iaBox.setPosition(1009, 33)
              .setVelocityX(-100);
            setTimeout(() => {
              this.iaBox.setVelocityX(0);

              this.typeIaText(texto5, 50, () => {
                this.time.delayedCall(800, () => {
                  this.typeIaText(texto6, 50, () => {
                    this.time.delayedCall(800, () => {
                      this.typeIaText(texto, 50);
                      this.iaBox.setVelocityX(100);
                    });
                  });
                });
              });
              }, 3237);

              this.door12.once("animationcomplete", (anim, frame) => {
                if (anim.key === "close-door") {
                  this.light12.setColor(0xff0000);
                }
              });
            }
          });
      }
    });

    this.physics.add.overlap(this.player, this.door22, () => {
      if (this.jetPack && this.doorOpen >= 2) {
        setTimeout(() => {
          this.movingP1 = false;
        }, 200);
        this.player.setVelocity(0, 100);
        if (this.direction) {
          this.player.anims.play("idleRightJP", true);
        } else if (!this.direction) {
          this.player.anims.play("idleLeftJP", true);
        }
        this.door22.anims.play("open-door", true);
        this.light22.setColor(0x90ee90);

        this.door22.once("animationcomplete", (anim, frame) => {
          if (anim.key === "open-door") {
            this.player
              .setPosition(69, 2508)
              .setVelocity(0, 0)
              .anims.play("idleRightJP");
            this.infase = 3;
            try {
              this.game.socket.emit("scene0", this.game.room, {
                infase: this.infase,
              });
            } catch (e) {
              console.error("Error updating player:", e);
            }
            this.direction = true;
            this.cameras.main.scrollY =
              this.player.y - this.cameras.main.height / 3.8 - 120;
            this.fase3 = true;
            this.door13.anims.play("close-door", true);

            this.iaBox.setPosition(1009, 33)
              .setVelocityX(-100);
            setTimeout(() => {
              this.iaBox.setVelocityX(0);

              this.typeIaText(texto7, 50, () => {
                this.time.delayedCall(800, () => {
                  this.typeIaText(texto8, 50, () => {
                    this.time.delayedCall(800, () => {
                      this.typeIaText(texto, 50);
                      this.iaBox.setVelocityX(100);
                    });
                  });
                });
              });
            }, 3237);
            
            this.door13.once("animationcomplete", (anim, frame) => {
              if (anim.key === "close-door") {
                this.light13.setColor(0xff0000);
              }
            });
          }
        });
      }
    });

    this.physics.add.overlap(this.player, this.door23, () => {
      if (this.doorOpen >= 3) {
        setTimeout(() => {
          this.movingP1 = false;
        }, 200);
        this.player.setVelocity(0, 100);
        if (this.direction) {
          this.player.anims.play("idleRightJP", true);
        } else if (!this.direction) {
          this.player.anims.play("idleLeftJP", true);
        }
        this.door23.anims.play("open-door", true);
        this.light23.setColor(0x90ee90);
        this.door23.once("animationcomplete", (anim, frame) => {
          if (anim.key === "open-door") {
            this.player
              .setPosition(92, 300)
              .setVelocity(0, 0)
              .setAngle(0)
              .anims.play("idleRightJP");
            this.direction = true;
            this.cameras.main.scrollY =
              this.player.y - this.cameras.main.height / 2 - 120;
            this.fase3 = false;
            this.infase = 4;
            this.fase4 = true;
            this.comunication = false;
                
            try {
              this.game.socket.emit("scene0", this.game.room, {
                infase: this.infase,
                fase4: this.fase4,
                comunication: this.comunication,
              });
            } catch (e) {
              console.error("Error updating player:", e);
            }
            this.cargaJp = 0;
            this.updateCargaBar();
            this.door14.anims.play("close-door", true);
            
            this.door14.once("animationcomplete", (anim, frame) => {
              if (anim.key === "close-door") {
                this.light14.setColor(0xff0000);
               
              }
            });
          }
        });
      }
    });

    this.physics.add.overlap(this.player, this.door24, () => {
      if (this.doorOpen >= 4) {
        setTimeout(() => {
          this.movingP1 = false;
        }, 200);
        this.player.setVelocity(0, 100);
        if (this.direction) {
          this.player.anims.play("idleRightJP", true);
        } else if (!this.direction) {
          this.player.anims.play("idleLeftJP", true);
        }
        this.door24.anims.play("open-door", true);
        this.light24.setColor(0x90ee90);
        this.door24.once("animationcomplete", (anim, frame) => {
          if (anim.key === "open-door") {
            this.energy = false;
            this.fase5 = true;
            this.stopPlatformMovement();
            this.o2Ship = false;
            try {
              this.game.socket.emit("scene0", this.game.room, {
                fase5: {
                  key: this.fase5,
                },
              });
            } catch (e) {
              console.error("Error updating player:", e);
            }
            this.player
              .setPosition(92, 3532)
              .setVelocity(0, 0)
              .anims.play("idleRightJP");
            this.infase = 5;
            try {
              this.game.socket.emit("scene0", this.game.room, {
                infase: this.infase,
              });
            } catch (e) {
              console.error("Error updating player:", e);
            }
            this.direction = true;
            this.cameras.main.scrollY =
              this.player.y - this.cameras.main.height / 2 - 120;
            this.lamp.setIntensity(0.95);

            this.door15.anims.play("close-door", true);
            if(this.collectIa){

            this.iaBox.setPosition(1009, 33)
              .setVelocityX(-100);
            setTimeout(() => {
              this.iaBox.setVelocityX(0);

              this.typeIaText(texto10, 50, () => {
                this.time.delayedCall(800, () => {
                  this.iaBox.setVelocityX(100);
                });
              });
            }, 3237);
          }
            
            this.door15.once("animationcomplete", (anim, frame) => {
              if (anim.key === "close-door") {
                this.light15.setColor(0xff0000);
              }
            });
          }
        });
      }
    });

    this.physics.add.overlap(this.player, this.door25, () => {
      if (this.doorOpen >= 5) {
        setTimeout(() => {
          this.movingP1 = false;
        }, 200);
        this.player.setVelocity(0, 100);
        if (this.direction) {
          this.player.anims.play("idleRightJP", true);
        } else if (!this.direction) {
          this.player.anims.play("idleLeftJP", true);
        }

        this.inFinalDoorP1 = true;

        this.door25.anims.play("open-door", true);
        this.light25.setColor(0x90ee90);

        this.door25.once("animationcomplete", (anim, frame) => {
          if (anim.key === "open-door") {
            this.door25.disableBody(true);
            this.door25.setFrame("7");
          }
        });
      }
    });

    this.layerPiso.setCollisionByProperty({ collides: true });

    // Texto de posição do player atualizado a cada segund
    const hudBarX = 170;
    const hudBarY = 43;
    const hudBarWidth = 12;
    const hudBarHeight = 80;
    const hudBarInnerWidth = hudBarWidth - 4;
    const hudBarInnerHeight = hudBarHeight - 4;

    this.o2BarBackground = this.add
      .rectangle(hudBarX, hudBarY, hudBarWidth, hudBarHeight, 0x888888, 0.5)
      .setOrigin(0, 0)
      .setScrollFactor(0);

    this.o2Bar = this.add
      .rectangle(
        hudBarX + 2,
        hudBarY + 2,
        hudBarInnerWidth,
        hudBarInnerHeight,
        0x0082e6,
      )
      .setOrigin(0, 0)
      .setScrollFactor(0);

    this.o2BarBorder = this.add
      .rectangle(hudBarX, hudBarY, hudBarWidth, hudBarHeight)
      .setStrokeStyle(2, 0x000000)
      .setOrigin(0, 0)
      .setScrollFactor(0);

    this.o2Text = this.add
      .text(
        hudBarX + 2,
        hudBarY + 15,
        [...this.o2.toString(), "%"].join("\n"),
        {
          fontSize: "10px",
          fontFamily: "sarpanch",
          fill: "#000000",
          align: "center",
        },
      )
      .setScrollFactor(0)
      .setOrigin(0, 0);

    const cargaX = hudBarX + hudBarWidth + 8;
    const cargaY = hudBarY;

    this.cargaBarBackground = this.add
      .rectangle(cargaX, cargaY, hudBarWidth, hudBarHeight, 0x888888, 0.5)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setVisible(false);

    this.cargaBar = this.add
      .rectangle(
        cargaX + 2,
        cargaY + 2,
        hudBarInnerWidth,
        hudBarInnerHeight,
        0x039600,
      )
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setVisible(false);

    this.cargaBarBorder = this.add
      .rectangle(cargaX, cargaY, hudBarWidth, hudBarHeight)
      .setStrokeStyle(2, 0x000000)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setVisible(false);

    this.cargaJpText = this.add
      .text(
        cargaX + 2,
        cargaY + 15,
        [...this.cargaJPpercentage.toString(), "%"].join("\n"),
        {
          fontSize: "10px",
          fontFamily: "sarpanch",
          fill: "#000000",
          align: "center",
        },
      )
      .setScrollFactor(0)
      .setOrigin(0, 0)
      .setVisible(false);

    this.scoreText = this.add
      .text(133, 130, this.score + "/4", {
        fontSize: "18px",
        fontFamily: "sarpanch",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setScrollFactor(0)
      .setOrigin(0, 0);

    this.engrenagemIcon = this.add
      .sprite(105, 122, "engrenagem", 8)
      .setOrigin(0, 0)
      .setScale(1)
      .setScrollFactor(0);

    const pIconX = 107;
    const pIconY = 63;
    const pIconSize = 64;

    this.anims.create({
      key: "playersIconIdle",
      frames: this.anims.generateFrameNumbers("playersIcon", {
        start: 0,
        end: 1,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.playerIcon = this.add
      .sprite(pIconX, pIconY, "playersIcon")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(9)
      .anims.play("playersIconIdle", true)
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
    molde.fillCircle(pIconX + 23, pIconY + 12, 32); //.setOrigin(0, 0).setScrollFactor(0);

    // 3. Cria a máscara geométrica a partir do círculo
    let mascara = molde.createGeometryMask();

    // 4. Aplica a máscara na imagem
    imagem.setMask(mascara);

    this.lifeBarBgGraphics = this.make
      .graphics({
        x: 130,
        y: 80,
        add: true,
      })
      .setScrollFactor(0)
      .setDepth(8);

    this.lifeBarBgGraphics.fillStyle(0x000000, 1);
    this.lifeBarBgGraphics.fillCircle(0, 0, 36);

    this.uI = this.add.container(0, 0);

    this.uI.add([
      this.cargaBar,
      this.cargaBarBackground,
      this.cargaBarBorder,
      this.cargaJpText,
      this.o2Bar,
      this.o2BarBackground,
      this.o2BarBorder,
      this.o2Text,
      this.lifeBarBgGraphics,
      this.lifeBarGraphics,
      this.playerIcon,
      this.scoreText,
      this.engrenagemIcon,
    ]);

    this.uI.setScrollFactor(0, 0);

    this.game.socket.on("scene1", (state) => {
      this.inFinalDoorP2 = state.inFinalDoorP2;
    });

    this.game.socket.on("GameOver", (state) => {
      this.gameOver = state.gameOver;
    });

    const jkl = this.input.keyboard.addKeys("J,K,L");

    this.game.socket.on("scene1", (state) => {
      if (state.doorOpen) {
        if (Object.prototype.hasOwnProperty.call(state, "doorOpen")) {
          this.doorOpen = state.doorOpen.key;
        }
      } //Ana Vitória

      if (state.jkl) {
        const jklState = state.jkl || { J: false, L: false, K: false };
        if (this.movingTorreta) {
          if (jklState.J) {
            this.torreta.setVelocityX(-170);
          } else if (jklState.L) {
            this.torreta.setVelocityX(170);
          } else {
            this.torreta.setVelocityX(0);
          }
          if (jklState.K && this.bullet === true) {
            this.bullet = false;
            this.disparo.play();

            this.laser
              .create(this.torreta.x - 15, this.torreta.y - 5, "torreta", 9) //873, 950 //400, 40
              .setOrigin(0, 0)
              .setSize(20, 10)
              .setOffset(6, 15)
              .setVelocityY(300);

            setTimeout(() => {
              this.bullet = true;
            }, 800);
          }
        }
      }

      if (state.playerroxo) {
        this.player2.setPosition(state.playerroxo.x, state.playerroxo.y + 2624);
        this.player2.anims.play(state.playerroxo.animation, true);
      }

      if (state.porta2) {
        this.porta2.anims.play(state.porta2);
      }

      if (state.faisca1) {
        this.faisca1.setVisible(state.faisca1.visible);
      }

      if (state.faisca2) {
        this.faisca2.setVisible(state.faisca2.visible);
      }

      if (state.faisca3) {
        this.faisca3.setVisible(state.faisca3.visible);
      }

      if (state.faisca4) {
        this.faisca4.setVisible(state.faisca4.visible);
      }

      if (state.collectIa) {
        this.collectIa = state.collectIa;
      }

      if (state.comunication) {
        this.comunication = state.comunication;
      }

    });

    this.game.socket.on("criar-alien-scene0", (dadosAlien) => {
      console.log("Scene0 recebeu o sinal do alien!", dadosAlien);
      let alien = this.inimigosaliens.create(
        dadosAlien.x,
        dadosAlien.y + 2624,
        dadosAlien.tipo,
      );
      alien.setData("id", dadosAlien.id);
    });

    this.game.socket.on("limpar-todos-aliens", () => {
      console.log("sinal recebido");
      if (this.inimigosaliens) {
        // Limpa todos os monstros da Scene0 instantaneamente!
        this.inimigosaliens.clear(true, true);
        console.log("💥 Todos os aliens foram limpos da Scene0 em sincronia!");
      }
    });

    this.game.socket.on("destruir-alien", (idRecebido) => {
      if (this.inimigosaliens) {
        this.inimigosaliens.getChildren().forEach((alien) => {
          // Procura qual dos aliens na tela tem o ID deletado
          if (alien.getData("id") === idRecebido) {
            alien.destroy();
            console.log("Alien " + idRecebido + " destruído em sincronia!");
          }
        });
      }
    });

    this.game.socket.on("atualizar-movimento-aliens", (pacoteAliens) => {
      if (!this.inimigosaliens) return;

      pacoteAliens.forEach((dados) => {
        this.inimigosaliens.getChildren().forEach((alien) => {
          // Se encontrar o alien correspondente pelo ID
          if (alien.getData("id") === dados.id) {
            // Sincroniza Posição e Velocidade
            alien.x = dados.x;
            alien.y = dados.y + 2624; // Mantendo o seu ajuste de offset do mapa da scene0
            alien.setFlipX(dados.flipX);

            // Sincroniza a Animação ("enemyWalk", etc.)
            if (dados.anim) {
              alien.anims.play(dados.anim, true);
            }
          }
        });
      });
    });
  }

  typeIaText(text, speed = 50, onComplete = null) {
    if (!text || text.length === 0) {
      this.iaText.setText("");
      if (onComplete) {
        onComplete();
      }
      return;
    }

    if (this.iaTypingEvent) {
      this.iaTypingEvent.remove(false);
      this.iaTypingEvent = null;
    }

    this.iaText.setText("");
    let index = 0;

    this.iaTypingEvent = this.time.addEvent({
      delay: speed,
      repeat: text.length - 1,
      callback: () => {
        index++;
        this.iaText.setText(text.substring(0, index));
        if (index >= text.length) {
          this.iaTypingEvent = null;
          if (onComplete) {
            onComplete();
          }
        }
      },
    });

  }

  updateO2Bar() {
    if (!this.o2Bar) {
      return;
    }

    const hudBarHeight = 80;
    const innerHeight = hudBarHeight - 4;
    const height = Phaser.Math.Clamp(
      (this.o2 / 100) * innerHeight,
      0,
      innerHeight,
    );

    this.o2Bar.height = height;
    this.o2Bar.y = this.o2BarBackground.y + 2 + (innerHeight - height);
    this.o2Text.setText([...this.o2.toString(), "%"].join("\n"));
  }

  updateO2BarArc() {
    if (!this.o2BarArcGraphics) {
      return;
    }

    const radius = 35;
    const outerRadius = 42; // Raio externo da barra de O2

    // Limpar o graphics
    this.o2BarArcGraphics.clear();

    if (this.o2 > 0) {
      // Calcular o ângulo baseado no oxigênio (360 graus = O2 máximo)
      const o2Percentage = this.o2 / 100;
      const o2Angle = 360 * o2Percentage;

      // Desenhar arco de oxigênio (ciano) como moldura
      this.o2BarArcGraphics.lineStyle(3, 0x00bfff, 1);
      this.o2BarArcGraphics.beginPath();
      this.o2BarArcGraphics.arc(
        0,
        0,
        (radius + outerRadius) / 2,
        Phaser.Math.DegToRad(270),
        Phaser.Math.DegToRad(270 + o2Angle),
        false,
      );
      this.o2BarArcGraphics.strokePath();
    }
  }

  updateCargaBar() {
    if (!this.cargaBar) {
      return;
    }

    const maxCarga = 1000;
    const hudBarHeight = 80;
    const innerHeight = hudBarHeight - 4;
    const height = Phaser.Math.Clamp(
      (this.cargaJp / maxCarga) * innerHeight,
      0,
      innerHeight,
    );

    this.cargaBar.height = height;
    this.cargaBar.y = this.cargaBarBackground.y + 2 + (innerHeight - height);
    this.cargaJpText.setText(
      [...this.cargaJPpercentage.toString(), "%"].join("\n"),
    );
  }

  createSemicircleLifeBar() {
    // Posição da barra de vida segmentada
    const x = 130;
    const y = 80;
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

    const maxLife = 10;
    const radius = this.lifeRadius;
    const segmentCount = 10;
    const gapDegrees = 5;
    const segmentDegrees = (360 - segmentCount * gapDegrees) / segmentCount;

    this.lifeBarGraphics.clear();

    const activeColor = 0xb40000;
      

    for (let i = 0; i < segmentCount; i++) {
      const startAngle = Phaser.Math.DegToRad(
        270 + i * (segmentDegrees + gapDegrees),
      );
      const endAngle = Phaser.Math.DegToRad(
        270 + i * (segmentDegrees + gapDegrees) + segmentDegrees,
      );
      const color = i < this.life ? activeColor : 0x555555;

      this.lifeBarGraphics
        .lineStyle(4, color, 1)
        .beginPath()
        .arc(0, 0, radius, startAngle, endAngle, false)
        .strokePath();
    }
  }

  collectBag(player, jetBag) {
    jetBag.disableBody(true, true);

    this.jetPack = true;

    if (this.cargaBarBackground) {
      this.cargaBarBackground.setVisible(true);
    }
    if (this.cargaBar) {
      this.cargaBar.setVisible(true);
    }
    if (this.cargaBarBorder) {
      this.cargaBarBorder.setVisible(true);
    }
    if (this.cargaJpText) {
      this.cargaJpText.setVisible(true);
    }

    this.updateCargaBar();
  }

  updateCargaBarBorder() {
    return;
  }

  update() {
   
    this.GameOver();

    console.log("P1:" + this.inFinalDoorP1 + "P2:" + this.inFinalDoorP2);

    if (this.inFinalDoorP1) {
      this.game.socket.emit("scene0", this.game.room, {
        engrenagens: this.score,
        inFinalDoorP1: this.inFinalDoorP1,
      });

      

      if (this.inFinalDoorP2) {
        this.physics.pause();
        this.physics.world.shutdown();

        this.game.socket.removeAllListeners();
        this.scene.stop("scene0");
        this.scene.start("scene2", { role: "pilot", engrenagens: this.score,});
      }
    }

    if (this.comunication) {
      this.game.audio.volume = 1;
    } else if (!this.comunication) {
      this.game.audio.volume = 0;
    }

    if (this.fase5) {
      try {
        this.game.socket.emit("scene0", this.game.room, {
          player: {
            x: this.player.x,
            y: this.player.y,
            animation: this.player.anims.currentAnim
              ? this.player.anims.currentAnim.key
              : null,
          },

          door15: this.door15.anims.currentAnim
              ? this.door15.anims.currentAnim.key
              : null,

          door25: this.door25.anims.currentAnim
              ? this.door25.anims.currentAnim.key
              : null,
        });
      } catch (e) {
        console.error("Error updating player:", e);
      }
    }
    if (this.platMoviment) {
      try {
        this.game.socket.emit("scene0", this.game.room, {
          platform12: {
            x: this.platform12.x,
            y: this.platform12.y,
          },
          platform15: {
            x: this.platform15.x,
            y: this.platform15.y,
          },
        });
      } catch (e) {
        console.error("Error updating player:", e);
      }
    }

    if (this.fase4) {
    try {
      this.game.socket.emit("scene0", this.game.room, {
        cannon: {
          x: this.cannon.x,
          y: this.cannon.y,
          shooting: this.shooting,
        },
      });
    } catch (e) {
      console.error("Error updating player:", e);
    }
    }

    if (this.energy) {
      this.lights.enable().setAmbientColor(0xe0f7ff);
    } else if (
      this.fase5 === true &&
      this.energy === false &&
      !this.platMoviment
    ) {
      this.lights.setAmbientColor(0x000000);

      this.painelLuz.enableBody(true, 340, 3396, true);
      this.platform12.setVelocityX(0).setPosition(340, 3425);
      this.platform15.setVelocityX(0).setPosition(955, 3375);
    } else if (
      this.fase5 === true &&
      this.energy === false &&
      this.platMoviment
    ) {
      this.lights.setAmbientColor(0x202020);
    }

    this.lamp.x = this.player.x;
    this.lamp.y = this.player.y;

    if (this.cargaJp <= 0 && this.jetPack) {
      this.cargaJPpercentage = 0;
      this.cargaJpText.setText(
        [...this.cargaJPpercentage.toString(), "%"].join("\n"),
      );
    } else {
      this.cargaJPpercentage = this.cargaJp / 10;
    }

    const movingHorizontally = Math.abs(this.player.body.velocity.x) > 1;
    const onGround =
      this.player.body.blocked.down || this.player.body.touching.down;
    if (movingHorizontally && onGround) {
      if (!this.passos.isPlaying) this.passos.play();
    } else if (this.passos.isPlaying) {
      this.passos.stop();
    }

    const keyboard = this.keys;
    const pad =
      this.input.gamepad && this.input.gamepad.total > 0
        ? this.input.gamepad.getPad(0)
        : null;

    const padPressed =
      !!pad && Array.isArray(pad.buttons)
        ? pad.buttons.some(
            (button) => button && (button.pressed || button.value > 0.1),
          )
        : false;

    let horizontal = 0;
    let vertical = 0;
    let jumpPressed = false;
    let interectPressed = false;
    let comunicationPressed = false;
    let reloadPressed = false;

    if (pad && pad.axes.length > 0) {
      horizontal = pad.axes[0].getValue();
      vertical = pad.axes[1].getValue();
      jumpPressed = !!pad.X;
      interectPressed = !!pad.buttons[9].pressed;
      comunicationPressed = !!pad.L1;
      reloadPressed = !!pad.R1;
    }

    if (reloadPressed) {
      window.location.reload();
    }

    if (padPressed && pad && Array.isArray(pad.buttons)) {
      pad.buttons.forEach((button, idx) => {
        if (!button) return;
        const pressed =
          !!button.pressed || (button.value && button.value > 0.1);
        if (pressed) {
          // tenta identificar por nome comum, senão mostra índice e valor
          const nameMap = {
            0: "A / Botão 0",
            1: "B / Botão 1",
            2: "X / Botão 2",
            3: "Y / Botão 3",
            4: "LB / Botão 4",
            5: "RB / Botão 5",
            6: "LT / Botão 6",
            7: "RT / Botão 7",
            8: "Back / Select / Botão 8",
            9: "Start / Botão 9",
            10: "Stick Left / Botão 10",
            11: "Stick Right / Botão 11",
            12: "DPad Up / Botão 12",
            13: "DPad Down / Botão 13",
            14: "DPad Left / Botão 14",
            15: "DPad Right / Botão 15",
            16: "Home / Guide / Botão 16",
          };
          const name = nameMap[idx] || `Botão ${idx}`;
          console.log(
            `Gamepad: ${name} (índice ${idx}) pressionado, value=${button.value}`,
          );
        }
      });
    }

    // Movimentação Horizontal (A e D)
    if (this.wasd.left.isDown) {
      horizontal = -1;
    } else if (this.wasd.right.isDown) {
      horizontal = 1;
    }

    // Movimentação Vertical
    if (this.wasd.down.isDown) {
      vertical = 1;
    }

    // Pulo / Jetpack (W)
    if (this.wasd.up.isDown) {
      jumpPressed = true; // Se o seu jogo usa 'jumpPressed' para pular
      vertical = -1; // Se o seu jogo usa 'vertical' negativo para subir/voar
    }


    if (this.esperandoInteracao === 1 && interectPressed) {
      this.esperandoInteracao = 0;

      this.bigPainelLuz.anims.play("acionandoLuz", true);

      this.bigPainelLuz.once("animationcomplete", (anim, frame) => {
        if (anim.key === "acionandoLuz") {
          this.bigPainelLuz.setVisible(false);
          this.platMoviment = true;
          this.startPlatformMovement();
          this.movingP1 = true;
        }
      });
    }

    if (this.esperandoInteracao === 2 && interectPressed) {
      this.esperandoInteracao = 0;

      this.bigPainelO2.anims.play("acionandoO2", true);

      this.bigPainelO2.once("animationcomplete", (anim, frame) => {
        if (anim.key === "acionandoO2") {
          this.bigPainelO2.setVisible(false);
          this.energy = true;
          this.o2Ship = true;
          this.lamp.setIntensity(0);
          this.movingP1 = true;
        }
      });
    }

    const estaSobreInvisible3 = this.physics.overlap(
      this.player,
      this.invisible3,
    );

    if (!estaSobreInvisible3) {
      this.camP2 = true;
    } else if (estaSobreInvisible3) {
      if (interectPressed && this.doubleInterecting) {
        this.interecting = !this.interecting;
        this.doubleInterecting = false;
      } else if (!interectPressed) {
        this.doubleInterecting = true;
      }

      if (!this.interecting && !this.camP2 && interectPressed) {
        this.movingP1 = true;
        this.cameras.main.setBounds(10, 0, this.tilemap.widthInPixels);
        this.cameras.main.startFollow(this.player, false, 1, 0).zoom = 1.2;
        this.cameras.main.scrollY =
          this.player.y - this.cameras.main.height / 2 - 120;
        this.iaBox.setVisible(true);
        this.uI.setVisible(true);
        this.invisible3.enableBody(true, 540, 300, true, true);
        this.layerEnfeites.setScrollFactor(0.9, 1);
      } else if (this.interecting && interectPressed) {
        this.iaBox.setVisible(false);
        this.uI.setVisible(false);
       this.physics.world.setBounds(43, 0, 1222);
       this.cameras.main.setBounds(43, 0, 1222);
        this.cameras.main.startFollow(this.cannon, false, 1, 0).zoom = 0.9;
        this.cameras.main.scrollY =
          this.cannon.y - this.cameras.main.height + 1;
        this.cannon.setCollideWorldBounds(true);
        this.camP2 = false;
        this.movingP1 = false;
        this.layerEnfeites.setScrollFactor(1);
      }
    }

    if (this.movingP1) {
      if (horizontal > 0) {
        this.player.setVelocityX(200);
        this.direction = true;
        if (this.player.body.velocity.y === 0 && this.jetPack === false) {
          this.player.anims.play("walk-right", true);
        } else if (this.player.body.velocity.y === 0 && this.jetPack === true) {
          this.player.anims.play("walk-rightJp", true);
        }
      } else if (horizontal < 0) {
        this.player.setVelocityX(-200);
        this.direction = false;
        if (this.player.body.velocity.y === 0 && this.jetPack === false) {
          this.player.anims.play("walk-left", true);
        } else if (this.player.body.velocity.y === 0 && this.jetPack === true) {
          this.player.anims.play("walk-leftJp", true);
        }
      } else {
        this.player.setVelocityX(0);
      }

      if (this.fase3 === false) {
        this.physics.world.gravity.y = 900;

        if (this.player.body.blocked.down) {
          this.doubleJump = false;
          if (jumpPressed || vertical < 0) this.player.setVelocityY(-300);
        }

        if (this.player.body.blocked.left || this.player.body.blocked.right) {
          if (
            this.player.body.velocity.x != 0 &&
            (jumpPressed || vertical < 0) &&
            !this.doubleJump
          ) {
            this.player.setVelocityY(-415);
            this.doubleJump = true;
          }
        }
      } else {
        this.physics.world.gravity.y = 50;

        if (
          (jumpPressed || vertical < 0) &&
          (this.player.body.blocked.down ||
            (this.doubleJump && this.cargaJp > 0))
        ) {
          this.player.setVelocityY(-70);
          this.doubleJump = false;
          if (!this.player.body.blocked.down) {
            this.cargaJp -= 30;
            this.cargaJpText.setText(
              ["Cargas: ", this.cargaJPpercentage, "%"].join("\n"),
            );
            this.updateCargaBar();
          }

          if (this.direction === true) {
            this.player.setFrame("63");
          } else if (this.direction === false) {
            this.player.setFrame("61");
          }
        } else if (
          vertical === 0 &&
          !jumpPressed &&
          this.player.body.velocity.y != 0
        ) {
          this.doubleJump = true;

          if (this.direction === true) {
            this.player.anims.play("idleRightJP", true);
          } else if (this.direction === false) {
            this.player.anims.play("idleLeftJP", true);
          }
        }

        if (
          this.player.body.velocity.y != 0 &&
          this.player.body.velocity.x != 0
        ) {
          if (this.direction === true) {
            if (this.cargaJp > 0) {
              this.player.setFrame("58");
              this.player.setAngle(10);
              this.cargaJp -= 1;
              this.cargaJpText.setText(
                [...this.cargaJPpercentage.toString(), "%"].join("\n"),
              );
              this.updateCargaBar();
            }
          } else if (this.direction === false) {
            if (this.cargaJp > 0) {
              this.player.setFrame("56");
              this.player.setAngle(-10);
              this.cargaJp -= 1;
              this.cargaJpText.setText(
                [...this.cargaJPpercentage.toString(), "%"].join("\n"),
              );
              this.updateCargaBar();
            }
          }
        } else if (
          (this.player.body.velocity.y != 0 &&
            this.player.body.velocity.x === 0) ||
          this.player.body.blocked.down
        ) {
          this.player.setAngle(0);
        }
      }

      if (this.jetPack === false && this.fase3 === false) {
        if (this.player.body.velocity.y < 0 && this.direction === true) {
          this.player.anims.play("jump", true);
        } else if (
          this.player.body.velocity.y < 0 &&
          this.direction === false
        ) {
          this.player.anims.play("jumpL", true);
        }
      } else if (this.jetPack === true && this.fase3 === false) {
        if (this.player.body.velocity.y < 0 && this.direction === true) {
          this.player.anims.play("jumpJP", true);
        } else if (
          this.player.body.velocity.y < 0 &&
          this.direction === false
        ) {
          this.player.anims.play("jumpLJP", true);
        }
      }

      if (this.jetPack === false) {
        if (
          this.direction === true &&
          this.player.body.velocity.x === 0 &&
          this.player.body.velocity.y === 0 &&
          (this.player.body.blocked.down || this.player.body.blocked.up)
        ) {
          this.player.anims.play("idleRight", true);
        } else if (
          this.direction === false &&
          this.player.body.velocity.x === 0 &&
          this.player.body.velocity.y === 0 &&
          (this.player.body.blocked.down || this.player.body.blocked.up)
        ) {
          this.player.anims.play("idleLeft", true);
        }
      } else if (this.jetPack === true) {
        if (
          this.direction === true &&
          this.player.body.velocity.x === 0 &&
          this.player.body.velocity.y === 0 &&
          (this.player.body.blocked.down || this.player.body.blocked.up)
        ) {
          this.player.anims.play("idleRightJP", true);
        } else if (
          this.direction === false &&
          this.player.body.velocity.x === 0 &&
          this.player.body.velocity.y === 0 &&
          (this.player.body.blocked.down || this.player.body.blocked.up)
        ) {
          this.player.anims.play("idleLeftJP", true);
        }
      }
    } else if (!this.movingP1) {
      this.player.setVelocity(0);
      if (this.fase4) {
      
        if (horizontal < 0) {
          this.cannon.setVelocityX(-150);
        } else if (horizontal > 0) {
          this.cannon.setVelocityX(150);
        } else {
          this.cannon.setVelocityX(0);
        }
      

      

        if (jumpPressed) {
          this.shooting = true;
        } else if (!jumpPressed) {
          this.shooting = false;
        }

        if (jumpPressed && this.bulletP1) {
          this.bulletP1 = false;
          setTimeout(() => {
            this.bulletP1 = true;
          }, 1000);

          this.laserP1
            .create(this.cannon.x, this.cannon.y - 20, "bulletP1")
            .setVelocityY(-200);
        }
      }
    }

    // movimentação inimigo
    if (this.enemyGravity === true) {
      this.inimigo.setVelocity(0, 70);
      this.enemyGravity = false; //quando ele está caindo, e gravidade n funciona e a vel y é 100
    } else if (this.enemyGravity === false) {
      this.inimigo.body.allowGravity = false;
    }
    if (this.inimigo.body.blocked.down) {
      //se inimigo estiver no chão, ele segue o player
      this.torreta.anims.play("torretaidle", true);
      this.torreta.once("animationcomplete", (anim, frame) => {
        if (anim.key === "torretaidle") {
          this.movingTorreta = true;
        }
      });
      setInterval(() => {
        if (this.inimigo.y === 1837) {
          if (this.player.x - this.inimigo.x > 50) {
            this.inimigo
              .setVelocityX(120)
              .anims.play("enemyWalk", true)
              .setPipeline("Light2D")
              .body.setSize(30, 37)
              .setOffset(33, 17);
            this.inimigo.flipX = true;
          } else if (this.player.x - this.inimigo.x < -50) {
            this.inimigo
              .setVelocityX(-120)
              .anims.play("enemyWalk", true)
              .setPipeline("Light2D")
              .body.setSize(30, 37)
              .setOffset(55, 17);
            this.inimigo.flipX = false;
          } else if (0 < this.player.x - this.inimigo.x < 0) {
            this.inimigo.setVelocityX(0);
          }
        } else if (this.inimigo.y != 1837) {
          this.inimigo.setVelocityX(0).setFrame("14");
        }
      }, 100);
    }
  }


  laserFloor(laser, piso) {
    laser.destroy();
  }
  

  enemyAt(player, inimigo) {
    if (!this.canTakeDamage) {
      return;
    }

    this.canTakeDamage = false;
    this.inimigo.setVelocityX(0).anims.play("enemyAtack", true);

    this.inimigo.once("animationcomplete", (anim, frame) => {
      if (anim.key === "enemyAtack") {
        this.player
          .setPosition(108, 1836)
          .setVelocity(0, 0)
          .anims.play("idleRight");
        this.direction = true;
        this.inimigo
          .setVelocity(0, 0)
          .setPosition(595, 1584)
          .setOffset(36, 17)
          .setFrame("14");
        this.inimigo.flipX = false;
        this.enemyGravity = true;

        if (this.life > 0) {
          this.life -= 1;
          this.updateSemicircleLifeBar();
          // this.playLifeAnimation();
        }

        this.canTakeDamage = true;

        if (this.collectEng2 === true) {
          this.score -= 1;
          this.engrenagem2.enableBody(true, 1059, 1652, true, true);
          this.collectEng2 = false;
          this.scoreText.setText(this.score + "/4");
        }
      }
    });
  }


  collectEng(player, engrenagens) {
    this.engrenagemIcon.anims.play("engrenagem-icon", true);
    this.score += 1;
    this.scoreText.setText(this.score + "/4");
  }

  webrtcAnswerCall() {
    this.game.remoteConnection = new RTCPeerConnection(this.game.iceServers);

    this.game.remoteConnection.onicecandidate = ({ candidate }) => {
      this.game.socket.emit("candidate", this.game.room, candidate);
    };

    this.game.remoteConnection.ontrack = ({ streams: [stream] }) => {
      this.game.audio.srcObject = stream;
      this.game.audio.volume = 1;
    };

    if (this.game.media) {
      this.game.media
        .getTracks()
        .forEach((track) =>
          this.game.remoteConnection.addTrack(track, this.game.media),
        );
    }

    this.game.socket.on("offer", (description) => {
      this.game.remoteConnection
        .setRemoteDescription(description)
        .then(() => this.game.remoteConnection.createAnswer())
        .then((answer) =>
          this.game.remoteConnection.setLocalDescription(answer),
        )
        .then(() =>
          this.game.socket.emit(
            "answer",
            this.game.room,
            this.game.remoteConnection.localDescription,
          ),
        );
    });

    this.game.socket.on("candidate", (candidate) => {
      this.game.remoteConnection.addIceCandidate(candidate);
    });
  }
}

export default scene0;