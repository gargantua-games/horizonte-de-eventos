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
    this.life = 6;
    this.canTakeDamage = true;
    this.enemyGravity = false;
    this.doorOpen = 3;
    this.bullet = true;
    this.platform12Interval = null;
    this.platform15Interval = null;
    this.movingTorreta = false;
    this.camP2 = true;
    this.movingP1 = true;
    this.angleCannon = 0;
    this.bulletP1 = true;
    this.shooting = false;
    this.interecting = false;
    this.doubleInterecting = true;
    this.comunication = true;
    this.gameOver = false;
  }

  init() {
    this.webrtcAnswerCall();
  }

  GameOver() {
    if (this.gameOver) {
      console.log("game Over:" + this.gameOver);
      console.log("life" + this.life);
      return;
    }

    console.log("game Over:" + this.gameOver);

    if (this.life > 0) {
      console.log("life" + this.life);
      return;
    }

    this.gameOver = true;
    this.game.socket.emit("GameOver", this.game.room, {
      gameOver: this.gameOver,
    });

    this.scene.stop("scene0");
    this.scene.start("gameover1");

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

    this.passos = this.sound.add("passos", { loop: true, volume: 2 });
    this.trilhasonora = this.sound
      .add("trilhasonora", { loop: true, volume: 0.08 })
      .play();

    this.space = this.add.image(0, 0, "space");
    this.space.setPipeline("Light2D").setOrigin(0, 0).setScrollFactor(0.1, 1);

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
      key: "life5",
      frames: this.anims.generateFrameNumbers("redLife", {
        start: 0,
        end: 2,
      }),
      frameRate: 11,
      repeat: 0,
    });

    this.anims.create({
      key: "life4",
      frames: this.anims.generateFrameNumbers("redLife", {
        start: 2,
        end: 4,
      }),
      frameRate: 11,
      repeat: 0,
    });

    this.anims.create({
      key: "life3",
      frames: this.anims.generateFrameNumbers("redLife", {
        start: 4,
        end: 6,
      }),
      frameRate: 11,
      repeat: 0,
    });

    this.anims.create({
      key: "life2",
      frames: this.anims.generateFrameNumbers("redLife", {
        start: 6,
        end: 8,
      }),
      frameRate: 11,
      repeat: 0,
    });

    this.anims.create({
      key: "life1",
      frames: this.anims.generateFrameNumbers("redLife", {
        start: 8,
        end: 10,
      }),
      frameRate: 11,
      repeat: 0,
    });

    this.anims.create({
      key: "life0",
      frames: this.anims.generateFrameNumbers("redLife", {
        start: 10,
        end: 12,
      }),
      frameRate: 11,
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

    this.lastLife = this.life;

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

    this.invisible = this.physics.add.sprite(340, 3396, "invisible");
    this.invisible.setImmovable(true).setPipeline("Light2D").body.allowGravity =
      false;

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

    this.invisible2 = this.physics.add.sprite(1231, 3351, "invisible");
    this.invisible2
      .setImmovable(true)
      .setPipeline("Light2D").body.allowGravity = false;

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

        this.o2 = 100;
        this.o2Text.setText("Oxigênio: " + this.o2 + "%");
        this.updateO2Bar();
        this.direction = true;
        if (this.collectEng5) {
          this.engrenagem5.enableBody(true, 531, 3340, true, true);

          this.score -= 1;
          this.collectEng5 = false;
        }

        this.o2 = 100;
        this.platMoviment = false
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
      .setPipeline("Light2D").body.allowGravity = false;

    const texto = " ";
    const texto1 =
      "Olá, eu sou ... e estou aqui para\najudar vocês a sairem daqui.";
    const texto2 = "Você pode saltar nas paredes para\nir mais alto.";
    const texto3 =
      "Você pode coletar os crachás para\nconseguir uma fuga melhor.";
    const texto4 =
      "Porém mesmo que você não consiga\ncoletar os crachás vocês conseguem\nfugir daqui.";
    const texto5 = "Fuja deste alien até que o Roxo\nelimine ele.";
    const texto6 =
      "Assim você pode pegar o jetpack\ndele e para passar pela próxima\nsala.";
    this.iaText = this.add
      .text(735, 38, texto, { font: "13px", fill: "#fffc51" })
      .setScrollFactor(0)
      .setPipeline("Light2D")
      .setOrigin(0, 0);
    this.iaTypingEvent = null;

    this.player = this.physics.add.sprite(92, 300, "player", 3); //fase1:92, 1066/445, 911//fase2:108, 1836/1138, 1836//fase3: 69, 2496/1256,2356//fase4: 92,300//fase5:92, 3532//
    this.player.body.setSize(20, 40);
    this.cameras.main.startFollow(this.player, false, 1, 0).zoom = 1.2;
    this.cameras.main.scrollY =
      this.player.y - this.cameras.main.height / 2 - 120; // Ajuste para começar mais para cima (100 pixels acima do centro do jogador)
    this.player.anims.play("idleRight", true).setPipeline("Light2D");

    this.antenas = this.add.group({
      allowGravity: false,
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

    //telescopios exterior
    this.telescopios = this.add.group({
      allowGravity: false,
      immovable: true,
      pipeline: "Light2D",
    });

    this.telescopios.create(207, 3987, "telescopio");

    this.telescopios.create(338, 4211, "telescopio");

    this.telescopios.create(1107, 4114, "telescopio");

    //osciloscopios exterior
    this.osciloscopios = this.add.group({
      allowGravity: false,
      immovable: true,
      pipeline: "Light2D",
    });

    this.osciloscopios.create(626, 4024, "osciloscopio");

    this.osciloscopios.create(980, 4184, "osciloscopio");

    this.player2 = this.add.sprite(92, 3890, "playerroxo", 3);
    this.player2.setPipeline("Light2D");

    this.cannon = this.add.sprite(656, 4336, "cannon");
    this.cannon.setPipeline("Light2D");

    this.turretP1 = this.add.sprite(656, 4337, "turret");
    this.turretP1.setPipeline("Light2D");

   this.inimigosaliens = this.add.group({
     // allowGravity: false,
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

    /*this.coracao = this.add
      .sprite(165, 60, "redLife")
      .setScrollFactor(0)
      .setScale(3);*/

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

    //inimigo
    this.physics.add.collider(this.inimigo, this.layerPiso);

    this.physics.add.collider(this.laser, this.layerPiso, () => {
      this.laser.clear(true, true);
    });

    this.physics.add.collider(this.laser, this.inimigo, () => {
      this.inimigo.disableBody(true, true);
      this.laser.clear(true, true);
      this.jetBag
        .create(this.inimigo.x, this.inimigo.y, "jetBag")
        //.setScrollFactor(0.9, 1)
        .setPipeline("Light2D")
        .anims.play("jetBag-idle", true).body.allowGravity = false;
    });

    this.physics.add.overlap(this.player, this.invisible, () => {
      this.invisible.disableBody(true, true);
      this.platMoviment = true;
      this.startPlatformMovement();
      //this.fase5 = false;
    });

    this.physics.add.overlap(this.player, this.invisible2, () => {
      this.invisible2.disableBody(true, true);
      this.energy = true;
      this.o2Ship = true;
      this.lamp.setIntensity(0);
    });

    this.physics.add.overlap(this.player, this.invisibleH, () => {
      this.invisibleH.disableBody(true, true);
      this.iaBox.setVelocityX(-100);

      setTimeout(() => {
        this.iaBox.setVelocityX(0);
        this.iaBox.anims.play("iaSpeak", true);

        this.typeIaText(texto1, 50, () => {
          this.time.delayedCall(500, () => {
            this.typeIaText(texto2, 50, () => {
              this.time.delayedCall(500, () => {
                this.typeIaText(texto3, 50, () => {
                  this.time.delayedCall(500, () => {
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
      this.iaBox.anims.stop();

      this.typeIaText(texto, 50);
      /*//if (this.doorOpen != 1) {
       */ this.iaBox.setVelocityX(100);
      /*setTimeout(() => {
          this.iaBox.setVelocityX(0);
        }, 3237);
      }*/
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
      }
    });

    this.physics.add.overlap(this.player, this.cai, () => {
      this.player
        .setPosition(92, 1066)
        .setVelocity(0, 0)
        .anims.play("idleRight");

      this.life -= 1;
      this.updateSemicircleLifeBar();
      this.iaBox.setPosition(1009, 33).setVelocityX(0).anims.stop();
      this.typeIaText(texto, 50);

      this.invisibleH.enableBody(true, 942, 1020, true, true);
      this.invisibleH2.enableBody(true, 475, 870, true, true);

      this.direction = true;
      if (this.collectEng1 === true) {
        this.score -= 1;
        this.engrenagem1.enableBody(true, 1138, 968, true, true);
        this.collectEng1 = false;
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
            this.iaBox.setVelocityX(0).setPosition(1009, 33);
            this.player
              .setPosition(108, 1835)
              //.setVelocity(0, 0)
              .anims.play("idleRight");
            this.direction = true;
            this.enemyGravity = true;
            this.cameras.main.scrollY =
              this.player.y - this.cameras.main.height / 2 - 120;
            this.door12.anims.play("close-door", true);

            this.iaBox.setVelocityX(-100);
            setTimeout(() => {
              this.iaBox.setVelocityX(0);
              this.iaBox.anims.play("iaSpeak", true);

              this.typeIaText(texto5, 50, () => {
                this.time.delayedCall(500, () => {
                  this.typeIaText(texto6, 50);
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
            this.direction = true;
            this.cameras.main.scrollY =
              this.player.y - this.cameras.main.height / 3.8 - 120;
            this.fase3 = true;
            this.door13.anims.play("close-door", true);
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
            this.cargaJp = 0;
            this.updateCargaBar();
            this.door14.anims.play("close-door", true);
            this.door14.once("animationcomplete", (anim, frame) => {
              if (anim.key === "close-door") {
                this.light14.setColor(0xff0000);
                this.fase4 = true;
                try {
                  this.game.socket.emit("scene0", this.game.room, {
                    fase4: {
                      key: this.fase4,
                    },
                  });
                } catch (e) {
                  console.error("Error updating player:", e);
                }
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
            this.direction = true;
            this.cameras.main.scrollY =
              this.player.y - this.cameras.main.height / 2 - 120;
            this.lamp.setIntensity(0.95);

            this.door15.anims.play("close-door", true);
            this.door15.once("animationcomplete", (anim, frame) => {
              if (anim.key === "close-door") {
                this.light15.setColor(0xff0000);
              }
            });
          }
        });
      }
    });

    this.layerPiso.setCollisionByProperty({ collides: true });

    // Texto de posição do player atualizado a cada segundo
    this.positionText = this.add
      .text(100, 50, "X: 0 Y: 0", {
        fontSize: "18px",
        fill: "#ffffff",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: { x: 6, y: 4 },
      })
      .setScrollFactor(0);

    this.time.addEvent({
      delay: 10,
      loop: true,
      callback: () => {
        this.positionText.setText(
          this.movingP1,
          /*`X: ${Math.round(this.player.x)} Y: ${Math.round(this.player.y)}`*/
        );
      },
    });

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
      .text(133, 130,  this.score + "/4", {
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
    
      this.playerIcon = this.add.sprite(pIconX, pIconY, "playersIcon")
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
          ])
          
        this.uI.setScrollFactor(0, 0);
        
        const jkl = this.input.keyboard.addKeys("J,K,L");

        this.game.socket.on("scene1", (state) => {
          if (state.doorOpen) {
        if (Object.prototype.hasOwnProperty.call(state, "doorOpen")) {
          this.doorOpen = state.doorOpen.key;
        }
      }

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
        });
    this.game.socket.on('criar-alien-scene0', (dadosAlien) => {
      console.log("Scene0 recebeu o sinal do alien!", dadosAlien);
        let alien = this.inimigosaliens.create(dadosAlien.x, (dadosAlien.y + 2624), dadosAlien.tipo);
        alien.setData('id', dadosAlien.id);

      
       
      
    });

    this.game.socket.on("limpar-todos-aliens", () => {
      console.log("sinal recebido");
        if (this.inimigosaliens) {
            // Limpa todos os monstros da Scene0 instantaneamente!
            this.inimigosaliens.clear(true, true);
            console.log("💥 Todos os aliens foram limpos da Scene0 em sincronia!");
        }
     });

    this.game.socket.on('destruir-alien', (idRecebido) => {
    if (this.inimigosaliens) {
        this.inimigosaliens.getChildren().forEach(alien => {
            // Procura qual dos aliens na tela tem o ID deletado
            if (alien.getData('id') === idRecebido) {
                alien.destroy();
                console.log("Alien " + idRecebido + " destruído em sincronia!");
            }
        });
    }
    });


    
    this.game.socket.on('atualizar-movimento-aliens', (pacoteAliens) => {
    if (!this.inimigosaliens) return;

    pacoteAliens.forEach(dados => {
        this.inimigosaliens.getChildren().forEach(alien => {
            // Se encontrar o alien correspondente pelo ID
            if (alien.getData('id') === dados.id) {
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

    const maxLife = 6;
    const radius = this.lifeRadius;
    const segmentCount = 6;
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
    this.cannon.setAngle(this.angleCannon);
    this.GameOver();

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
        });
      } catch (e) {
        console.error("Error updating player:", e);
      }
    }
    if (this.fase5 === false && this.energy === false) {
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

    //if (this.fase4) {
    try {
      this.game.socket.emit("scene0", this.game.room, {
        cannon: {
          angle: this.angleCannon,
          shooting: this.shooting,
        },
      });
    } catch (e) {
      console.error("Error updating player:", e);
    }
    //}

    if (this.energy) {
      this.lights.enable().setAmbientColor(0xe0f7ff);
    } else if (this.fase5 === true && this.energy === false && !this.platMoviment) {
      this.lights.setAmbientColor(0x000000);
      
      this.invisible.enableBody(true, 340, 3396, true, true);
      this.platform12.setVelocityX(0).setPosition(340, 3425);
      this.platform15.setVelocityX(0).setPosition(955, 3375);

    } else if (this.fase5 === true && this.energy === false && this.platMoviment) {
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

    // Controla volume de áudio baseado em comunicationPressed
    if (this.game.audio) {
      if (this.comunication)
        this.game.audio.volume = comunicationPressed ? 1 : 0;
    }

    if (interectPressed && this.doubleInterecting) {
      this.interecting = !this.interecting;
      this.doubleInterecting = false;
    } else if (!interectPressed) {
      this.doubleInterecting = true;
    }

    const estaSobreInvisible3 = this.physics.overlap(
      this.player,
      this.invisible3,
    );

    if (!estaSobreInvisible3) {
      this.camP2 = true;
    } else if (estaSobreInvisible3) {
      if (!this.interecting && !this.camP2) {
        this.movingP1 = true;
        this.cameras.main.startFollow(this.player, false, 1, 0).zoom = 1.2;
        this.cameras.main.scrollY =
          this.player.y - this.cameras.main.height / 2 - 120;
        this.iaBox.setVisible(true);
        this.uI.setVisible(true);
        this.invisible3.enableBody(true, 540, 300, true, true);
        this.layerEnfeites.setScrollFactor(0.9, 1);
      } else if (this.interecting) {
        this.iaBox.setVisible(false);
        this.uI.setVisible(false);
        this.cameras.main.startFollow(this.cannon, false, 1, 0).zoom = 0.9;
        this.cameras.main.scrollY =
          this.cannon.y - this.cameras.main.height - 14;
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
      if (horizontal === 0 && vertical < 0) {
        this.angleCannon = 0;
      }
      if (horizontal > 0 && vertical >= 0) {
        this.angleCannon = 80;
      } else if (horizontal < 0 && vertical >= 0) {
        this.angleCannon = -80;
      } else if (horizontal > 0 && vertical < 0) {
        this.angleCannon = 50;
      } else if (horizontal < 0 && vertical < 0) {
        this.angleCannon = -50;
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
      this.game.audio.volume = 0;
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
