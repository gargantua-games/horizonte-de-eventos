class scene0 extends Phaser.Scene {
  constructor() {
    super("scene0");

    this.threshold = 0.1;
    this.speed = 200;
    this.direction = undefined;
    this.money = 0;
    this.timer = 40;
    
  }
  
  preload() {

    this.load.plugin("rexvirtualjoystickplugin", "./rexvirtualjoystickplugin.min.js", true);
    
    this.load.setPath("assets/");

    this.load.tilemapTiledJSON("fase1e2v3", "mapasv3/fase1e2v3.json");

    this.load.image("remasterized", "assets-usados/remasterized.png");
    this.load.image("remasterizedEnfeites", "assets-usados/remasterizedEnfeites.png");
    this.load.image("starrySpace", "assets-usados/Starry Space - 32x22.jpg");
    this.load.image("newPiskel", "assets-usados/New Piskel.png");
    this.load.image("consoles", "assets-usados/console_s.png");
    this.load.image("consolew", "assets-usados/console_w.png");
    this.load.image("tileset", "assets-usados/tileset x1.png");
    this.load.image("unnamed", "assets-usados/unnamed.png");

    this.load.spritesheet("player", "player.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("plataform", "plataform.png", {
      frameWidth: 64,
      frameHeight: 8,
    });

    this.load.spritesheet("buttons", "buttons.png", {
      frameWidth: 32,
      frameHeight: 32,
    });


    /*this.load.audio("epic", "assets/epic.mp3");
    this.load.audio("dindin", "assets/dindin.mp3");*/

  }


  create() {

    this.tilemap = this.make.tilemap({ key: "fase1e2v3" });
    
    this.tilesetRemasterized = this.tilemap.addTilesetImage("remasterized");
    this.tilesetRemasterizedEnfeites = this.tilemap.addTilesetImage("remasterizedEnfeites");


    /*this.epic = this.sound.add("epic", { loop: true }).play();
    this.dindin = this.sound.add("dindin");*/

    this.layerFundo = this.tilemap.createLayer("fundo", [this.tilesetRemasterized, this.tilesetRemasterizedEnfeites,]);
    this.layerEnfeites = this.tilemap.createLayer("enfeites", [this.tilesetRemasterizedEnfeites,]);
    this.layerVidro = this.tilemap.createLayer("vidro", [this.tilesetRemasterized,]);
    this.layerVidroH = this.tilemap.createLayer("vidroH", [this.tilesetRemasterized,]);
    this.layerPiso = this.tilemap.createLayer("piso", [this.tilesetRemasterized,]);

    this.physics.world.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels,
    );
    
    this.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels,
    );

    
    
    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("player", { start: 28, end: 35 }),
      frameRate: 10,
      repeat: -1,
    });
    
    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("player", { start: 36, end: 43 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("player", { start: 52, end: 59, }),
      frameRate: 10,
      repeat: -1,
    });
    
    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("player", { start: 44, end: 51 }),
      frameRate: 10,
      repeat: -1,
    });
    
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", { start: 4, end: 5 }),
      frameRate: 2,
      repeat: -1,
    });

    this.plataform1 = this.physics.add.sprite(360, 709, "plataform");
    this.plataform1.setVelocityX(100);
    
    setInterval(() => {
      this.plataform1.setVelocityX(this.plataform1.body.velocity.x * -1);
    }, 3400);

    this.plataform2 = this.physics.add.sprite(1092, 590, "plataform");
    this.plataform2.setVelocityY(-90);

    setInterval(() => {
      this.plataform2.setVelocityY(this.plataform2.body.velocity.y * -1);
    }, 1050);

    this.plataform3 = this.physics.add.sprite(963, 510, "plataform");
    this.plataform3.setVelocityX(-100);

    setInterval(() => {
      this.plataform3.setVelocityX(this.plataform3.body.velocity.x * -1);
    }, 4000);

    this.player = this.physics.add.sprite(92, 672, "player", 5);
    this.player.anims.play("idle",true);
    this.cameras.main.startFollow(this.player);

    // Texto de posição do player atualizado a cada segundo
    this.positionText = this.add.text(10, 10, "X: 0 Y: 0", {
      fontSize: "18px",
      fill: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: { x: 6, y: 4 },
    }).setScrollFactor(0);

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.positionText.setText(
          `X: ${Math.round(this.player.x)} Y: ${Math.round(this.player.y)}`
        );
      },
    });
    
    this.joystick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 100,
      y: 350,
      radius: 50,
      base: this.add.circle(0, 0, 50, 0x6acac2),
      thumb: this.add.circle(0, 0, 25, 0x3fa789),
    });

    this.joystick.on("update", () => {
      const angle = Phaser.Math.DegToRad(this.joystick.angle);
      const force = this.joystick.force;
      
      if (force > this.threshold) {
        this.direction = new Phaser.Math.Vector2(
          Math.cos(angle),
          Math.sin(angle)
        ).normalize();
      }
      
      if (this.joystick.force > 0) {
        this.player.setVelocity(
          this.direction.x * this.speed,
          this.direction.y * this.speed
        );
        
        switch (true) {
          case this.joystick.angle >= -135 && this.joystick.angle < -45:
            this.player.anims.play("walk-up", true);
            break;
            case this.joystick.angle >= -45 && this.joystick.angle < 45:
            this.player.anims.play("walk-right", true);
            break;
          case this.joystick.angle >= 45 && this.joystick.angle < 135:
            this.player.anims.play("walk-down", true);
            break;
            case this.joystick.angle >= 135 || this.joystick.angle < -135:
              this.player.anims.play("walk-left", true);
              break;
            }
          } else {
            this.player.setVelocity(0, 0);
            this.player.anims.play("idle",true);
          }
    });
    

        
    this.player.setCollideWorldBounds(true);
    this.plataform1.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.plataform1);
    this.physics.add.collider(this.plataform1, this.layerPiso);
    
        
    this.layerPiso.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, this.layerPiso);
  }
}

export default scene0;
