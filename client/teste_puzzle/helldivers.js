export default class helldivers extends Phaser.Scene {
  constructor() {
    super("helldivers");
    this.lendotutorial = false;
  }

  init(data = {}) {
    this.portaId = data.portaId;
    this.cenaOrigem = data.cenaOrigem;
    this.onComplete = data.onComplete;
    this.jogoTerminou = false;

    // Banco de Estratagemas inspirados no Helldivers 2
    this.bancoEstratagemas = [
      {
        nome: "SENHA DO LOGIN DO USUÁRIO",
        seq: ["UP", "DOWN", "RIGHT", "LEFT", "UP"],
      },
      {
        nome: "SENHA DO LOGIN DA CONTA DOODLE",
        seq: ["UP", "RIGHT", "DOWN", "DOWN", "DOWN"],
      },
      { nome: "SENHA DO EMAIL", seq: ["RIGHT", "DOWN", "UP", "RIGHT", "DOWN"] },
      { nome: "NOVA SENHA", seq: ["UP", "RIGHT", "DOWN", "RIGHT", "DOWN"] },
      {
        nome: "CAPTCHA, VOCÊ É UM ROBÔ?",
        seq: ["DOWN", "LEFT", "DOWN", "UP", "UP", "RIGHT"],
      },
      {
        nome: "PERGUNTA DE SEGURANÇA",
        seq: ["DOWN", "RIGHT", "DOWN", "UP", "LEFT", "RIGHT"],
      },
    ];

    // Configurações da partida
    this.estratagemasDaRonda = [];
    this.indiceAtual = 0; // Qual estratagema estamos a resolver
    this.teclaAtualIndex = 0; // Qual seta da sequência estamos à espera
    this.inputBloqueado = false; // Bloqueia teclas por erro

    this.tempoMaximo = 7000; // 7 segundos por estratagema
    this.tempoRestante = this.tempoMaximo;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.cameras.main.setZoom(0.7);
    this.cameras.main.centerOn(width / 2, height / 1.3);

    this.comojogar = this.physics.add.sprite(675, 50, "comojogar");
    this.comojogar.setScrollFactor(0);
    this.comojogar.body.allowGravity = false;
    this.comojogar.setDepth(2);
    this.comojogar.setScale(3.5);
    this.comojogar.setInteractive({ cursor: "pointer" });

    this.fundocomojogar = this.physics.add.sprite(600, 210, "bigIa");
    this.fundocomojogar.setVisible(false);
    this.fundocomojogar.setScrollFactor(0);
    this.fundocomojogar.body.allowGravity = false;
    this.fundocomojogar.setDepth(1);
    this.fundocomojogar.setScale(2);

    this.comojogarText = this.add
      .text(
        650,
        215,
        "Aperte as teclas das setas correspondentes à sequência.\nMas rápido, o seu tempo é limitado!\nClique em (como jogar) de novo para fechar o tutorial e recomeçar o desafio.",
        {
          fill: "#00ff0d",
          fontFamily: "sarpanchregular",
          fontSize: "30px",
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

    // Fundo estilo Terminal Militar (Preto/Verde Escuro)
    this.add.rectangle(400, 300, 800, 600, 0x050b08);

    // Moldura Amarela Neon
    let moldura = this.add.graphics();
    moldura.lineStyle(4, 0x19ba04, 0.8);
    moldura.strokeRect(40, 40, 720, 520);

    // Textos principais da Interface
    this.add
      .text(400, 75, "★ MESTRE DAS SENHAS ★", {
        fontSize: "36px",
        fill: "#49f075",
        fontStyle: "bold",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    this.txtPlacar = this.add
      .text(400, 130, "", {
        fontSize: "20px",
        fill: "#ffffff",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    this.txtNomeEstratagema = this.add
      .text(400, 220, "", {
        fontSize: "36px",
        fill: "#ffffff",
        fontStyle: "bold",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    // Componentes Visuais
    this.containerSetas = this.add.container(400, 320);
    this.barraGrafica = this.add.graphics();

    // Escolhe 3 estratagemas aleatórios para esta ronda do puzzle
    Phaser.Utils.Array.Shuffle(this.bancoEstratagemas);
    this.estratagemasDaRonda = this.bancoEstratagemas.slice(0, 3);

    this.carregarEstratagema();

    // Escuta os inputs do teclado (Setas e WASD)
    this.input.keyboard.on("keydown", this.tratarInput, this);
  }

  update(time, delta) {
    if (this.jogoTerminou) return;

    // Se o input estiver bloqueado, pausa o cronômetro e mantém a barra parada
    if (!this.inputBloqueado) {
      this.tempoRestante -= delta;
      if (this.tempoRestante <= 0) {
        this.tempoRestante = 0;
        this.falharSequencia("TEMPO ESGOTADO!");
      }
    }

    this.desenharBarraTempo();
  }

  carregarEstratagema() {
    if (this.indiceAtual >= this.estratagemasDaRonda.length) {
      this.vencerJogo();
      return;
    }

    let atual = this.estratagemasDaRonda[this.indiceAtual];
    this.teclaAtualIndex = 0;
    this.tempoRestante = this.tempoMaximo; // Reseta o cronómetro

    // Atualiza textos
    //this.txtPlacar.setText(`PROGRESSO DO TERMINAL: ${this.indiceAtual} / ${this.estratagemasDaRonda.length}`);
    this.txtNomeEstratagema.setText(atual.nome);
    this.txtNomeEstratagema.setStyle({ fill: "#ffffff" });

    // Recria os ícones das setas no ecrã
    this.containerSetas.removeAll(true);

    const espacamento = 60;
    const larguraTotal = (atual.seq.length - 1) * espacamento;
    const inicioX = -larguraTotal / 2;

    atual.seq.forEach((direcao, i) => {
      let textoSeta = this.converterDirecaoParaSeta(direcao);

      // Cria o fundo do quadrado da seta
      let fundo = this.add
        .rectangle(inicioX + i * espacamento, 0, 45, 45, 0x1a2621)
        .setStrokeStyle(2, 0x444444);

      // Cria o texto da seta (Cinza por padrão)
      let txt = this.add
        .text(inicioX + i * espacamento, 0, textoSeta, {
          fontSize: "32px",
          fill: "#777777",
          fontStyle: "bold",
        })
        .setOrigin(0.5);

      // Guardamos a referência do texto para pintar mais tarde
      fundo.setData("textoRef", txt);
      this.containerSetas.add([fundo, txt]);
    });
  }

  tratarInput(event) {
    if (this.jogoTerminou || this.inputBloqueado) return;

    // Mapeamento de setas e WASD
    let teclaPremida = null;
    switch (event.key.toUpperCase()) {
      case "ARROWUP":
        //case "W":
        teclaPremida = "UP";
        break;
      case "ARROWDOWN":
        //case "S":
        teclaPremida = "DOWN";
        break;
      case "ARROWLEFT":
        //case "A":
        teclaPremida = "LEFT";
        break;
      case "ARROWRIGHT":
        //case "D":
        teclaPremida = "RIGHT";
        break;
    }

    if (!teclaPremida) return; // Se for outra tecla qualquer, ignora

    let atual = this.estratagemasDaRonda[this.indiceAtual];
    let teclaCorreta = atual.seq[this.teclaAtualIndex];

    if (teclaPremida === teclaCorreta) {
      // ACERTOU! Altera a cor do caractere para Amarelo Helldiver
      let pecaFundo = this.containerSetas.list[this.teclaAtualIndex * 2];
      let pecaTexto = pecaFundo.getData("textoRef");

      pecaTexto.setStyle({ fill: "#00c42a" });
      pecaFundo.setStrokeStyle(2, 0xffcc00);

      // Efeito visual rápido de clique correto
      this.tweens.add({
        targets: pecaTexto,
        scale: 1.3,
        duration: 50,
        yoyo: true,
      });

      this.teclaAtualIndex++;

      // Verificou se completou o código todo do estratagema
      if (this.teclaAtualIndex >= atual.seq.length) {
        this.indiceAtual++;
        this.cameras.main.flash(200, 0, 255, 0); // Flash verde de sucesso
        this.carregarEstratagema();
      }
    } else {
      // ERROU! Reseta o progresso deste estratagema específico
      this.falharSequencia("CÓDIGO INCORRETO! REINICIANDO...");
    }
  }

  falharSequencia(mensagem) {
    if (this.inputBloqueado || this.jogoTerminou) return;

    this.inputBloqueado = true;
    this.txtNomeEstratagema.setText(mensagem);
    this.txtNomeEstratagema.setStyle({ fill: "#ff3333" });
    this.teclaAtualIndex = 0;

    // Deixa todas as setas cinzentas novamente
    for (let i = 0; i < this.containerSetas.list.length; i += 2) {
      let fundo = this.containerSetas.list[i];
      let txt = fundo.getData("textoRef");
      if (txt) txt.setStyle({ fill: "#777777" });
      fundo.setStrokeStyle(2, 0x444444);
    }

    this.time.delayedCall(2000, () => {
      this.scene.restart();
    });
  }

  desenharBarraTempo() {
    this.barraGrafica.clear();

    let pct = this.tempoRestante / this.tempoMaximo;
    let larguraBarra = 500 * pct;

    // Desenha a calha cinzenta de fundo da barra
    this.barraGrafica.fillStyle(0x222222, 1);
    this.barraGrafica.fillRect(150, 420, 500, 20);

    // Desenha a barra preenchida (muda de amarelo para vermelho quando estiver no fim)
    let corBarra = pct > 0.3 ? 0xffcc00 : 0xff3333;
    this.barraGrafica.fillStyle(corBarra, 1);
    this.barraGrafica.fillRect(150, 420, larguraBarra, 20);
  }

  converterDirecaoParaSeta(direcao) {
    switch (direcao) {
      case "UP":
        return "↑";
      case "DOWN":
        return "↓";
      case "LEFT":
        return "←";
      case "RIGHT":
        return "→";
      default:
        return "?";
    }
  }

  vencerJogo() {
    this.jogoTerminou = true;
    this.barraGrafica.clear();

    this.txtNomeEstratagema.setText("SENHAS CORRETAS!");
    this.txtNomeEstratagema.setStyle({ fill: "#00ff00" });

    this.add
      .text(400, 320, "ACESSO CONCEDIDO", {
        fontSize: "48px",
        fill: "#00ff00",
        fontStyle: "bold",
        fontFamily: "monospace",
        backgroundColor: "#000000",
      })
      .setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      if (typeof this.onComplete === "function") {
        this.onComplete();
      } else if (this.cenaOrigem && this.portaId !== undefined) {
        this.scene.get(this.cenaOrigem).abrirPorta(this.portaId);
      }
      this.scene.stop();
    });
  }
}
