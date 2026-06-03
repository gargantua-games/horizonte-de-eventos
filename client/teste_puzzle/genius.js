export default class Genius extends Phaser.Scene {
  constructor() {
    super("genius");
    this.lendotutorial = false;
  }

  init(data) {
    this.portaId = data.portaId;
    this.cenaOrigem = data.cenaOrigem;

    this.sequencia = [];
    this.jogadaAtual = 0;
    this.podeJogar = false;
    this.rodada = 0;
    this.maxRodadas = 8;
  }

    create() {
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;

      this.cameras.main.setZoom(0.5);
        this.cameras.main.centerOn(width / 2, height / 1.2);
        
    console.log("A cena Genius carregou com sucesso no ecrã!");

      this.comojogar = this.physics.add.sprite(1160, -10, "comojogar");
      this.comojogar.setScrollFactor(0);
      this.comojogar.body.allowGravity = false;
      this.comojogar.setDepth(2);
      this.comojogar.setScale(5);
      this.comojogar.setInteractive({ cursor: "pointer" });

      this.fundocomojogar = this.physics.add.sprite(600, 210, "bigIa");
      this.fundocomojogar.setVisible(false);
      this.fundocomojogar.setScrollFactor(0);
      this.fundocomojogar.body.allowGravity = false;
      this.fundocomojogar.setDepth(1);
      this.fundocomojogar.setScale(3.5);

      this.comojogarText = this.add
        .text(
          600,
          215,
          "Primeiro, um quadrado brilhará/aumentará de tamanho.\nDepois, você deve apertar o quadrado correspondente\n(ou seja, o mesmo quadrado que acabou de se destacar).\nA cada rodada, adiciona-se um elemento\n(quadrado brilhando/aumentado de tamanho) à sequência.\nVocê deve lembrar corretamente qual a sequência para completar esse desafio.\nClique em como jogar de novo para fechar o tutorial e recomeçar o desafio",
          {
            fill: "#00ff0d",
            fontFamily: "sarpanchregular",
            fontSize: "45px",
          },
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(101)
        .setVisible(false);

      this.comojogar.on("pointerdown", () => {
        if (this.lendotutorial === false) {
          this.comojogarText.setVisible(true);
          this.lendotutorial = true;
          this.fundocomojogar.setVisible(true);
          //this.scene.pause();
        } else if (this.lendotutorial === true) { 
          this.lendotutorial = false;
          this.comojogarText.setVisible(false);
          this.fundocomojogar.setVisible(false);
          this.scene.restart();
        }
      
    });

    // Fundo escuro do terminal
    this.add.rectangle(640, 360, 1280, 720, 0x111111);

    this.textoStatus = this.add
      .text(640, 100, "MEMORIZE A SEQUÊNCIA", {
        fontSize: "44px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.cores = [
      { normal: 0x880000, brilho: 0xff0000 }, // 0: Vermelho
      { normal: 0x008800, brilho: 0x00ff00 }, // 1: Verde
      { normal: 0x000088, brilho: 0x0088ff }, // 2: Azul
      { normal: 0x888800, brilho: 0xffff00 }, // 3: Amarelo
    ];

    // SÍMBOLOS PARA ACESSIBILIDADE DE DALTÓNICOS
    // Cada botão ganha uma forma geométrica única e universal
    const simbolos = ["▲", "■", "●", "◆"];

    this.botoes = [];

    const posicoes = [
      { x: 530, y: 250 },
      { x: 750, y: 250 },
      { x: 530, y: 470 },
      { x: 750, y: 470 },
    ];

    for (let i = 0; i < 4; i++) {
      let btn = this.add
        .rectangle(posicoes[i].x, posicoes[i].y, 200, 200, this.cores[i].normal)
        .setInteractive({ useHandCursor: true })
        .setStrokeStyle(4, 0x333333);

      let textoSimbolo = this.add
        .text(posicoes[i].x, posicoes[i].y, simbolos[i], {
          fontSize: "70px",
          fill: "#ffffff",
          fontStyle: "bold",
        })
        .setOrigin(0.5);

      btn.textoAssociado = textoSimbolo;

      // Deixamos APENAS este evento de clique. Toda a lógica passa para dentro dele.
      btn.on("pointerdown", () => this.cliqueBotao(i));

      this.botoes.push(btn);
    }
    this.time.delayedCall(1000, () => this.proximaRodada());
  }

  proximaRodada() {
    this.rodada++;
    this.jogadaAtual = 0;
    this.podeJogar = false;

    this.textoStatus.setText(`RODADA ${this.rodada} DE ${this.maxRodadas}`);
    this.textoStatus.setColor("#ffffff");
    this.sequencia.push(Phaser.Math.Between(0, 3));
    this.mostrarSequencia();
  }

  mostrarSequencia() {
    let tempoAtraso = 600;
    for (let i = 0; i < this.sequencia.length; i++) {
      let corIndice = this.sequencia[i];
      this.time.delayedCall(tempoAtraso, () => {
        this.piscarBotao(corIndice, 400);
      });
      tempoAtraso += 800;
    }
    this.time.delayedCall(tempoAtraso, () => {
      this.textoStatus.setText("SUA VEZ!");
      this.textoStatus.setColor("#00ffff");
      this.podeJogar = true;
    });
  }

  piscarBotao(indice, duracao) {
    let btn = this.botoes[indice];
    btn.fillColor = this.cores[indice].brilho; // Acende a cor

    // Efeito de feedback extra no símbolo (aumenta o tamanho ligeiramente)
    if (btn.textoAssociado) {
      btn.textoAssociado.setScale(1.3);
      btn.textoAssociado.setColor("#ffffff");
    }

    this.time.delayedCall(duracao, () => {
      btn.fillColor = this.cores[indice].normal; // Apaga a cor

      // Volta o símbolo ao tamanho normal
      if (btn.textoAssociado) {
        btn.textoAssociado.setScale(1.0);
      }
    });
  }

  cliqueBotao(indice) {
    if (!this.podeJogar) return; // Ignora se o jogo estiver a mostrar a sequência

    // 1. O clique é válido, por isso fazemos o botão piscar IMEDIATAMENTE
    // antes de mudar qualquer estado de vitória ou derrota
    this.piscarBotao(indice, 200);

    // 2. Verificar se acertou na sequência
    if (indice === this.sequencia[this.jogadaAtual]) {
      this.jogadaAtual++;

      // Ver se acertou todos os passos da rodada atual
      if (this.jogadaAtual === this.sequencia.length) {
        this.podeJogar = false; // Bloqueia novos cliques enquanto processa o sucesso

        if (this.rodada === this.maxRodadas) {
          // Pequeno atraso para o jogador conseguir ver o último brilho antes do ecrã de vitória
          this.time.delayedCall(300, () => this.vencerPuzzle());
        } else {
          this.textoStatus.setText("MUITO BEM!");
          this.textoStatus.setColor("#00ff00");
          this.time.delayedCall(1000, () => this.proximaRodada());
        }
      }
    } else {
      // Clicou no botão errado!
      this.derrotaJogo();
    }
  }

  vencerPuzzle() {
    this.textoStatus.setText("ACESSO CONCEDIDO!");
    this.textoStatus.setColor("#00ff00");
    this.botoes.forEach((btn) => (btn.fillColor = 0x00ff00));
    this.time.delayedCall(2000, () => {
       ///if (!this.fase4) {
        /// this.scene.get(this.cenaOrigem).abrirPorta(this.portaId);
      //}
      this.scene.get(this.cenaOrigem).abrirPorta(this.portaId);
      this.scene.stop();
    });
  }

  derrotaJogo() {
    this.podeJogar = false;
    this.textoStatus.setText("SEQUÊNCIA INVÁLIDA! REINICIANDO...");
    this.textoStatus.setColor("#ff0000");
    this.botoes.forEach((btn) => (btn.fillColor = 0xff0000));
    this.time.delayedCall(2000, () => {
      this.scene.restart();
    });
  }
}
