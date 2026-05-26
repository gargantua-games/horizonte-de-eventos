class scene2 extends Phaser.Scene {
  constructor() {
    super("scene2");
  }

  init(data) {
    // Recebe os cartões/engrenagens da fase anterior (0 a 4)
    this.engrenagem = data.engrenagem !== undefined ? Phaser.Math.Clamp(data.engrenagem, 0, 4) : 0;

    // DEFINIÇÃO DE ATRIBUTOS DO JOGADOR BASEADO NAS ENGRENAGENS (0 a 4)
    // Engrenagem 0 = atributos mais fracos (Nave 1)
    const atributosNave = [
      { vidaMax: 3, velocidade: 200, dano: 1, cadencia: 600, velTiro: 350 }, // 0 Engrenagens (Nave 1)
      { vidaMax: 4, velocidade: 250, dano: 2, cadencia: 500, velTiro: 425 }, // 1 Engrenagem  (Nave 2)
      { vidaMax: 5, velocidade: 300, dano: 3, cadencia: 420, velTiro: 500 }, // 2 Engrenagens (Nave 3)
      { vidaMax: 6, velocidade: 350, dano: 4, cadencia: 340, velTiro: 575 }, // 3 Engrenagens (Nave 4)
      { vidaMax: 8, velocidade: 400, dano: 5, cadencia: 260, velTiro: 650 }  // 4 Engrenagens (Nave 5)
    ];

    // Atribui os dados atuais da nave do jogador conforme o índice obtido
    this.statusNave = atributosNave[this.engrenagem];
    this.vidaAtual = this.statusNave.vidaMax;
    this.playerIsDead = false; // Estado de sobrevivência do jogador
  }

  create() {
    // 1. Configuração do Mundo Horizontal (2000x800)
    this.physics.world.gravity.y = 0;
    this.physics.world.setBounds(0, 0, 2000, 800);
    this.cameras.main.setBounds(0, 0, 2000, 800);  

    // Fundo espacial
    this.space = this.add.sprite(0, 0, "space1");
    this.space.setOrigin(0, 0).setDisplaySize(2000, 800).setScrollFactor(0.5);

    // 2. Sprite da Nave dinâmico de acordo com as engrenagens (naves1 a naves5)
    let texturaNave = "naves" + (this.engrenagem + 1);
    this.nave = this.physics.add.sprite(100, 400, texturaNave).setScale(0.5);
    this.nave.setCollideWorldBounds(true);
    
    // A câmera segue a nave do jogador
    this.cameras.main.startFollow(this.nave, true, 0.1, 0.1);

    // 3. Grupos de Física para os tiros e inimigos
    this.playerBullets = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();

    this.nextFire = 0;

    // 4. Controle Sequencial de Inimigos
    this.enemyIndex = 0; 
    this.spawnNextEnemy(); 

    // 5. Configuração de Colisão e Overlaps
    this.physics.add.overlap(this.playerBullets, this.enemies, this.atingirInimigo, null, this);
    
    // Novas colisões: Dano causado no Jogador
    this.physics.add.overlap(this.enemyBullets, this.nave, this.atingirJogador, null, this);
    this.physics.add.overlap(this.enemies, this.nave, this.colisaoCorpoACorpo, null, this);

    // 6. Controles por teclado
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // 7. Criação dos Elementos Gráficos da Interface (HUD)
    this.desenharBarraVida();

    // Texto de progresso posicionado logo abaixo da barra de vida gráfica
    this.statusText = this.add.text(20, 45, "", { font: "16px Arial", fill: "#ffffff" }).setScrollFactor(0);
  }

  update(time, delta) {
    if (this.playerIsDead) return; // Se o jogador morreu, impede os comandos de update

    // Movimentação Vertical (Usa a velocidade customizada da nave atual)
    if (this.cursors.up.isDown) {
      this.nave.setVelocityY(-this.statusNave.velocidade);
    } else if (this.cursors.down.isDown) {
      this.nave.setVelocityY(this.statusNave.velocidade);
    } else {
      this.nave.setVelocityY(0);
    }

    // Movimentação Horizontal
    if (this.cursors.left.isDown) {
      this.nave.setVelocityX(-this.statusNave.velocidade);
    } else if (this.cursors.right.isDown) {
      this.nave.setVelocityX(this.statusNave.velocidade);
    } else {
      this.nave.setVelocityX(0); 
    }

    // Lógica de Tiro (Espaço ou Clique do Mouse)
    const ratoClicado = this.input.activePointer.isDown;
    if ((this.spaceKey.isDown || ratoClicado) && time > this.nextFire) {
      this.atirar(time);
    }

    // Limpeza de memória dos tiros fora da tela
    this.playerBullets.getChildren().forEach((bullet) => {
      if (bullet.x > this.cameras.main.scrollX + 1150) {
        bullet.destroy();
      }
    });

    this.enemyBullets.getChildren().forEach((bullet) => {
      if (bullet.x < this.cameras.main.scrollX - 100) {
        bullet.destroy();
      }
    });

    // Atualiza HUD de texto
    this.statusText.setText(`Cartões: ${this.engrenagem}/4 | Inimigos Derrotados: ${this.enemyIndex - 1}/4`);
  }

  // DESENHO DA BARRA DE VIDA GRÁFICA (Estilo Retrô)
  desenharBarraVida() {
    if (!this.graphicsBarra) {
      this.graphicsBarra = this.add.graphics().setScrollFactor(0);
    }
    this.graphicsBarra.clear();

    // 1. Fundo da barra (Preto com borda cinza)
    this.graphicsBarra.fillStyle(0x333333, 1);
    this.graphicsBarra.fillRect(20, 15, 200, 20);
    this.graphicsBarra.lineStyle(2, 0x888888, 1);
    this.graphicsBarra.strokeRect(20, 15, 200, 20);

    // 2. Calcula preenchimento proporcional à vida restante
    let larguraPreenchida = (this.vidaAtual / this.statusNave.vidaMax) * 200;

    if (larguraPreenchida > 0) {
      // Muda a cor baseado no nível de perigo
      let corBarra = 0x00ff00; // Verde padrão
      if (this.vidaAtual / this.statusNave.vidaMax <= 0.35) {
        corBarra = 0xff0000; // Vermelho se estiver muito baixa
      } else if (this.vidaAtual / this.statusNave.vidaMax <= 0.65) {
        corBarra = 0xffa500; // Laranja se estiver moderada
      }

      this.graphicsBarra.fillStyle(corBarra, 1);
      this.graphicsBarra.fillRect(20, 15, larguraPreenchida, 20);
    }
  }

  // FUNÇÃO QUE PROCESSA A FILA (Garante um por vez)
  spawnNextEnemy() {
    let e;

    if (this.enemyIndex === 0) {
      e = this.enemies.create(600, 300, "naveet").setScale(0.5).setAngle(-90);
      e.hp = 3; 
      e.isDead = false; 
      this.configurarMovimentoInimigo(e, 100);

    } else if (this.enemyIndex === 1) {
      e = this.enemies.create(1000, 500, "naveet").setScale(0.5).setAngle(-90);
      e.hp = 5; 
      e.isDead = false;
      this.configurarMovimentoInimigo(e, 120);

    } else if (this.enemyIndex === 2) {
      e = this.enemies.create(1400, 200, "naveet").setScale(0.5).setAngle(-90);
      e.hp = 7; 
      e.isDead = false;
      this.configurarMovimentoInimigo(e, 150);

    } else if (this.enemyIndex === 3) {
      e = this.enemies.create(1800, 400, "naveet").setScale(1.2).setAngle(-90);
      e.isBoss = true;
      e.hp = 40; 
      e.isDead = false;
      this.configurarMovimentoInimigo(e, 80);

    } else {
      this.statusText.setText("VITÓRIA! TODOS OS ETS FORAM DESTRUÍDOS!");
      return;
    }

    this.enemyIndex++;
  }

  // LOGICA DO TIRO JOGADOR -> INIMIGO
  atingirInimigo(tiro, inimigo) {
    if (!tiro.active || !inimigo.active || inimigo.isDead) {
      return;
    }

    // Aplica o dano dinâmico de acordo com o nível da sua nave
    inimigo.hp -= tiro.dano;
    tiro.destroy(); 

    this.tweens.add({
      targets: inimigo,
      alpha: 0.3,
      duration: 50,
      yoyo: true,
      repeat: 1
    });

    if (inimigo.hp <= 0) {
      inimigo.isDead = true; 
      inimigo.destroy();
      this.spawnNextEnemy(); 
    }
  }

  // LÓGICA DE DANO CONTRA O JOGADOR (Tiro Inimigo)
  atingirJogador(jogador, tiroInimigo) {
    if (!tiroInimigo.active || this.playerIsDead) return;

    tiroInimigo.destroy(); // Remove o projétil alienígena
    this.computarDanoJogador(1); // Tiros normais tiram 1 de vida
  }

  // LÓGICA DE DANO POR COLISÃO DIRETA COM O ET
  colisaoCorpoACorpo(jogador, inimigo) {
    if (this.playerIsDead || inimigo.isDead) return;

    // Se bater de frente com o Boss o impacto é maior
    let danoImpacto = inimigo.isBoss ? 3 : 2;
    this.computarDanoJogador(danoImpacto);

    // Empurra um pouco o jogador para trás para não prender a colisão contínua
    this.nave.x -= 40;
  }

  // SISTEMA UNIFICADO DE PERDA DE VIDA DO PLAYER
  computarDanoJogador(quantidadeDano) {
    this.vidaAtual -= quantidadeDano;
    this.vidaAtual = Phaser.Math.Clamp(this.vidaAtual, 0, this.statusNave.vidaMax);
    
    // Atualiza a barra visual instantaneamente
    this.desenharBarraVida();

    // Efeito de piscar a tela vermelha ou a própria nave
    this.tweens.add({
      targets: this.nave,
      alpha: 0.2,
      duration: 60,
      yoyo: true,
      repeat: 2
    });

    // Verificação de derrota
    if (this.vidaAtual <= 0) {
      this.playerIsDead = true;
      this.nave.setVelocity(0, 0);
      this.nave.setTint(0xff0000); // Fica inteira vermelha indicando destruição

      // Aguarda 1.5 segundos e vai para a tela de game over correspondente
      this.time.delayedCall(1500, () => {
        this.scene.start("gameover2"); 
      });
    }
  }

  configurarMovimentoInimigo(inimigo, velocidadeY) {
    inimigo.body.setVelocityY(velocidadeY);
    
    // Movimento de patrulha vertical
    this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => {
        if (inimigo && inimigo.active && !inimigo.isDead) {
          inimigo.body.setVelocityY(inimigo.body.velocity.y * -1);
        }
      }
    });

    // Inimigos atiram
    this.time.addEvent({
      delay: inimigo.isBoss ? 700 : 1400,
      loop: true,
      callback: () => {
        if (inimigo && inimigo.active && !inimigo.isDead && !this.playerIsDead) {
          this.enemyBullets.create(inimigo.x - 30, inimigo.y, "ativaraliens").setVelocityX(-280); 
        }
      }
    });
  }

  atirar(tempoAtual) {
    // Aplica os parâmetros de cadência, velocidade e dano obtidos da lista de status customizados
    let tiro = this.playerBullets.create(this.nave.x + 40, this.nave.y, "ativaraliens");
    tiro.setVelocityX(this.statusNave.velTiro);
    tiro.dano = this.statusNave.dano; 

    this.nextFire = tempoAtual + this.statusNave.cadencia;
  }
}

export default scene2;