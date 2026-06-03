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

    this.velocidadeFundo = 2;

    if (this.engrenagem <= 1) {
      this.modAmbiente = 1.6; 
      this.frequenciaAsteroides = 1600;  
      this.velModAsteroides = 1.4;
    } else if (this.engrenagem === 2) {
      this.modAmbiente = 1.0;
      this.frequenciaAsteroides = 3000;
      this.velModAsteroides = 1.0;
    } else {
      this.modAmbiente = 0.6;
      this.frequenciaAsteroides = 4500;
      this.velModAsteroides = 0.7;
    }
  }

  create() {
    this.physics.world.gravity.y = 0;
    this.physics.world.setBounds(0, 0, 2000, 800);
    this.cameras.main.setBounds(0, 0, 2000, 800);  

    this.space = this.add.tileSprite(0, 0, 2000, 800, "space1").setOrigin(0, 0).setDisplaySize(2000, 800).setScrollFactor(0);

    if (!this.anims.exists('boss_destruido')) {
      this.anims.create({ key: 'boss_destruido', frames: this.anims.generateFrameNumbers('boss', { start: 0, end: 17 }), frameRate: 10, repeat: 0 });
      this.anims.create({ key: 'boss_escudo', frames: this.anims.generateFrameNumbers('boss', { start: 18, end: 23 }), frameRate: 12, repeat: -1 });
      this.anims.create({ key: 'boss_preparando', frames: this.anims.generateFrameNumbers('boss', { start: 24, end: 35 }), frameRate: 15, repeat: 0 });
      this.anims.create({ key: 'boss_laser', frames: this.anims.generateFrameNumbers('boss', { start: 36, end: 41 }), frameRate: 15, repeat: -1 });
      this.anims.create({ key: 'boss_voando', frames: this.anims.generateFrameNumbers('boss', { start: 42, end: 49 }), frameRate: 15, repeat: -1 });
    }

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
    this.bossText = this.add.text(400, 15, "PROTOTYPE: BOSS", { font: "bold 18px Arial", fill: "#ff0000" })
      .setScrollFactor(0).setOrigin(0.5, 0).setVisible(false); 

    this.add.text(20, 520, "TESTAR NAVES:", { font: "bold 12px Arial", fill: "#ffff00" }).setScrollFactor(0);
    const botoesNave = [
      { nome: "Nave 1", valor: 0, posX: 20 },
      { nome: "Nave 2", valor: 1, posX: 80 },
      { nome: "Nave 3", valor: 2, posX: 140 },
      { nome: "Nave 4", valor: 3, posX: 200 },
      { nome: "Nave 5", valor: 4, posX: 260 }
    ];

    botoesNave.forEach(btnConfig => {
      let botaoVisual = this.add.text(btnConfig.posX, 540, `[ ${btnConfig.nome} ]`, { font: "11px Arial", fill: "#00ffff" })
        .setScrollFactor(0).setInteractive({ useHandCursor: true });
      botaoVisual.on('pointerdown', () => this.scene.restart({ engrenagem: btnConfig.valor }));
    });

    this.input.keyboard.on('keydown-ONE', () => this.scene.restart({ engrenagem: 0 }));
    this.input.keyboard.on('keydown-TWO', () => this.scene.restart({ engrenagem: 1 }));
    this.input.keyboard.on('keydown-THREE', () => this.scene.restart({ engrenagem: 2 }));
    this.input.keyboard.on('keydown-FOUR', () => this.scene.restart({ engrenagem: 3 }));
    this.input.keyboard.on('keydown-FIVE', () => this.scene.restart({ engrenagem: 4 }));

    this.asteroidTimerEvent = this.time.addEvent({ delay: this.frequenciaAsteroides, loop: true, callback: this.spawnAsteroide, callbackScope: this });
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
    this.enemyBullets.getChildren().forEach((b) => { if (b.x < -100 || b.y < -100 || b.y > 900) b.destroy(); });
    this.asteroides.getChildren().forEach((a) => { if (a.x < -100) a.destroy(); });

    this.enemies.getChildren().forEach((e) => {
      if (e.active && !e.isDead && e.barraVida) {
        e.barraVida.clear();
        
        if (e.isBoss) {
          this.graphicsBarraBoss.clear();
          this.graphicsBarraBoss.fillStyle(0x333333, 1).fillRect(150, 45, 500, 20);
          
          let corBorda = e.isInvulnerable ? 0x00aaff : 0xff0000;
          this.graphicsBarraBoss.lineStyle(2, corBorda, 1).strokeRect(150, 45, 500, 20);

          const percentagemBoss = Math.max(0, e.hp / e.maxHp);
          this.graphicsBarraBoss.fillStyle(0xff0000, 1).fillRect(150, 45, 500 * percentagemBoss, 20);
        } else {
          const larguraBarra = 50; 
          const alturaBarra = 6;
          const posX = e.x - larguraBarra / 2;
          const posY = e.y - 50; 

          e.barraVida.fillStyle(0x333333, 1).fillRect(posX, posY, larguraBarra, alturaBarra);
          const percentagem = Math.max(0, e.hp / e.maxHp);
          e.barraVida.fillStyle(0xff0000, 1).fillRect(posX, posY, larguraBarra * percentagem, alturaBarra);
        }
      }
    });

    this.statusText.setText(`Inimigos Derrotados: ${Math.max(0, this.enemyIndex - 1)}/4`);
  }

  spawnAsteroide() {
    if (this.playerIsDead) return;
    let yAleatorio = Phaser.Math.Between(50, 750);
    
    let asteroide = this.asteroides.create(1100, yAleatorio, "meteoro").setScale(Phaser.Math.FloatBetween(0.8, 1.2));
    asteroide.setAngle(Phaser.Math.Between(0, 360));
    asteroide.body.setCircle(35); 
    asteroide.hp = Math.round(4 * this.modAmbiente); 
    
    let velBase = this.enemyIndex === 4 ? -450 : -280;
    velBase = velBase * this.velModAsteroides;

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
        let pedacinho = this.add.rectangle(asteroide.x, asteroide.y, 8, 8, 0x888888);
        this.physics.add.existing(pedacinho);
        pedacinho.body.setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(-150, 150));
        this.tweens.add({ targets: pedacinho, alpha: 0, duration: 600, onComplete: () => pedacinho.destroy() });
      }
      asteroide.destroy(); 
    }
  }

  spawnNextEnemy() {
    const spawnX = 700;
    const spawnY = 400;
    let e;

    if (this.enemyIndex < 3) {
      e = this.enemies.create(spawnX, spawnY, "naveet").setScale(0.5).setFlipX(true);
      e.body.setSize(e.width * 0.8, e.height * 0.7); 
      
      const hpBaseInimigosComuns = [20, 25, 30, 32, 35]; 
      e.hp = hpBaseInimigosComuns[this.engrenagem] + (this.enemyIndex * 5);
      e.isBoss = false;
      
    } else if (this.enemyIndex === 3) {
      e = this.enemies.create(spawnX, spawnY, "boss").setScale(1.2);
      e.setAngle(-90); 
      e.play("boss_voando");
      e.body.setSize(100, 100); 

      const hpBaseBoss = [150, 250, 350, 500, 650]; 
      e.hp = hpBaseBoss[this.engrenagem]; 
      
      e.isBoss = true;
      e.isInvulnerable = false;

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
      this.tweens.add({ targets: inimigo, y: { from: 100, to: 700 }, duration: 1600 / this.modAmbiente, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    } else {
      let velY = inimigo.isBoss ? 80 : (100 + (inimigo.indexInimigo * 20)) * this.modAmbiente;
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
      delay: inimigo.isBoss ? 5000 : (1300 / this.modAmbiente), 
      loop: true,
      callback: () => this.atirarInimigo(inimigo)
    });
  }

  atirarInimigo(inimigo) {
    if (!inimigo || !inimigo.active || inimigo.isDead || this.playerIsDead) return;

    if (inimigo.isBoss) {
      let sorteioAtaque = Phaser.Math.Between(1, 6);
      
      inimigo.paralisado = true; 
      let velocidadeAtual = inimigo.body.velocity.y;
      inimigo.body.setVelocityY(0);
      
      inimigo.play("boss_preparando"); 

      this.time.delayedCall(800, () => {
        if (!inimigo.active || inimigo.isDead) return;

        if (sorteioAtaque === 1) {
          inimigo.play("boss_laser"); 
          let aviso = this.add.rectangle(inimigo.x - 1000, inimigo.y, 2000, 8, 0xff0000, 0.4).setOrigin(0, 0.5);

          this.time.delayedCall(500, () => {
            if (!inimigo.active || inimigo.isDead) { aviso.destroy(); return; }
            aviso.destroy();

            let raio = this.enemyBullets.create(inimigo.x - 1000, inimigo.y, "feixelaser");
            raio.setDisplaySize(2000, 60).setOrigin(0, 0.5); 
            raio.body.setSize(2000, 40); 
            raio.dano = 3; 

            this.time.delayedCall(2000, () => { 
              if (raio.active) raio.destroy();
              if (inimigo.active && !inimigo.isDead) {
                inimigo.paralisado = false;
                inimigo.body.setVelocityY(velocidadeAtual);
                inimigo.play("boss_voando");
              }
            });
          });

        } else if (sorteioAtaque === 4) {
          if (!inimigo.isInvulnerable) { 
            inimigo.isInvulnerable = true;
            inimigo.play("boss_escudo"); 

            let ataqueEscudoEvent = this.time.addEvent({
              delay: 600,
              repeat: 6,
              callback: () => {
                if (!inimigo.active || inimigo.isDead || this.playerIsDead) return;
                let angulos = [165, 180, 195];
                angulos.forEach(ang => {
                  let b = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigoforte");
                  this.physics.velocityFromAngle(ang, 360, b.body.velocity);
                  b.setAngle(ang); // <-- Corrige o ângulo visual do projétil
                  b.dano = 1;
                });
              }
            });

            this.time.delayedCall(5000, () => {
              if (inimigo.active && !inimigo.isDead) {
                inimigo.isInvulnerable = false;
                inimigo.paralisado = false;
                inimigo.body.setVelocityY(velocidadeAtual);
                inimigo.play("boss_voando");
              }
            });
          } else {
            inimigo.paralisado = false;
            inimigo.body.setVelocityY(velocidadeAtual);
            inimigo.play("boss_voando");
          }

        } else {
          inimigo.play("boss_voando");

          if (sorteioAtaque === 2) {
            let angulosDiferentes = [135, 150, 165, 180, 195, 210, 225];
            angulosDiferentes.forEach(angulo => {
              let bala = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigoforte");
              this.physics.velocityFromAngle(angulo, 400, bala.body.velocity);
              bala.setAngle(angulo); // <-- Rotação para os tiros em leque
              bala.body.setSize(20, 20);
              bala.dano = 1;
            });
          } 
          else if (sorteioAtaque === 3) {
            for (let i = 0; i < 6; i++) {
              this.time.delayedCall(i * 180, () => {
                if (!inimigo.active || inimigo.isDead) return;
                let bala = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigo").setVelocityX(-480);
                bala.setAngle(180); // <-- Tiro reto apontando para a esquerda
                bala.body.setSize(35, 10);
                bala.dano = 1;
              });
            }
          }
          else if (sorteioAtaque === 5) {
            for (let i = 0; i < 4; i++) {
              this.time.delayedCall(i * 300, () => this.spawnAsteroide());
            }
          }
          else if (sorteioAtaque === 6) {
            for (let angulo = 0; angulo < 360; angulo += 30) {
              let bala = this.enemyBullets.create(inimigo.x, inimigo.y, "tiroinimigoforte");
              this.physics.velocityFromAngle(angulo, 300, bala.body.velocity);
              bala.setAngle(angulo); // <-- Anel de tiros rodado corretamente
              bala.body.setCircle(10);
              bala.dano = 1;
            }
          }

          this.time.delayedCall(500, () => {
            if (inimigo.active && !inimigo.isDead) {
              inimigo.paralisado = false;
              inimigo.body.setVelocityY(velocidadeAtual);
            }
          });
        }
      });
    } 
    else {
      let velTiroComum = -290 * (this.modAmbiente >= 1 ? this.modAmbiente : 0.8);
      
      if (inimigo.indexInimigo === 2) {
        let b1 = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigoforte").setVelocity(velTiroComum, 0);
        b1.setAngle(180);
        
        let b2 = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigoforte").setVelocity(velTiroComum, -110);
        b2.setRotation(Math.atan2(-110, velTiroComum)); // Calcula a rotação certa com base no Y e X
        
        let b3 = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigoforte").setVelocity(velTiroComum, 110);
        b3.setRotation(Math.atan2(110, velTiroComum)); 
        
        b1.body.setSize(35, 10); b2.body.setSize(35, 10); b3.body.setSize(35, 10);
        b1.dano = 1; b2.dano = 1; b3.dano = 1;
      } else {
        let bala = this.enemyBullets.create(inimigo.x - 50, inimigo.y, "tiroinimigo").setVelocityX(velTiroComum);
        bala.setAngle(180);
        bala.dano = 1;
        bala.body.setSize(35, 10); 
      }
    }
  }

  atingirInimigo(tiro, inimigo) {
    if (!tiro.active || !inimigo.active || inimigo.isDead) return;

    if (inimigo.isInvulnerable) {
      tiro.destroy();
      return; 
    }

    inimigo.hp -= tiro.dano;
    tiro.destroy(); 
    this.tweens.add({ targets: inimigo, alpha: 0.3, duration: 50, yoyo: true, repeat: 1 });

    if (inimigo.hp <= 0) {
      inimigo.isDead = true;
      if (inimigo.shootTimer) inimigo.shootTimer.remove(); 
      if (inimigo.moveTimer) inimigo.moveTimer.remove(); 
      
      inimigo.setVelocity(0, 0); 
      
      if (inimigo.barraVida) inimigo.barraVida.destroy(); 

      if (inimigo.isBoss) {
        this.graphicsBarraBoss.clear();
        if (this.bossText) this.bossText.destroy();
        this.velocidadeFundo = 2; 

        inimigo.play("boss_destruido");
        
        this.time.delayedCall(1800, () => {
          if (typeof text !== 'undefined') text.destroy();
          inimigo.destroy();
          this.time.delayedCall(600, () => this.spawnNextEnemy()); 
        });

      } else {
        inimigo.destroy();
        this.time.delayedCall(600, () => this.spawnNextEnemy()); 
      }
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
      this.time.delayedCall(1500, () => this.scene.start("gameover1")); // <-- Corrigido para gameover1
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

