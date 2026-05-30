class scene2 extends Phaser.Scene {
  constructor() {
    super("scene2");
  }

  init(data) {
    this.engrenagem = data.engrenagem !== undefined ? Phaser.Math.Clamp(data.engrenagem, 0, 4) : 0;

    this.atributosNave = [
      { vidaMax: 3, velocidade: 200, dano: 1, cadencia: 600, velTiro: 350 },
      { vidaMax: 4, velocidade: 250, dano: 2, cadencia: 500, velTiro: 425 },
      { vidaMax: 5, velocidade: 300, dano: 3, cadencia: 420, velTiro: 500 },
      { vidaMax: 6, velocidade: 350, dano: 4, cadencia: 340, velTiro: 575 },
      { vidaMax: 8, velocidade: 400, dano: 5, cadencia: 260, velTiro: 650 }
    ];

    this.statusNave = this.atributosNave[this.engrenagem];
    this.vidaAtual = this.statusNave.vidaMax;
    this.playerIsDead = false; 

    if (this.engrenagem <= 1) {
      this.spriteTiroJogador = "tiroaliado";
    } else if (this.engrenagem <= 3) {
      this.spriteTiroJogador = "tiroaliadoforte";
    } else {
      this.spriteTiroJogador = "tiroaliadomegapotente";
    }
  }

  create() {
    this.physics.world.gravity.y = 0;
    this.physics.world.setBounds(0, 0, 2000, 800);
    this.cameras.main.setBounds(0, 0, 2000, 800);  

    this.space = this.add.sprite(0, 0, "space1").setOrigin(0, 0).setDisplaySize(2000, 800).setScrollFactor(0.5);

    this.nave = this.physics.add.sprite(100, 400, "nave-" + (this.engrenagem + 1)).setScale(0.5);
    this.nave.setCollideWorldBounds(true);
    // Ajuste da hitbox da tua nave (mais ajustada ao sprite)
    this.nave.body.setSize(this.nave.width * 0.8, this.nave.height * 0.5); 
    this.cameras.main.startFollow(this.nave, true, 0.1, 0.1);

    this.playerBullets = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();
    this.asteroides = this.physics.add.group();

    this.nextFire = 0;
    this.enemyIndex = 0; 
    
    this.spawnNextEnemy(); 

    this.physics.add.overlap(this.playerBullets, this.enemies, this.atingirInimigo, null, this);
    this.physics.add.overlap(this.enemyBullets, this.nave, this.atingirJogador, null, this);
    this.physics.add.overlap(this.enemies, this.nave, this.colisaoCorpoACorpo, null, this);
    this.physics.add.overlap(this.asteroides, this.nave, this.colisaoAsteroide, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.desenharBarraVida();
    this.statusText = this.add.text(20, 45, "", { font: "16px Arial", fill: "#ffffff" }).setScrollFactor(0);

    this.time.addEvent({
      delay: 3500,
      loop: true,
      callback: this.spawnAsteroide,
      callbackScope: this
    });
  }

  update(time, delta) {
    if (this.playerIsDead) return; 

    this.nave.x = 100;
    this.nave.setVelocityX(0);

    if (this.cursors.up.isDown) {
      this.nave.setVelocityY(-this.statusNave.velocidade);
    } else if (this.cursors.down.isDown) {
      this.nave.setVelocityY(this.statusNave.velocidade);
    } else {
      this.nave.setVelocityY(0);
    }

    const ratoClicado = this.input.activePointer.isDown;
    if ((this.spaceKey.isDown || ratoClicado) && time > this.nextFire) {
      let tiro = this.playerBullets.create(this.nave.x + 40, this.nave.y, this.spriteTiroJogador);
      tiro.setVelocityX(this.statusNave.velTiro);
      tiro.dano = this.statusNave.dano; 
      
      // Hitbox do tiro do jogador ajustada! (Antes 20x10, agora 35x10)
      tiro.body.setSize(35, 10); 
      
      this.nextFire = time + this.statusNave.cadencia;
    }

    this.playerBullets.getChildren().forEach((b) => { if (b.x > 1150) b.destroy(); });
    this.enemyBullets.getChildren().forEach((b) => { if (b.x < -100) b.destroy(); });
    this.asteroides.getChildren().forEach((a) => { if (a.x < -100) a.destroy(); });

    this.statusText.setText(`Inimigos Derrotados: ${Math.max(0, this.enemyIndex - 1)}/4`);
  }

  spawnAsteroide() {
    if (this.playerIsDead) return;
    
    let yAleatorio = Phaser.Math.Between(50, 750);
    let asteroide = this.asteroides.create(1100, yAleatorio, "box").setScale(Phaser.Math.FloatBetween(0.6, 1.2));
    asteroide.setTint(0x8B4513); 
    asteroide.setAngle(Phaser.Math.Between(0, 360));
    asteroide.body.setCircle(25); 
    
    asteroide.setVelocityX(Phaser.Math.Between(-150, -350));
    asteroide.setAngularVelocity(Phaser.Math.Between(-100, 100));
  }

  colisaoAsteroide(jogador, asteroide) {
    if (this.playerIsDead) return;
    asteroide.destroy();
    this.computarDanoJogador(2); 
  }

  spawnNextEnemy() {
    const spawnX = 700;
    const spawnY = 400;
    let e;

    if (this.enemyIndex < 3) {
      // Usamos setFlipX(true) para espelhar a nave sem mexer na rotação!
      e = this.enemies.create(spawnX, spawnY, "naveet").setScale(0.5).setFlipX(true);
      e.body.setSize(e.width * 0.8, e.height * 0.7); // Hitbox inimiga ligeiramente mais larga
      e.hp = this.enemyIndex * 3 + 4;
      e.isBoss = false;
    } else if (this.enemyIndex === 3) {
      e = this.enemies.create(spawnX, spawnY, "naveet").setScale(1.2).setFlipX(true);
      e.body.setSize(e.width * 0.8, e.height * 0.7);
      e.hp = 40;
      e.isBoss = true;
    } else {
      return; 
    }

    e.isDead = false; 
    e.indexInimigo = this.enemyIndex;
    
    this.configurarMovimentoInimigo(e);
    this.enemyIndex++;
  }

  configurarMovimentoInimigo(inimigo) {
    if (inimigo.indexInimigo === 1) {
      this.tweens.add({
        targets: inimigo,
        y: { from: 100, to: 700 },
        duration: 1600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    } else {
      let velY = inimigo.isBoss ? 80 : 100 + (inimigo.indexInimigo * 20);
      inimigo.body.setVelocityY(velY);
      
      inimigo.moveTimer = this.time.addEvent({
        delay: 2000, loop: true,
        callback: () => {
          if (inimigo && inimigo.active && !inimigo.isDead && !inimigo.paralisado) {
            inimigo.body.setVelocityY(inimigo.body.velocity.y * -1);
          }
        }
      });
    }

    inimigo.shootTimer = this.time.addEvent({
      delay: inimigo.isBoss ? 2500 : 1300, 
      loop: true,
      callback: () => this.atirarInimigo(inimigo)
    });
  }

  atirarInimigo(inimigo) {
    if (!inimigo || !inimigo.active || inimigo.isDead || this.playerIsDead) return;

    if (inimigo.isBoss) {
      inimigo.paralisado = true; 
      let velocidadeAtual = inimigo.body.velocity.y;
      inimigo.body.setVelocityY(0);

      let aviso = this.add.rectangle(inimigo.x - 1000, inimigo.y, 2000, 8, 0xff0000, 0.4).setOrigin(0, 0.5);

      this.time.delayedCall(800, () => {
        if (!inimigo.active || inimigo.isDead) { aviso.destroy(); return; }
        aviso.destroy();

        let raio = this.enemyBullets.create(inimigo.x - 1000, inimigo.y, "tiroinimigomegapotente");
        raio.setDisplaySize(2000, 50).setOrigin(0, 0.5).setFlipX(true); // Espelha o laser se necessário
        raio.body.setSize(2000, 30); 
        raio.dano = 3; 

        this.time.delayedCall(500, () => {
          if (raio.active) raio.destroy();
          if (inimigo.active && !inimigo.isDead) {
            inimigo.paralisado = false;
            inimigo.body.setVelocityY(velocidadeAtual);
          }
        });
      });
    } 
    else if (inimigo.indexInimigo === 2) {
      let b1 = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigoforte").setVelocity(-280, 0).setFlipX(true);
      let b2 = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigoforte").setVelocity(-280, -110).setFlipX(true);
      let b3 = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigoforte").setVelocity(-280, 110).setFlipX(true);
      
      // Hitbox do tiro aumentada na largura (35x10)
      b1.body.setSize(35, 10); b2.body.setSize(35, 10); b3.body.setSize(35, 10);
      b1.dano = 1; b2.dano = 1; b3.dano = 1;
    } 
    else {
      // Aproveitei para colocar setFlipX(true) nas balas normais inimigas também
      let bala = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigo").setVelocityX(-290).setFlipX(true);
      bala.dano = 1;
      
      // Hitbox do tiro inimigo aumentada
      bala.body.setSize(35, 10); 
    }
  }

  atingirInimigo(tiro, inimigo) {
    if (!tiro.active || !inimigo.active || inimigo.isDead) return;

    inimigo.hp -= tiro.dano;
    tiro.destroy(); 
    this.tweens.add({ targets: inimigo, alpha: 0.3, duration: 50, yoyo: true, repeat: 1 });

    if (inimigo.hp <= 0) {
      inimigo.isDead = true;
      if (inimigo.shootTimer) inimigo.shootTimer.remove(); 
      inimigo.destroy();
      this.time.delayedCall(600, () => this.spawnNextEnemy()); 
    }
  }

  atingirJogador(jogador, tiroInimigo) {
    if (!tiroInimigo.active || this.playerIsDead) return;
    let dano = tiroInimigo.dano || 1;
    tiroInimigo.destroy(); 
    this.computarDanoJogador(dano); 
  }

  colisaoCorpoACorpo(jogador, inimigo) {
    if (this.playerIsDead || inimigo.isDead) return;
    this.computarDanoJogador(inimigo.isBoss ? 3 : 2);
  }

  computarDanoJogador(quantidadeDano) {
    this.vidaAtual -= quantidadeDano;
    this.vidaAtual = Phaser.Math.Clamp(this.vidaAtual, 0, this.statusNave.vidaMax);
    this.desenharBarraVida();
    this.tweens.add({ targets: this.nave, alpha: 0.2, duration: 60, yoyo: true, repeat: 2 });

    if (this.vidaAtual <= 0) {
      this.playerIsDead = true;
      this.nave.setVelocity(0, 0);
      this.nave.setTint(0xff0000); 
      this.time.delayedCall(1500, () => this.scene.start("gameover1"));
    }
  }

  desenharBarraVida() {
    if (!this.graphicsBarra) this.graphicsBarra = this.add.graphics().setScrollFactor(0);
    this.graphicsBarra.clear();
    this.graphicsBarra.fillStyle(0x333333, 1).fillRect(20, 15, 200, 20);
    this.graphicsBarra.lineStyle(2, 0x888888, 1).strokeRect(20, 15, 200, 20);
    let larguraPreenchida = (this.vidaAtual / this.statusNave.vidaMax) * 200;
    if (larguraPreenchida > 0) {
      let corBarra = 0x00ff00; 
      if (this.vidaAtual / this.statusNave.vidaMax <= 0.35) corBarra = 0xff0000; 
      else if (this.vidaAtual / this.statusNave.vidaMax <= 0.65) corBarra = 0xffa500; 
      this.graphicsBarra.fillStyle(corBarra, 1).fillRect(20, 15, larguraPreenchida, 20);
    }
  }
}

export default scene2;