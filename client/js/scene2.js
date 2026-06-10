class scene2 extends Phaser.Scene {
  constructor() {
    super({
      key: "scene2",
      physics: {
        default: "matter",
        matter: {
          gravity: { x: 0, y: 0 },
          debug: true
        }
      }
    });
  }


  init(data) {

    this.localRole = data.role;
    this.engrenagem = data.engrenagens;
    
    //this.engrenagem = data.engrenagem !== undefined ? Phaser.Math.Clamp(data.engrenagem, 0, 4) : 0;


    console.log("engrenagens:" + this.engrenagem)

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
    this.physics = this.matter;

    this.matter.world.setBounds(0, 0, 2000, 800);
    this.cameras.main.setBounds(0, 0, 2000, 800);

    this.space = this.add.tileSprite(0, 0, 2000, 800, "space1").setOrigin(0, 0).setDisplaySize(2000, 800).setScrollFactor(0);

    if (!this.anims.exists('boss_preparando')) {
      this.anims.create({ key: 'boss_preparando', frames: this.anims.generateFrameNumbers('boss', { start: 0, end: 21 }), frameRate: 15, repeat: 0 });
      this.anims.create({ key: 'boss_laser', frames: this.anims.generateFrameNumbers('boss', { start: 22, end: 33 }), frameRate: 15, repeat: -1 });
      this.anims.create({ key: 'boss_voando', frames: this.anims.generateFrameNumbers('boss', { frames: [0, 34] }), frameRate: 10, repeat: -1 });
      this.anims.create({ key: 'boss_destruido', frames: this.anims.generateFrameNumbers('boss', { start: 36, end: 51 }), frameRate: 12, repeat: 0 });
      this.anims.create({ key: 'meteoro_destruido', frames: this.anims.generateFrameNumbers('meteoro', { start: 1, end: 7 }), frameRate: 15, repeat: 0 });
      this.anims.create({ key: 'explosao_anim', frames: this.anims.generateFrameNumbers('explosao', { start: 0, end: 7 }), frameRate: 15, repeat: 0 });
    }

    if (!this.anims.exists('laser_anim')) {
      this.anims.create({ key: 'laser_anim', frames: this.anims.generateFrameNumbers('feixelaser', { start: 0, end: 5 }), frameRate: 14, repeat: -1 });
    }

    if (!this.anims.exists('escudo_anim')) {
      this.anims.create({ key: 'escudo_anim', frames: this.anims.generateFrameNumbers('escudoboss', { start: 0, end: 7 }), frameRate: 15, repeat: -1 });
    }

    if (!this.anims.exists('nave-1_voando')) {
      this.anims.create({ key: 'nave-1_voando', frames: this.anims.generateFrameNumbers('nave-1', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
      this.anims.create({ key: 'nave-2_voando', frames: this.anims.generateFrameNumbers('nave-2', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
      this.anims.create({ key: 'nave-3_voando', frames: this.anims.generateFrameNumbers('nave-3', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
      this.anims.create({ key: 'nave-4_voando', frames: this.anims.generateFrameNumbers('nave-4', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
      this.anims.create({ key: 'nave-5_voando', frames: this.anims.generateFrameNumbers('nave-5', { start: 0, end: 8 }), frameRate: 10, repeat: -1 });

      this.anims.create({ key: 'naveinimiga1_voando', frames: this.anims.generateFrameNumbers('naveinimiga1', { start: 0, end: 8 }), frameRate: 12, repeat: -1 });
      this.anims.create({ key: 'naveinimiga1_destruido', frames: this.anims.generateFrameNumbers('naveinimiga1', { start: 9, end: 14 }), frameRate: 12, repeat: 0 });

      this.anims.create({ key: 'naveinimiga2_voando', frames: this.anims.generateFrameNumbers('naveinimiga2', { start: 0, end: 13 }), frameRate: 12, repeat: -1 });
      this.anims.create({ key: 'naveinimiga2_destruido', frames: this.anims.generateFrameNumbers('naveinimiga2', { start: 14, end: 20 }), frameRate: 12, repeat: 0 });

      this.anims.create({ key: 'naveinimiga3_voando', frames: this.anims.generateFrameNumbers('naveinimiga3', { start: 0, end: 9 }), frameRate: 12, repeat: -1 });
      this.anims.create({ key: 'naveinimiga3_destruido', frames: this.anims.generateFrameNumbers('naveinimiga3', { start: 10, end: 20 }), frameRate: 12, repeat: 0 });
    }

    this.nave = this.matter.add.sprite(100, 400, "nave-" + (this.engrenagem + 1));
    this.nave.setScale(1.0); // Garante que fica no tamanho real da imagem (128x128)

    // 2. MODIFICA AQUI AS COLISÕES DO JOGADOR (UMA POR UMA)
    let pWidth, pHeight;
    switch (this.engrenagem) {
      case 0: // Nave 1 
        pWidth = 50;   // Largura da colisão em píxeis
        pHeight = 40;  // Altura da colisão em píxeis
        break;
      case 1: // Nave 2
        pWidth = 60;
        pHeight = 50;
        break;
      case 2: // Nave 3
        pWidth = 60;
        pHeight = 60;
        break;
      case 3: // Nave 4
        pWidth = 90;
        pHeight = 90;
        break;
      case 4: // Nave 5
        pWidth = 70;
        pHeight = 95;
        break;
    }
    this.nave.setRectangle(pWidth, pHeight);

    // 3. Roda a nave do jogador para a Direita
    this.nave.setAngle(90);

    this.nave.setFixedRotation();
    this.nave.setIgnoreGravity(true);
    this.nave.tipo = 'player';
    this.nave.setDepth(10);

    this.nave.play(`nave-${this.engrenagem + 1}_voando`);

    this.cameras.main.startFollow(this.nave, true, 0.1, 0.1);

    this.playerBullets = this.add.group();
    this.enemies = this.add.group();
    this.enemyBullets = this.add.group();
    this.asteroides = this.add.group();

    this.nextFire = 0;
    this.enemyIndex = 0;
    this.jogoIniciado = false;

// --- BLINDAGEM E DEBUG DA SINCRONIZAÇÃO ---
console.log("[Phaser] Minha sala atual guardada é:", this.game.room);

// 1. Primeiro preparamos o ouvido para escutar o servidor
//this.game.socket.off("start-match"); // Remove ouvintes antigos se a cena reiniciar
this.game.socket.on("start-match", () => {
  console.log("[Phaser] RECEBIDO: 'start-match' do servidor! Liberando o jogo...");
  this.jogoIniciado = true;
  
  // O Piloto inicia os loops de inimigos
  if (this.localRole === "pilot") {
    console.log("[Phaser] Sou o Piloto, iniciando spawns...");
    this.spawnNextEnemy();
    this.asteroidTimerEvent = this.time.addEvent({ 
        delay: this.frequenciaAsteroides, 
        loop: true, 
        callback: this.spawnAsteroide, 
        callbackScope: this 
    });
  }
});

// 2. Só depois de preparar o ouvido, enviamos o aviso para o servidor
if (this.game.room) {
  console.log("[Phaser] ENVIANDO: 'player-ready-scene2' para a sala", this.game.room);
  this.game.socket.emit("player-ready-scene2", this.game.room);
} else {
  console.error("[Phaser] ERRO CRÍTICO: 'this.game.room' está vazio/undefined! A sincronização vai falhar.");
}

    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach(pair => {
        let objA = pair.bodyA.gameObject;
        let objB = pair.bodyB.gameObject;
        if (!objA || !objB) return;
        this.processarColisao(objA, objB);
      });
    });

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

    //this.asteroidTimerEvent = this.time.addEvent({ delay: this.frequenciaAsteroides, loop: true, callback: this.spawnAsteroide, callbackScope: this });
  
  if (this.localRole === "shooter") {
    this.game.socket.on("ship-moved", (shipData) => {
      this.nave.x = shipData.x;
      this.nave.y = shipData.y;
    });

   this.game.socket.on("spawn-asteroid", (data) => {
      this.spawnAsteroide(null, data); 
    });

    this.game.socket.on("spawn-enemy", (data) => {
      this.spawnNextEnemy(data);
    });

    this.game.socket.on("enemy-shoot", (idUnico) => {
      let inimigo = this.enemies.getChildren().find(e => e.idUnico === idUnico);
      if (inimigo) this.atirarInimigo(inimigo, true);
    });

    this.game.socket.on("boss-attack", (data) => {
      let boss = this.enemies.getChildren().find(e => e.idUnico === data.id);
      if (boss) this.atirarInimigo(boss, data.ataque); // Força o ataque que o piloto sorteou
    });

   /* this.game.socket.on("destroy-entity", (id) => {
       this.destruirEntidadeRemota(id); // Para quando o piloto avisar que algo morreu
    });*/

  }

  // Lógica de Ambos: Os dois precisam escutar quando um tiro é disparado
  // para instanciar o laser na tela ao mesmo tempo
  this.game.socket.on("ship-shot", () => {
    this.dispararTiro(); // Sua função que cria o tiro na tela
  });

  

    

  }

  update(time, delta) {
    this.space.tilePositionX += this.velocidadeFundo;
    if (!this.jogoIniciado) return;
    if (this.playerIsDead) return;

  const pad = (this.input.gamepad && this.input.gamepad.total > 0)
    ? this.input.gamepad.getPad(0)
    : null;

    // 1. Lógica do PILOTO (Lê o gamepad e move)
  if (this.localRole === "pilot") {
    // ... (Seu código de ler o gamepad e mover a nave: this.ship.setVelocity(...))
        
    let vertical = 0;
    
    
    if (pad && pad.axes.length > 0) {
        vertical = pad.axes[1].getValue ? pad.axes[1].getValue() : pad.axes[1].value; 
    }
        
    // --- CORREÇÃO DO MOVIMENTO SUAVE ---
    // Usamos o Math.abs para verificar a deadzone tanto para cima como para baixo
    if (Math.abs(vertical) > 0.1) {
      
      this.nave.setVelocityY((vertical * this.statusNave.velocidade) / 60);
    } else { 
      // Soltou o controle ou está na deadzone
      this.nave.setVelocityY(0);
    }
      this.nave.setVelocityX(0);
    // Se a nave se moveu, avisa o servidor para atualizar a tela do atirador
    if (this.nave.body.velocity.x !== 0 || this.nave.body.velocity.y !== 0) {
      this.game.socket.emit("move-ship", {
        room: this.game.room,
        x: this.nave.x,
        y: this.nave.y
      });
    }
  }

  // 2. Lógica do ATIRADOR (Lê o botão de atirar)
  if (this.localRole === "shooter") {
    // ... (Seu código de detectar o input de tiro, ex: Phaser.Input.Keyboard.JustDown(spacebar))
    if (!this.teclaEspaco) {
        this.teclaEspaco = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      }

      let tentouAtirar = Phaser.Input.Keyboard.JustDown(this.teclaEspaco) || (pad && pad.buttons[0].pressed);

      if (tentouAtirar && time > this.nextFire) {
        this.nextFire = time + this.statusNave.cadencia;

        this.dispararTiro(); // P2 cria a bala na tela dele localmente
        this.game.socket.emit("shoot", this.game.room);
      }    
  }


    
    // Suas limpezas de tela originais:
    this.playerBullets.getChildren().forEach((b) => { if (b.x > 1150) b.destroy(); });
    this.enemyBullets.getChildren().forEach((b) => {
      if (b.texture && b.texture.key === "feixelaser") return;
      if (b.x < -100 || b.y < -100 || b.y > 900) b.destroy();
    });
    this.asteroides.getChildren().forEach((a) => { if (a.x < -100 && a.body) a.destroy(); });

    // Sua lógica de IA dos inimigos e desenho das barras de vida:
    this.enemies.getChildren().forEach((e) => {
      if (e.active && !e.isDead && e.barraVida) {
        if (e.isBoss && !e.paralisado && this.nave) {
          let speedBoss = 110 / 60;
          if (e.y < this.nave.y - 15) {
            e.setVelocityY(speedBoss);
          } else if (e.y > this.nave.y + 15) {
            e.setVelocityY(-speedBoss);
          } else {
            e.setVelocityY(0);
          }
        }
      
        e.barraVida.clear();

        if (e.isBoss) {
          if (e.escudoSprite && e.escudoSprite.active) {
            e.escudoSprite.setPosition(e.x, e.y);
          }
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
          const posY = e.y - 55;
          e.barraVida.fillStyle(0x333333, 1).fillRect(posX, posY, larguraBarra, alturaBarra);
          const percentagem = Math.max(0, e.hp / e.maxHp);
          e.barraVida.fillStyle(0xff0000, 1).fillRect(posX, posY, larguraBarra * percentagem, alturaBarra);
        }
      }
    });
  
}

  dispararTiro() {
  // Evita criar tiros se a nave já foi destruída
  if (!this.nave || !this.nave.active) return;

  let tiro = this.matter.add.sprite(this.nave.x + 70, this.nave.y, this.spriteTiroJogador);
  tiro.setRectangle(35, 10);
  tiro.setSensor(true);
  tiro.setIgnoreGravity(true);
  tiro.setFrictionAir(0);
  tiro.tipo = 'playerBullet';
  tiro.setVelocityX(this.statusNave.velTiro / 60);
  tiro.dano = this.statusNave.dano;
  tiro.setDepth(5);

  this.playerBullets.add(tiro);
}

  processarColisao(objA, objB) {
    let tipos = [objA.tipo, objB.tipo];

    if (tipos.includes('playerBullet') && tipos.includes('asteroide')) {
      let tiro = objA.tipo === 'playerBullet' ? objA : objB;
      let asteroide = objA.tipo === 'asteroide' ? objA : objB;
      this.atingirAsteroide(tiro, asteroide);
    }
    else if (tipos.includes('playerBullet') && tipos.includes('enemy')) {
      let tiro = objA.tipo === 'playerBullet' ? objA : objB;
      let enemy = objA.tipo === 'enemy' ? objA : objB;
      this.atingirInimigo(tiro, enemy);
    }
    else if (tipos.includes('enemyBullet') && tipos.includes('player')) {
      let tiroInimigo = objA.tipo === 'enemyBullet' ? objA : objB;
      let jogador = objA.tipo === 'player' ? objA : objB;
      this.atingirJogador(jogador, tiroInimigo);
    }
    else if (tipos.includes('enemy') && tipos.includes('player')) {
      let enemy = objA.tipo === 'enemy' ? objA : objB;
      let jogador = objA.tipo === 'player' ? objA : objB;
      this.colisaoCorpoACorpo(jogador, enemy);
    }
    else if (tipos.includes('asteroide') && tipos.includes('player')) {
      let asteroide = objA.tipo === 'asteroide' ? objA : objB;
      let jogador = objA.tipo === 'player' ? objA : objB;
      this.colisaoAsteroide(jogador, asteroide);
    }
  }

  /*spawnAsteroide(customY) {
    if (this.playerIsDead) return;

    let yFinal = typeof customY === 'number' ? customY : Phaser.Math.Between(50, 750);
    let escala = Phaser.Math.FloatBetween(1.2, 1.8);

    let asteroide = this.matter.add.sprite(1100, yFinal, "meteoro");
    asteroide.setCircle(14 * escala);
    asteroide.setScale(escala);
    asteroide.setSensor(true);
    asteroide.setIgnoreGravity(true);
    asteroide.setFrictionAir(0);
    asteroide.tipo = 'asteroide';

    asteroide.setFrame(0);
    asteroide.setAngle(Phaser.Math.Between(0, 360));
    asteroide.hp = Math.round(4 * this.modAmbiente);
    asteroide.setDepth(6);

    let velBase = this.enemyIndex === 4 ? -450 : -280;
    velBase = velBase * this.velModAsteroides;

    asteroide.setVelocityX(Phaser.Math.Between(velBase - 100, velBase + 50) / 60);
    asteroide.setAngularVelocity(Phaser.Math.FloatBetween(-0.04, 0.04));

    this.asteroides.add(asteroide);
  }*/
spawnAsteroide(customY, remoteData = null) {
    if (this.playerIsDead) return;

    // Se for o atirador e não recebeu dados do socket, bloqueia a criação aleatória
    if (this.localRole === "shooter" && !remoteData) return;

    let yFinal, escala, angulo, velX, angVel, astID;

    if (remoteData) {
      // ATIRADOR: Copia exatamente os valores que o Piloto mandou
      yFinal = remoteData.y;
      escala = remoteData.escala;
      angulo = remoteData.angulo;
      velX = remoteData.velX;
      angVel = remoteData.angVel;
      astID = remoteData.id;
    } else {
      // PILOTO: Sorteia os valores e avisa o servidor
      yFinal = typeof customY === 'number' ? customY : Phaser.Math.Between(50, 750);
      escala = Phaser.Math.FloatBetween(1.2, 1.8);
      angulo = Phaser.Math.Between(0, 360);
      
      let velBase = this.enemyIndex === 4 ? -450 : -280;
      velBase = velBase * this.velModAsteroides;
      velX = Phaser.Math.Between(velBase - 100, velBase + 50) / 60;
      angVel = Phaser.Math.FloatBetween(-0.04, 0.04);
      
      // Gera ID único
      if (!this.entidadeIdCount) this.entidadeIdCount = 0;
      astID = "ast_" + this.entidadeIdCount++;

      this.game.socket.emit("spawn-asteroid", {
        room: this.game.room, y: yFinal, escala: escala, angulo: angulo, velX: velX, angVel: angVel, id: astID
      });
    }

    // A partir daqui, ambos criam o objeto com os mesmos valores
    let asteroide = this.matter.add.sprite(1100, yFinal, "meteoro");
    asteroide.setCircle(14 * escala);
    asteroide.setScale(escala);
    asteroide.setSensor(true);
    asteroide.setIgnoreGravity(true);
    asteroide.setFrictionAir(0);
    asteroide.tipo = 'asteroide';
    asteroide.idUnico = astID; // Salva o ID para sabermos quem é quem

    asteroide.setFrame(0);
    asteroide.setAngle(angulo);
    asteroide.hp = Math.round(4 * this.modAmbiente);
    asteroide.setDepth(6);

    asteroide.setVelocityX(velX);
    asteroide.setAngularVelocity(angVel);

    this.asteroides.add(asteroide);
  }
  
  atingirAsteroide(tiro, asteroide) {
    if (!tiro.active || !asteroide.active || !asteroide.body) return;
    asteroide.hp -= tiro.dano;
    tiro.destroy();

    asteroide.setTint(0xff8888);
    this.time.delayedCall(50, () => { if (asteroide.active) asteroide.clearTint(); });

    if (asteroide.hp <= 0) {
      if (asteroide.body) this.matter.world.remove(asteroide.body);
      asteroide.setVelocity(0, 0);
      asteroide.setAngularVelocity(0);
      asteroide.play("meteoro_destruido");

      asteroide.on("animationcomplete", () => { asteroide.destroy(); });
    }
  }

  spawnNextEnemy(remoteData = null) {
    // Atirador não spawna sozinho pelo timer/chamada direta
    if (this.localRole === "shooter" && !remoteData) return;

    let eID;
    if (remoteData) {
      eID = remoteData.id;
      this.enemyIndex = remoteData.enemyIndex;
    } else {
      if (!this.entidadeIdCount) this.entidadeIdCount = 0;
      eID = "ene_" + this.entidadeIdCount++;
      this.game.socket.emit("spawn-enemy", { room: this.game.room, id: eID, enemyIndex: this.enemyIndex });
    }

    const spawnX = 700;
    const spawnY = 400;
    let e;

    // ... [MANTENHA TODO O SEU CÓDIGO DO MEIO EXATAMENTE COMO ESTÁ (os IFs de status, caixa de colisão, hp, boss, etc)] ...
    if (this.enemyIndex < 3) {
      let keyInimigo = "naveinimiga" + (this.enemyIndex + 1);
      e = this.matter.add.sprite(spawnX, spawnY, keyInimigo);

      // 1. Define a escala visual para mostrar cada nave no tamanho real de 128x128
      e.setScale(1.0);

      // 2. MODIFICA AQUI AS COLISÕES DOS INIMIGOS COMUNS (UMA POR UMA)
      let eWidth, eHeight;
      switch (this.enemyIndex) {
        case 0: // Nave Inimiga 1
          eWidth = 70;   // Largura da colisão em píxeis
          eHeight = 70;  // Altura da colisão em píxeis
          break;
        case 1: // Nave Inimiga 2
          eWidth = 75;
          eHeight = 75;
          break;
        case 2: // Nave Inimiga 3
          eWidth = 75;
          eHeight = 80;
          break;
      }
      e.setRectangle(eWidth, eHeight);

      // 3. Roda os inimigos comuns para a Esquerda
      e.setAngle(-90);

      // ... (restos dos comandos originais dos inimigos comuns)
      e.setSensor(true);
      e.setIgnoreGravity(true);
      e.setFixedRotation();
      e.tipo = 'enemy';
      e.setDepth(10);
      e.play(keyInimigo + "_voando");

      const hpBaseInimigosComuns = [20, 25, 30, 32, 35];
      e.hp = hpBaseInimigosComuns[this.engrenagem] + (this.enemyIndex * 5);
      e.isBoss = false;

    } else if (this.enemyIndex === 3) {
      e = this.matter.add.sprite(spawnX, spawnY, "boss");
      e.setScale(1.2);

      // 4. MODIFICA AQUI A COLISÃO DO BOSS
      e.setRectangle(110, 110); // Ajusta a caixa de colisão do Boss

      e.setAngle(-90);

      // CORREÇÃO: Propriedades de física e identificação que faltavam no Boss
      e.setSensor(true);          // Permite detetar os tiros sem criar barreiras físicas duras
      e.setIgnoreGravity(true);   // Ignora qualquer gravidade do mundo
      e.setFixedRotation();       // Impede o Boss de girar se colidir com algo
      e.tipo = 'enemy';

      e.play("boss_voando");
      e.setDepth(10);

      const hpBaseBoss = [113, 188, 263, 375, 488];
      e.hp = hpBaseBoss[this.engrenagem];

      e.isBoss = true;
      e.isInvulnerable = false;
      e.escudoSprite = null;

      this.bossText.setVisible(true);
      this.velocidadeFundo = 8;
    } else {

      return;
    }

    e.maxHp = e.hp;
    e.barraVida = this.add.graphics();
    e.isDead = false;
    e.indexInimigo = this.enemyIndex;
    e.idUnico = eID; // NOVA LINHA: Salva o ID no inimigo

    this.enemies.add(e);
    this.configurarMovimentoInimigo(e);
    
    // Incrementa apenas se for o Piloto, para manter a contagem certa (o atirador pega do remoteData)
    if (this.localRole === "pilot") {
      this.enemyIndex++;
    }
  }
  /*spawnNextEnemy() {
    const spawnX = 700;
    const spawnY = 400;
    let e;

    if (this.enemyIndex < 3) {
      let keyInimigo = "naveinimiga" + (this.enemyIndex + 1);
      e = this.matter.add.sprite(spawnX, spawnY, keyInimigo);

      // 1. Define a escala visual primeiro
      let enemyScale = (this.enemyIndex === 2) ? 1.0 : 2.0;
      e.setScale(enemyScale);

      // 2. MODIFICA AQUI AS COLISÕES DOS INIMIGOS COMUNS (UMA POR UMA)
      let eWidth, eHeight;
      switch (this.enemyIndex) {
        case 0: // Nave Inimiga 1
          eWidth = 70;   // Largura da colisão em píxeis
          eHeight = 70;  // Altura da colisão em píxeis
          break;
        case 1: // Nave Inimiga 2
          eWidth = 75;
          eHeight = 75;
          break;
        case 2: // Nave Inimiga 3
          eWidth = 75;
          eHeight = 80;
          break;
      }
      e.setRectangle(eWidth, eHeight);

      // 3. Roda os inimigos comuns para a Esquerda
      e.setAngle(-90);

      // ... (restos dos comandos originais dos inimigos comuns)
      e.setSensor(true);
      e.setIgnoreGravity(true);
      e.setFixedRotation();
      e.tipo = 'enemy';
      e.setDepth(10);
      e.play(keyInimigo + "_voando");

      const hpBaseInimigosComuns = [20, 25, 30, 32, 35];
      e.hp = hpBaseInimigosComuns[this.engrenagem] + (this.enemyIndex * 5);
      e.isBoss = false;

    } else if (this.enemyIndex === 3) {
      e = this.matter.add.sprite(spawnX, spawnY, "boss");
      e.setScale(1.2);

      // 4. MODIFICA AQUI A COLISÃO DO BOSS
      e.setRectangle(110, 110); // Ajusta a caixa de colisão do Boss

      e.setAngle(-90);

      // CORREÇÃO: Propriedades de física e identificação que faltavam no Boss
      e.setSensor(true);          // Permite detetar os tiros sem criar barreiras físicas duras
      e.setIgnoreGravity(true);   // Ignora qualquer gravidade do mundo
      e.setFixedRotation();       // Impede o Boss de girar se colidir com algo
      e.tipo = 'enemy';

      e.play("boss_voando");
      e.setDepth(10);

      const hpBaseBoss = [113, 188, 263, 375, 488];
      e.hp = hpBaseBoss[this.engrenagem];

      e.isBoss = true;
      e.isInvulnerable = false;
      e.escudoSprite = null;

      this.bossText.setVisible(true);
      this.velocidadeFundo = 8;
    } else {

      return;
    }
    e.maxHp = e.hp;
    e.barraVida = this.add.graphics();
    e.isDead = false;
    e.indexInimigo = this.enemyIndex;

    this.enemies.add(e);
    this.configurarMovimentoInimigo(e);
    this.enemyIndex++;
  }*/

  configurarMovimentoInimigo(inimigo) {
    if (inimigo.isBoss) {
      inimigo.paralisado = false;
    } else if (inimigo.indexInimigo === 1) {
      this.tweens.add({ targets: inimigo, y: { from: 100, to: 700 }, duration: 1600 / this.modAmbiente, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    } else {
      let velY = (100 + (inimigo.indexInimigo * 20)) * this.modAmbiente;
      inimigo.minhaVelocidadeY = velY / 60;
      inimigo.setVelocityY(inimigo.minhaVelocidadeY);

      inimigo.moveTimer = this.time.addEvent({
        delay: 2000, loop: true,
        callback: () => {
          if (inimigo && inimigo.active && !inimigo.isDead && !inimigo.paralisado) {
            inimigo.minhaVelocidadeY *= -1;
            inimigo.setVelocityY(inimigo.minhaVelocidadeY);
          }
        }
      });
    }

    if (this.localRole === "pilot") {
      inimigo.shootTimer = this.time.addEvent({
        delay: inimigo.isBoss ? 6000 : (1300 / this.modAmbiente),
        loop: true,
        callback: () => this.atirarInimigo(inimigo)
      });
    }

    /*inimigo.shootTimer = this.time.addEvent({
      delay: inimigo.isBoss ? 6000 : (1300 / this.modAmbiente),
      loop: true,
      callback: () => this.atirarInimigo(inimigo)
    });*/
  }

  atirarInimigo(inimigo, ataqueForcado = null) {
    if (!inimigo || !inimigo.active || inimigo.isDead || this.playerIsDead) return;

    if (inimigo.isBoss) {
      // --- INÍCIO DA MODIFICAÇÃO DO BOSS ---
      let sorteioAtaque;
      
      // Se veio um ataque pelo socket, usa ele. Se não (Piloto), sorteia e emite.
      if (ataqueForcado) {
        sorteioAtaque = ataqueForcado;
      } else {
        sorteioAtaque = Phaser.Math.Between(1, 6);
        if (sorteioAtaque === 4 && inimigo.isInvulnerable) {
          sorteioAtaque = 2;
        }
        this.game.socket.emit("boss-attack", { room: this.game.room, id: inimigo.idUnico, ataque: sorteioAtaque });
      }

      inimigo.paralisado = true;
      inimigo.setVelocityY(0);
      inimigo.play("boss_preparando");

      this.time.delayedCall(800, () => {
        if (!inimigo.active || inimigo.isDead) return;

        if (sorteioAtaque === 1) {
          inimigo.play("boss_laser");

          let aviso = this.add.rectangle(inimigo.x - 1000, inimigo.y, 2000, 8, 0xff0000, 0.4).setOrigin(0.5, 0.5);

          for (let i = 0; i < 10; i++) {
            this.time.delayedCall(i * 180, () => {
              if (this.playerIsDead || !inimigo.active || inimigo.isDead) return;
              let astY;
              do { astY = Phaser.Math.Between(50, 750); } while (Math.abs(astY - inimigo.y) < 90);
              this.spawnAsteroide(astY);
            });
          }

          this.time.delayedCall(500, () => {
            if (!inimigo.active || inimigo.isDead) { aviso.destroy(); return; }
            aviso.destroy();

            let raio = this.matter.add.sprite(inimigo.x - 1000, inimigo.y, "feixelaser");
            raio.setRectangle(256, 32);
            raio.setScale(7.8125, 0.9375);
            raio.setSensor(true);
            raio.setIgnoreGravity(true);
            raio.setFixedRotation();
            raio.setFrictionAir(0);
            raio.tipo = 'laser_carregando';

            raio.play("laser_anim", true);
            raio.dano = 3;
            raio.setDepth(5);
            this.enemyBullets.add(raio);
            this.time.delayedCall(200, () => {
              if (raio.active) raio.tipo = 'enemyBullet';
            });

            this.time.delayedCall(2000, () => {
              if (raio.active) raio.destroy();
              if (inimigo.active && !inimigo.isDead) {
                inimigo.paralisado = false;
                inimigo.play("boss_voando");
              }
            });
          });

        } else if (sorteioAtaque === 4) {
          inimigo.isInvulnerable = true;
          inimigo.play("boss_voando");

          inimigo.escudoSprite = this.add.sprite(inimigo.x, inimigo.y, "escudoboss").setScale(1.3).setDepth(11);
          inimigo.escudoSprite.play("escudo_anim", true);

          this.time.addEvent({
            delay: 600,
            repeat: 6,
            callback: () => {
              if (!inimigo.active || inimigo.isDead || this.playerIsDead) return;
              let angulos = [165, 180, 195];
              angulos.forEach(ang => {
                let b = this.matter.add.sprite(inimigo.x - 50, inimigo.y, "tiroinimigoforte");
                b.setRectangle(20, 20);
                b.setSensor(true);
                b.setIgnoreGravity(true);
                b.setFrictionAir(0);
                b.tipo = 'enemyBullet'; 
                this.enemyBullets.add(b);

                let rad = Phaser.Math.DegToRad(ang);
                let speed = 360 / 60;
                b.setVelocity(Math.cos(rad) * speed, Math.sin(rad) * speed);

                b.setAngle(ang);
                b.setDepth(5);
                b.dano = 1;
                this.enemyBullets.add(b);
              });
            }
          });

          this.time.delayedCall(4500, () => {
            if (inimigo.active && !inimigo.isDead) {
              inimigo.isInvulnerable = false;
              if (inimigo.escudoSprite) {
                inimigo.escudoSprite.destroy();
                inimigo.escudoSprite = null;
              }
              inimigo.paralisado = false;
            }
          });

        } else {
          inimigo.play("boss_voando");

          if (sorteioAtaque === 2) {
            let angulosDiferentes = [135, 150, 165, 180, 195, 210, 225];
            angulosDiferentes.forEach(angulo => {
              let bala = this.matter.add.sprite(inimigo.x - 50, inimigo.y, "tiroinimigoforte");
              bala.setRectangle(20, 20);
              bala.setSensor(true);
              bala.setIgnoreGravity(true);
              bala.setFrictionAir(0);
              bala.tipo = 'enemyBullet';

              let rad = Phaser.Math.DegToRad(angulo);
              let speed = 400 / 60;
              bala.setVelocity(Math.cos(rad) * speed, Math.sin(rad) * speed);

              bala.setAngle(angulo);
              bala.setDepth(5);
              bala.dano = 1;
              this.enemyBullets.add(bala);
            });
          }
          else if (sorteioAtaque === 3) {
            for (let i = 0; i < 6; i++) {
              this.time.delayedCall(i * 180, () => {
                if (!inimigo.active || inimigo.isDead) return;
                let bala = this.matter.add.sprite(inimigo.x - 50, inimigo.y, "tiroinimigo");
                bala.setRectangle(35, 10);
                bala.setSensor(true);
                bala.setIgnoreGravity(true);
                bala.setFrictionAir(0);
                bala.tipo = 'enemyBullet';

                bala.setVelocityX(-480 / 60);
                bala.setAngle(180);
                bala.setDepth(5);
                bala.dano = 1;
                this.enemyBullets.add(bala);
              });
            }
          }
          else if (sorteioAtaque === 5) {
            for (let i = 0; i < 4; i++) {
              this.time.delayedCall(i * 300, () => {
                this.spawnAsteroide();
                if (!inimigo.active || inimigo.isDead) return;
                let bala = this.matter.add.sprite(inimigo.x - 50, inimigo.y, "tiroinimigo");
                bala.setRectangle(35, 10);
                bala.setSensor(true);
                bala.setIgnoreGravity(true);
                bala.setFrictionAir(0);
                bala.tipo = 'enemyBullet';
                bala.setVelocityX(-450 / 60);
                bala.setAngle(180);
                bala.setDepth(5);
                bala.dano = 1;
                this.enemyBullets.add(bala);
              });
            }
          }
          else if (sorteioAtaque === 6) {
            for (let angulo = 0; angulo < 360; angulo += 30) {
              let bala = this.matter.add.sprite(inimigo.x, inimigo.y, "tiroinimigoforte");
              bala.setCircle(10);
              bala.setSensor(true);
              bala.setIgnoreGravity(true);
              bala.setFrictionAir(0);
              bala.tipo = 'enemyBullet';

              let rad = Phaser.Math.DegToRad(angulo);
              let speed = 300 / 60;
              bala.setVelocity(Math.cos(rad) * speed, Math.sin(rad) * speed);

              bala.setAngle(angulo);
              bala.setDepth(5);
              bala.dano = 1;
              this.enemyBullets.add(bala);
            }
          }

          this.time.delayedCall(500, () => {
            if (inimigo.active && !inimigo.isDead) {
              inimigo.paralisado = false;
            }
          });
        }
      });
    }
    else {
      if (!ataqueForcado && this.localRole === "pilot") {
        this.game.socket.emit("enemy-shoot", inimigo.idUnico);
      }

      let velTiroComum = -290 * (this.modAmbiente >= 1 ? this.modAmbiente : 0.8);
      let vX = velTiroComum / 60;

      if (inimigo.indexInimigo === 2) {
        // Ajustamos o Y de cada tiro para nascerem separados (asa superior, centro e asa inferior)
        // Assim eles espalham de forma limpa sem nunca se cruzarem na saída!

        // Tiro 1: Centro
        let b1 = this.matter.add.sprite(inimigo.x - 70, inimigo.y, "tiroinimigoforte");
        b1.setRectangle(35, 10); b1.setSensor(true); b1.setIgnoreGravity(true); b1.setFrictionAir(0); b1.tipo = 'enemyBullet';
        b1.setVelocity(vX, 0); b1.setAngle(180); b1.setDepth(5); b1.dano = 1;
        this.enemyBullets.add(b1);

        // Tiro 2: Asa de Cima (subtraímos 30 píxeis no Y)
        let b2 = this.matter.add.sprite(inimigo.x - 70, inimigo.y - 30, "tiroinimigoforte");
        b2.setRectangle(35, 10); b2.setSensor(true); b2.setIgnoreGravity(true); b2.setFrictionAir(0); b2.tipo = 'enemyBullet';
        b2.setVelocity(vX, -110 / 60); b2.setRotation(Math.atan2(-110, velTiroComum)); b2.setDepth(5); b2.dano = 1;
        this.enemyBullets.add(b2);

        // Tiro 3: Asa de Baixo (somamos 30 píxeis no Y)
        let b3 = this.matter.add.sprite(inimigo.x - 70, inimigo.y + 30, "tiroinimigoforte");
        b3.setRectangle(35, 10); b3.setSensor(true); b3.setIgnoreGravity(true); b3.setFrictionAir(0); b3.tipo = 'enemyBullet';
        b3.setVelocity(vX, 110 / 60); b3.setRotation(Math.atan2(110, velTiroComum)); b3.setDepth(5); b3.dano = 1;
        this.enemyBullets.add(b3);
      } else {
        let bala = this.matter.add.sprite(inimigo.x - 70, inimigo.y, "tiroinimigo");
        bala.setRectangle(35, 10); bala.setSensor(true); bala.setIgnoreGravity(true); bala.setFrictionAir(0); bala.tipo = 'enemyBullet';
        bala.setVelocityX(vX);
        bala.setAngle(180);
        bala.setDepth(5);
        bala.dano = 1;
        this.enemyBullets.add(bala);
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

    inimigo.setTint(0xff3333);
    this.time.delayedCall(100, () => { if (inimigo && inimigo.active) inimigo.clearTint(); });

    if (inimigo.hp <= 0) {
      inimigo.isDead = true;
      this.tweens.killTweensOf(inimigo);
      if (inimigo.shootTimer) inimigo.shootTimer.remove();
      if (inimigo.moveTimer) inimigo.moveTimer.remove();

      inimigo.setVelocity(0, 0);
      if (inimigo.barraVida) inimigo.barraVida.destroy();

      if (inimigo.isBoss) {
        if (inimigo.escudoSprite) {
          inimigo.escudoSprite.destroy();
          inimigo.escudoSprite = null;
        }

        this.graphicsBarraBoss.clear();
        if (this.bossText) this.bossText.destroy();
        this.velocidadeFundo = 2;

        if (inimigo.body) this.matter.world.remove(inimigo.body);
        inimigo.play("boss_destruido");

        this.time.delayedCall(1800, () => {
          inimigo.destroy();
          this.time.delayedCall(600, () => this.spawnNextEnemy());
        });

      } else {
        if (inimigo.body) this.matter.world.remove(inimigo.body);

        let keyInimigo = "naveinimiga" + (inimigo.indexInimigo + 1);
        inimigo.play(keyInimigo + "_destruido");

        inimigo.on("animationcomplete", () => {
          inimigo.destroy();
        });

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

  colisaoAsteroide(jogador, asteroide) {
    if (this.playerIsDead || !asteroide.active || !asteroide.body) return;
    if (asteroide.body) this.matter.world.remove(asteroide.body);
    asteroide.setVelocity(0, 0);
    asteroide.setAngularVelocity(0);
    asteroide.play("meteoro_destruido");
    asteroide.on("animationcomplete", () => { asteroide.destroy(); });

    this.computarDanoJogador(2);
  }

  computarDanoJogador(quantidadeDano) {
    this.vidaAtual -= quantidadeDano;
    this.vidaAtual = Phaser.Math.Clamp(this.vidaAtual, 0, this.statusNave.vidaMax);
    this.desenharBarraVida();

    this.nave.setTint(0xff3333);
    this.time.delayedCall(150, () => { if (!this.playerIsDead && this.nave.active) this.nave.clearTint(); });

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