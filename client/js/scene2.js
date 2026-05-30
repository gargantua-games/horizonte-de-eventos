class scene2 extends Phaser.Scene {
  constructor() {
    super("scene2");
  }

  init(data) {
    this.engrenagem = data.engrenagem !== undefined ? Phaser.Math.Clamp(data.engrenagem, 0, 4) : 0;

    this.atributosNave = [
      { vidaMax: 3, velocidade: 200, dano: 1, cadencia: 600, velTiro: 350 }, // 0 Engrenagens (Nave 1)
      { vidaMax: 4, velocidade: 250, dano: 2, cadencia: 500, velTiro: 425 }, // 1 Engrenagem  (Nave 2)
      { vidaMax: 5, velocidade: 300, dano: 3, cadencia: 420, velTiro: 500 }, // 2 Engrenagens (Nave 3)
      { vidaMax: 6, velocidade: 350, dano: 4, cadencia: 340, velTiro: 575 }, // 3 Engrenagens (Nave 4)
      { vidaMax: 8, velocidade: 400, dano: 5, cadencia: 260, velTiro: 650 }  // 4 Engrenagens (Nave 5)
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

    this.velocidadeFundo = 2;
  }

  create() {
    this.physics.world.gravity.y = 0;
    this.physics.world.setBounds(0, 0, 2000, 800);
    this.cameras.main.setBounds(0, 0, 2000, 800);  

    this.space = this.add.tileSprite(0, 0, 2000, 800, "space1").setOrigin(0, 0).setDisplaySize(2000, 800).setScrollFactor(0);

    this.nave = this.physics.add.sprite(100, 400, "nave-" + (this.engrenagem + 1)).setScale(0.5);
    this.nave.setCollideWorldBounds(true);
    this.nave.body.setSize(this.nave.width * 0.8, this.nave.height * 0.5); 
    this.cameras.main.startFollow(this.nave, true, 0.1, 0.1);

    this.playerBullets = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();
    this.asteroides = this.physics.add.group();

    this.nextFire = 0;
    this.enemyIndex = 0; 
    
    this.spawnNextEnemy(); 

    this.physics.add.overlap(this.playerBullets, this.asteroides, this.atingirAsteroide, null, this);
    this.physics.add.overlap(this.playerBullets, this.enemies, this.atingirInimigo, null, this);
    this.physics.add.overlap(this.enemyBullets, this.nave, this.atingirJogador, null, this);
    this.physics.add.overlap(this.enemies, this.nave, this.colisaoCorpoACorpo, null, this);
    this.physics.add.overlap(this.asteroides, this.nave, this.colisaoAsteroide, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.desenharBarraVida();
    this.statusText = this.add.text(20, 45, "", { font: "16px Arial", fill: "#ffffff" }).setScrollFactor(0);

    this.graphicsBarraBoss = this.add.graphics().setScrollFactor(0);
    this.bossText = this.add.text(400, 15, "BOSS ENEMY", { font: "bold 18px Arial", fill: "#ff0000" })
      .setScrollFactor(0)
      .setOrigin(0.5, 0)
      .setVisible(false); 

    // ==========================================
    // NOVO: BOTÕES E ATALHOS DE TESTE (DEBUG)
    // ==========================================
    this.add.text(20, 520, "TESTAR NAVES:", { font: "bold 12px Arial", fill: "#ffff00" }).setScrollFactor(0);
    
    const botoesNave = [
      { nome: "Nave 1 (0 Eng)", valor: 0, posX: 20 },
      { nome: "Nave 2 (1 Eng)", valor: 1, posX: 130 },
      { nome: "Nave 3 (2 Eng)", valor: 2, posX: 240 },
      { nome: "Nave 4 (3 Eng)", valor: 3, posX: 350 },
      { nome: "Nave 5 (4 Eng)", valor: 4, posX: 460 }
    ];

    botoesNave.forEach(btnConfig => {
      let botaoVisual = this.add.text(btnConfig.posX, 540, `[ ${btnConfig.nome} ]`, { font: "11px Arial", fill: "#00ffff" })
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true });

      botaoVisual.on('pointerover', () => botaoVisual.setStyle({ fill: '#ffffff' }));
      botaoVisual.on('pointerout', () => botaoVisual.setStyle({ fill: '#00ffff' }));
      botaoVisual.on('pointerdown', () => {
        this.scene.restart({ engrenagem: btnConfig.valor });
      });
    });

    // Atalhos do teclado (Teclas 1, 2, 3, 4, 5)
    this.input.keyboard.on('keydown-ONE', () => this.scene.restart({ engrenagem: 0 }));
    this.input.keyboard.on('keydown-TWO', () => this.scene.restart({ engrenagem: 1 }));
    this.input.keyboard.on('keydown-THREE', () => this.scene.restart({ engrenagem: 2 }));
    this.input.keyboard.on('keydown-FOUR', () => this.scene.restart({ engrenagem: 3 }));
    this.input.keyboard.on('keydown-FIVE', () => this.scene.restart({ engrenagem: 4 }));
    // ==========================================

    this.time.addEvent({
      delay: 3500,
      loop: true,
      callback: this.spawnAsteroide,
      callbackScope: this
    });
  }

  update(time, delta) {
    this.space.tilePositionX += this.velocidadeFundo;

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
      tiro.body.setSize(35, 10); 
      this.nextFire = time + this.statusNave.cadencia;
    }

    this.playerBullets.getChildren().forEach((b) => { if (b.x > 1150) b.destroy(); });
    this.enemyBullets.getChildren().forEach((b) => { if (b.x < -100) b.destroy(); });
    this.asteroides.getChildren().forEach((a) => { if (a.x < -100) a.destroy(); });

    this.enemies.getChildren().forEach((e) => {
      if (e.active && !e.isDead && e.barraVida) {
        e.barraVida.clear();
        
        if (e.isBoss) {
          this.graphicsBarraBoss.clear();
          
          this.graphicsBarraBoss.fillStyle(0x333333, 1);
          this.graphicsBarraBoss.fillRect(150, 45, 500, 20);
          this.graphicsBarraBoss.lineStyle(2, 0xff0000, 1).strokeRect(150, 45, 500, 20);

          const percentagemBoss = Math.max(0, e.hp / e.maxHp);
          this.graphicsBarraBoss.fillStyle(0xff0000, 1);
          // CORRIGIDO: Nome da variável consertado aqui para evitar o erro de ReferenceError
          this.graphicsBarraBoss.fillRect(150, 45, 500 * percentagemBoss, 20);
        } else {
          const larguraBarra = 50; 
          const alturaBarra = 6;
          const posX = e.x - larguraBarra / 2;
          const posY = e.y - 50; 

          e.barraVida.fillStyle(0x333333, 1);
          e.barraVida.fillRect(posX, posY, larguraBarra, alturaBarra);

          const percentagem = Math.max(0, e.hp / e.maxHp);
          e.barraVida.fillStyle(0xff0000, 1);
          e.barraVida.fillRect(posX, posY, larguraBarra * percentagem, alturaBarra);
        }
      }
    });

    this.statusText.setText(`Inimigos Derrotados: ${Math.max(0, this.enemyIndex - 1)}/4`);
  }

  spawnAsteroide() {
    if (this.playerIsDead) return;
    
    let yAleatorio = Phaser.Math.Between(50, 750);
    let asteroide = this.asteroides.create(1100, yAleatorio, "box").setScale(Phaser.Math.FloatBetween(0.6, 1.2));
    asteroide.setTint(0x8B4513); 
    asteroide.setAngle(Phaser.Math.Between(0, 360));
    asteroide.body.setCircle(25); 
    
    asteroide.hp = 3; 
    
    let velBase = this.enemyIndex === 4 ? -400 : -250;
    asteroide.setVelocityX(Phaser.Math.Between(velBase - 100, velBase + 50));
    asteroide.setAngularVelocity(Phaser.Math.Between(-100, 100));
  }

  atingirAsteroide(tiro, asteroide) {
    if (!tiro.active || !asteroide.active) return;

    asteroide.hp -= tiro.dano;
    tiro.destroy(); 
    
    this.tweens.add({ targets: asteroide, alpha: 0.5, duration: 50, yoyo: true, repeat: 1 });

    if (asteroide.hp <= 0) {
      for(let i = 0; i < 5; i++) {
        let pedacinho = this.add.rectangle(asteroide.x, asteroide.y, 10, 10, 0x8B4513);
        this.physics.add.existing(pedacinho);
        pedacinho.body.setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(-150, 150));
        
        this.tweens.add({ targets: pedacinho, alpha: 0, duration: 600, onComplete: () => pedacinho.destroy() });
      }
      asteroide.destroy(); 
    }
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
      e = this.enemies.create(spawnX, spawnY, "naveet").setScale(0.5).setFlipX(true);
      e.body.setSize(e.width * 0.8, e.height * 0.7); 
      e.hp = this.enemyIndex * 3 + 4;
      e.isBoss = false;
    } else if (this.enemyIndex === 3) {
      e = this.enemies.create(spawnX, spawnY, "naveet").setScale(1.2).setFlipX(true);
      e.body.setSize(e.width * 0.8, e.height * 0.7);
      e.hp = 50; 
      e.isBoss = true;

      this.bossText.setVisible(true);
      this.velocidadeFundo = 8; 
    } else {
      return; 
    }

    e.maxHp = e.hp; 
    e.barraVida = this.add.graphics(); 
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
      delay: inimigo.isBoss ? 2000 : 1300, 
      loop: true,
      callback: () => this.atirarInimigo(inimigo)
    });
  }

  atirarInimigo(inimigo) {
    if (!inimigo || !inimigo.active || inimigo.isDead || this.playerIsDead) return;

    if (inimigo.isBoss) {
      let sorteioAtaque = Phaser.Math.Between(1, 3);

      if (sorteioAtaque === 1) {
        inimigo.paralisado = true; 
        let velocidadeAtual = inimigo.body.velocity.y;
        inimigo.body.setVelocityY(0);

        let aviso = this.add.rectangle(inimigo.x - 1000, inimigo.y, 2000, 8, 0xff0000, 0.4).setOrigin(0, 0.5);

        this.time.delayedCall(800, () => {
          if (!inimigo.active || inimigo.isDead) { aviso.destroy(); return; }
          aviso.destroy();

          let raio = this.enemyBullets.create(inimigo.x - 1000, inimigo.y, "tiroinimigomegapotente");
          raio.setDisplaySize(2000, 50).setOrigin(0, 0.5).setFlipX(true); 
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

      } else if (sorteioAtaque === 2) {
        let velocidadesY = [-200, -100, 0, 100, 200];
        velocidadesY.forEach(vy => {
          let bala = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigoforte").setVelocity(-300, vy).setFlipX(true);
          bala.body.setSize(35, 10);
          bala.dano = 1;
        });

      } else if (sorteioAtaque === 3) {
        for (let i = 0; i < 4; i++) {
          this.time.delayedCall(i * 200, () => {
            if (!inimigo.active || inimigo.isDead) return;
            let bala = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigo").setVelocityX(-400).setFlipX(true);
            bala.body.setSize(35, 10);
            bala.dano = 1;
          });
        }
      }
    } 
    else if (inimigo.indexInimigo === 2) {
      let b1 = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigoforte").setVelocity(-280, 0).setFlipX(true);
      let b2 = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigoforte").setVelocity(-280, -110).setFlipX(true);
      let b3 = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigoforte").setVelocity(-280, 110).setFlipX(true);
      b1.body.setSize(35, 10); b2.body.setSize(35, 10); b3.body.setSize(35, 10);
      b1.dano = 1; b2.dano = 1; b3.dano = 1;
    } 
    else {
      let bala = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigo").setVelocityX(-290).setFlipX(true);
      bala.dano = 1;
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
      if (inimigo.barraVida) inimigo.barraVida.destroy(); 
      
      if (inimigo.isBoss) {
        this.graphicsBarraBoss.clear();
        this.bossText.destroy();
        this.velocidadeFundo = 2; 
      }

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