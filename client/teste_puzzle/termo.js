export default class termo extends Phaser.Scene {
  constructor() {
    super("termo");
    this.lendotutorial = false;
  }

  init(data) {
    this.portaId = data.portaId;
    this.cenaOrigem = data.cenaOrigem;

    // O teu novo banco de dados (Array) com palavras de 5 letras
    this.bancoPalavras = [
      "PORTA",
      "SENHA",
      "FUGIR",
      "NAVES",
      "ALIEN",
      "ASTRO",
      "VACUO",
      "SAGAZ",
      "REVES",
      "LIMBO",
      "HEROI",
      "TEMPO",
      "TERRA",
      "COSMO",
      "PERDI",
      "FROTA",
    ];

    // O Phaser pega numa palavra aleatória deste array sempre que a cena inicia ou reinicia
    this.palavraSecreta = Phaser.Utils.Array.GetRandom(this.bancoPalavras);

    // Variáveis de controle do Termo
    this.maxTentativas = 6;
    this.letrasMax = 5;
    this.tentativaAtual = 0;
    this.letraAtual = 0;
    this.palavraAtual = "";
    this.historicoChutes = [];
    this.jogoTerminou = false;

    // Variáveis de controle do Mini-puzzle de Memória
    this.modalAberto = false;
    this.cartasViradas = [];
    this.paresEncontrados = 0;
    this.bloqueioCliquesMemoria = false;
  }
  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.cameras.main.setZoom(0.6);
    this.cameras.main.centerOn(width / 2, height / 2);

    this.comojogar = this.physics.add.sprite(1100, 55, "comojogar");
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
    this.fundocomojogar.setScale(3);

    this.comojogarText = this.add
      .text(
        600,
        215,
        "Você deve adivinhar qual a palavra certa. Ela terá cinco (5) letras.\nA cada tentativa, o jogo revelará: letras presentes na palavra, mas em posições erradas (ficarão em amarelo);\nletras presentes e na posição certa (ficarão em verde); e letras não existentes na palavra (ficarão cinza).\nClique em (como jogar) de novo para fechar o tutorial e recomeçar o desafio.",
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

    // Fundo principal do Terminal
    this.add.rectangle(400, 300, 800, 600, 0x121213);
    this.add
      .text(400, 40, "ADIVINHE A PALAVRA", {
        fontSize: "28px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

      this.input.keyboard.on("keydown-ESC", () => {
      console.log("Jogador cancelou o minigame Genius.");
      
      // Retoma a cena de origem caso ela tenha sido pausada (comum em minigames)
      if (this.cenaOrigem) {
        this.scene.resume(this.cenaOrigem);
      }
      
      // Fecha a cena do minigame
      this.scene.stop();
    });

    this.grelhaQuadrados = [];
    this.grelhaTextos = [];

    // 1. CRIAR A GRELHA DO TERMO (6 linhas x 5 colunas)
    const tamQuadrado = 55;
    const espaco = 8;
    const inicioX = 400 - (tamQuadrado + espaco) * 2.5 + tamQuadrado / 2;
    const inicioY = 100;

    for (let l = 0; l < this.maxTentativas; l++) {
      this.grelhaQuadrados[l] = [];
      this.grelhaTextos[l] = [];
      for (let c = 0; c < this.letrasMax; c++) {
        let x = inicioX + c * (tamQuadrado + espaco);
        let y = inicioY + l * (tamQuadrado + espaco);

        let rect = this.add
          .rectangle(x, y, tamQuadrado, tamQuadrado, 0x121213)
          .setStrokeStyle(2, 0x3a3a3c);
        let txt = this.add
          .text(x, y, "", {
            fontSize: "26px",
            fill: "#ffffff",
            fontStyle: "bold",
          })
          .setOrigin(0.5);

        this.grelhaQuadrados[l][c] = rect;
        this.grelhaTextos[l][c] = txt;
      }
    }

    // 2. BOTÃO DE PEDIR DICA
    this.btnDicaBg = this.add
      .rectangle(400, 500, 200, 45, 0xb59f3b)
      .setInteractive();
    this.btnDicaTexto = this.add
      .text(400, 500, "🧩 PEDIR DICA", {
        fontSize: "16px",
        fill: "#fff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.btnDicaBg.on("pointerdown", () => this.abrirPuzzleDica());

    // Texto que exibirá a dica gerada
    this.txtMensagemDica = this.add
      .text(400, 550, "", {
        fontSize: "16px",
        fill: "#b59f3b",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // 3. CAPTURA DO TECLADO FÍSICO
    this.input.keyboard.on("keydown", (event) =>
      this.tratarInputTeclado(event),
    );

    // 4. PREPARAR COMPONENTES DO MODAL (Ficam invisíveis/desativados no início)
    this.criarModalMemoria();
  }

  tratarInputTeclado(event) {
    // Se o jogo acabou ou o modal do puzzle estiver aberto, ignora a digitação do Termo
    if (this.jogoTerminou || this.modalAberto) return;

    let tecla = event.key.toUpperCase();

    if (
      /^[A-ZÁÀÂÃÉÈÊÍÏÓÒÔÕÚÇ]$/.test(tecla) &&
      this.letraAtual < this.letrasMax
    ) {
      // Remove acentos simples para padronizar o input do Termo
      tecla = tecla.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      this.grelhaTextos[this.tentativaAtual][this.letraAtual].setText(tecla);
      this.palavraAtual += tecla;
      this.letraAtual++;
    } else if (tecla === "BACKSPACE" && this.letraAtual > 0) {
      this.letraAtual--;
      this.grelhaTextos[this.tentativaAtual][this.letraAtual].setText("");
      this.palavraAtual = this.palavraAtual.slice(0, -1);
    } else if (tecla === "ENTER") {
      this.fazerJogada();
    }
  }

  fazerJogada() {
    if (this.palavraAtual.length !== this.letrasMax) {
      this.cameras.main.shake(200, 0.01); // Efeito visual de erro
      return;
    }

    this.historicoChutes.push(this.palavraAtual);
    let coresResultado = Array(5).fill(0x3a3a3c); // Cinza padrão
    let letrasRestantesSecreta = this.palavraSecreta.split("");

    // Passo 1: Validar Verdes
    for (let i = 0; i < 5; i++) {
      if (this.palavraAtual[i] === this.palavraSecreta[i]) {
        coresResultado[i] = 0x538d4e; // Verde hex
        letrasRestantesSecreta[i] = null;
      }
    }

    // Passo 2: Validar Amarelos
    for (let i = 0; i < 5; i++) {
      if (coresResultado[i] === 0x538d4e) continue;
      let indexNaSecreta = letrasRestantesSecreta.indexOf(this.palavraAtual[i]);
      if (indexNaSecreta !== -1) {
        coresResultado[i] = 0xb59f3b; // Amarelo hex
        letrasRestantesSecreta[indexNaSecreta] = null;
      }
    }

    // Passo 3: Animação de Giro (Flip) idêntica ao CSS
    let acertos = 0;
    for (let i = 0; i < 5; i++) {
      let quadrado = this.grelhaQuadrados[this.tentativaAtual][i];
      let corFinal = coresResultado[i];
      if (corFinal === 0x538d4e) acertos++;

      this.time.delayedCall(i * 200, () => {
        this.tweens.add({
          targets: quadrado,
          scaleY: 0,
          duration: 250,
          yoyo: true,
          onYoyo: () => {
            quadrado.setFillStyle(corFinal);
            quadrado.setStrokeStyle(0);
          },
        });
      });
    }

    // Atualização dos estados de rodada
    this.tentativaAtual++;
    this.letraAtual = 0;
    this.palavraAtual = "";

    // Checar Fim de Jogo
    this.time.delayedCall(1500, () => {
      if (acertos === 5) {
        this.vencerJogo();
      } else if (this.tentativaAtual >= this.maxTentativas) {
        this.derrotaJogo();
      }
    });
  }

  // === SISTEMA DO MINI-PUZZLE (MODAL) ===

  criarModalMemoria() {
    // Criamos um Container para agrupar tudo do modal e facilitar esconder/mostrar
    this.modalContainer = this.add
      .container(0, 0)
      .setDepth(10)
      .setVisible(false);

    // Fundo escurecido bloqueador de cliques no fundo
    let cortina = this.add
      .rectangle(400, 300, 800, 600, 0x000000, 0.9)
      .setInteractive();

    // Caixa do painel
    let painel = this.add
      .rectangle(400, 300, 400, 400, 0x1e1e20)
      .setStrokeStyle(3, 0x3a3a3c);
    let titulo = this.add
      .text(400, 140, "Resolva o puzzle para ganhar a dica!", {
        fontSize: "18px",
        fill: "#fff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    let subtitulo = this.add
      .text(400, 170, "Encontre os 3 pares de símbolos espaciais.", {
        fontSize: "14px",
        fill: "#aaa",
      })
      .setOrigin(0.5);

    this.modalContainer.add([cortina, painel, titulo, subtitulo]);

    // Criar o tabuleiro interno de cartas (grelha de 3 colunas x 2 linhas)
    this.cartasObjetos = [];
    let emojis = ["🚀", "🚀", "🌟", "🌟", "🛸", "🛸"];

    let indexEmoji = 0;
    for (let linha = 0; linha < 2; linha++) {
      for (let col = 0; col < 3; col++) {
        let x = 290 + col * 110;
        let y = 260 + linha * 120;

        // Fundo da carta
        let cardBg = this.add
          .rectangle(x, y, 90, 100, 0x3a3a3c)
          .setInteractive();
        // Texto com o emoji oculto
        let cardTxt = this.add
          .text(x, y, "", { fontSize: "40px" })
          .setOrigin(0.5);

        cardBg.txtAssociado = cardTxt;
        cardBg.resolvida = false;

        cardBg.on("pointerdown", () => this.virarCartaMemoria(cardBg));

        this.modalContainer.add([cardBg, cardTxt]);
        this.cartasObjetos.push(cardBg);
      }
    }
  }

  abrirPuzzleDica() {
    if (this.tentativaAtual === 0) {
      this.txtMensagemDica.setText("⚠️ Tente pelo menos uma palavra antes!");
      return;
    }

    this.modalAberto = true;
    this.paresEncontrados = 0;
    this.cartasViradas = [];
    this.bloqueioCliquesMemoria = false;

    // Embaralhar emojis e resetar cartas visuais
    let emojis = ["🚀", "🚀", "🌟", "🌟", "🛸", "🛸"];
    Phaser.Utils.Array.Shuffle(emojis);

    this.cartasObjetos.forEach((card, idx) => {
      card.valorSecreto = emojis[idx];
      card.resolvida = false;
      card.setFillStyle(0x3a3a3c);
      card.txtAssociado.setText("");
    });

    this.modalContainer.setVisible(true);
  }

  virarCartaMemoria(card) {
    if (
      this.bloqueioCliquesMemoria ||
      card.resolvida ||
      this.cartasViradas.includes(card)
    )
      return;

    // Revelar carta
    card.setFillStyle(0xffffff);
    card.txtAssociado.setText(card.valorSecreto);
    this.cartasViradas.push(card);

    if (this.cartasViradas.length === 2) {
      this.bloqueioCliquesMemoria = true;
      this.time.delayedCall(800, () => this.checarParMemoria());
    }
  }

  checarParMemoria() {
    let [c1, c2] = this.cartasViradas;

    if (c1.valorSecreto === c2.valorSecreto) {
      c1.resolvida = true;
      c2.resolvida = true;
      this.paresEncontrados++;

      if (this.paresEncontrados === 3) {
        this.time.delayedCall(500, () => this.vencerPuzzleDica());
      }
    } else {
      // Desvirar cartas (voltar ao cinza)
      c1.setFillStyle(0x3a3a3c);
      c1.txtAssociado.setText("");
      c2.setFillStyle(0x3a3a3c);
      c2.txtAssociado.setText("");
    }

    this.cartasViradas = [];
    this.bloqueioCliquesMemoria = false;
  }

  vencerPuzzleDica() {
    this.modalContainer.setVisible(false);
    this.modalAberto = false;

    // Desativar o botão de Dica (igual ao teu script HTML)
    this.btnDicaBg.disableInteractive();
    this.btnDicaBg.setFillStyle(0x555555);
    this.btnDicaTexto.setText("DICA UTILIZADA");

    this.gerarDicaLogica();
  }

  gerarDicaLogica() {
    let letrasDescobertas = new Set();
    let posicoesCorretas = new Set();

    // Processa o histórico igualzinho ao teu algoritmo
    for (let i = 0; i < this.historicoChutes.length; i++) {
      let chute = this.historicoChutes[i];
      for (let j = 0; j < 5; j++) {
        if (chute[j] === this.palavraSecreta[j]) {
          posicoesCorretas.add(j);
          letrasDescobertas.add(chute[j]);
        } else if (this.palavraSecreta.includes(chute[j])) {
          letrasDescobertas.add(chute[j]);
        }
      }
    }

    // Regra 1: Revelar posição exata de uma letra amarela existente
    for (let letra of letrasDescobertas) {
      let indexReal = this.palavraSecreta.indexOf(letra);
      if (!posicoesCorretas.has(indexReal)) {
        this.txtMensagemDica.setText(
          `💡 DICA: A letra ${letra} fica exatamente na posição ${indexReal + 1}.`,
        );
        return;
      }
    }

    // Regra 2: Revelar uma letra nova (oculta) da palavra
    for (let i = 0; i < 5; i++) {
      let letraSecreta = this.palavraSecreta[i];
      if (!letrasDescobertas.has(letraSecreta)) {
        this.txtMensagemDica.setText(
          `💡 DICA: A palavra contém a letra ${letraSecreta} (posição oculta).`,
        );
        return;
      }
    }

    // Fallback
    this.txtMensagemDica.setText("💡 DICA: Concentre-se nas vogais restantes!");
  }

  // === TÉRMINOS DE JOGO ===

    vencerJogo() {
    this.jogoTerminou = true;
    this.add
      .text(400, 300, "SISTEMA DESBLOQUEADO!", {
        fontSize: "32px",
        fill: "#00ff00",
        backgroundColor: "#000",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      // Notifica a cena de origem para abrir a porta correspondente
      try {
        this.scene.get(this.cenaOrigem).abrirPorta(this.portaId);
      } catch (e) {
        console.error("Erro ao notificar cena origem:", e);
      }
      this.scene.stop();
      //this.scene.switch(this.cenaOrigem); // Volta para a cena de origem após vencer
    });
  }

  derrotaJogo() {
    this.jogoTerminou = true;
    this.add
      .text(400, 300, `FIM DE JOGO!\nPALAVRA: ${this.palavraSecreta}`, {
        fontSize: "28px",
        fill: "#ff0000",
        backgroundColor: "#000",
        align: "center",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.time.delayedCall(3000, () => {
      this.scene.restart();
    });
  }
}
