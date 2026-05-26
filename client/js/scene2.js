class scene2 extends Phaser.Scene {
  constructor() {
    super("scene2");
  }

  init(data) {
    // Agora o máximo é 4 cartões (0, 1, 2, 3 ou 4)
    this.engrenagem = data.engrenagem !== undefined ? Phaser.Math.Clamp(data.engrenagem, 0, 4) : 0;
  }

  create() {
    this.physics.world.gravity.y = 0;
    this.physics.world.setBounds(0, 0, 2000, 800);
    this.cameras.main.setBounds(0, 0, 2000, 800);  

    this.space = this.add.sprite(0, 0, "space1");
    this.space.setOrigin(0, 0).setDisplaySize(2000, 800).setScrollFactor(0.5);

    // LÓGICA DO SPRITE DA NAVE
    // Se tem 0 engrenagens, vira 'naves1'. Se tem 4, vira 'naves5'.
    let texturaNave = "naves" + (this.engrenagem + 1);

    this.nave = this.physics.add.sprite(100, 400, texturaNave).setScale(0.5);
    this.nave.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.nave, true, 0.1, 0.1);

    this.playerBullets = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();

    this.nextFire = 0;

    this.criarInimigos();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.statusText = this.add.text(10, 10, "", { font: "16px Arial", fill: "#ffffff" }).setScrollFactor(0);
  }

  update(time, delta) {
    const speed = 300;

    if (this.cursors.up.isDown) {
      this.nave.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.nave.setVelocityY(speed);
    } else {
      this.nave.setVelocityY(0);
    }

    if (this.cursors.left.isDown) {
      this.nave.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.nave.setVelocityX(speed);
    } else {
      this.nave.setVelocityX(0); 
    }

    const mouseClicado = this.input.activePointer.isDown;
    if ((this.spaceKey.isDown || mouseClicado) && time > this.nextFire) {
      this.atirar(time);
    }

    this.playerBullets.getChildren().forEach((bullet) => {
      if (bullet.x > this.cameras.main.scrollX + 850) {
        bullet.destroy();
      }
    });

    this.statusText.setText(`Cartões: ${this.engrenagem}/4 | Pos: ${Math.round(this.nave.x)}, ${Math.round(this.nave.y)}`);
  }

  criarInimigos() {
    // Trocado "nave" por "naveet" em todos os inimigos
    let e1 = this.enemies.create(600, 300, "naveet").setScale(0.5).setAngle(-90);
    this.configurarMovimentoInimigo(e1, 100);

    let e2 = this.enemies.create(1000, 500, "naveet").setScale(0.5).setAngle(-90);
    this.configurarMovimentoInimigo(e2, 120);

    let e3 = this.enemies.create(1400, 200, "naveet").setScale(0.5).setAngle(-90);
    this.configurarMovimentoInimigo(e3, 150);

    // Boss com tamanho maior
    this.boss = this.enemies.create(1800, 400, "naveet").setScale(1.2).setAngle(-90);
    this.boss.isBoss = true;
    this.boss.hp = 50; 
    this.configurarMovimentoInimigo(this.boss, 80);
  }

  configurarMovimentoInimigo(inimigo, velocidadeY) {
    inimigo.body.setVelocityY(velocidadeY);
    
    this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => {
        if (inimigo && inimigo.active) {
          inimigo.body.setVelocityY(inimigo.body.velocity.y * -1);
        }
      }
    });

    this.time.addEvent({
      delay: inimigo.isBoss ? 800 : 1500,
      loop: true,
      callback: () => {
        if (inimigo && inimigo.active) {
          this.enemyBullets.create(inimigo.x, inimigo.y, "torreta")
            .setVelocityX(-250); 
        }
      }
    });
  }

  atirar(tempoAtual) {
    // Calculos de dano e tiro usando engrenagem (0 a 4)
    const cadenciaTiro = 500 - (this.engrenagem * 80); 
    const velocidadeTiro = 400 + (this.engrenagem * 75); 
    const danoTiro = 1 + this.engrenagem; 

    let tiro = this.playerBullets.create(this.nave.x + 40, this.nave.y, "torreta");
    tiro.setVelocityX(velocidadeTiro);
    tiro.dano = danoTiro; 

    this.nextFire = tempoAtual + cadenciaTiro;
  }
}

export default scene2;