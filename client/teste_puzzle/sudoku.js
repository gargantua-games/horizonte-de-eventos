export default class sudoku extends Phaser.Scene {
  constructor() {
    super("sudoku");
    this.lendotutorial = false;
  }

  init(data) {
    this.portaId = data.portaId;
    this.cenaOrigem = data.cenaOrigem;
    this.errosAtivos = false;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(width / 2, height / 2);
    this.AmbientLight = this.add.rectangle(400, 450, 600, 900, 0x111111);

    this.comojogar = this.physics.add.sprite(600, 55, "comojogar");
    this.comojogar.setScrollFactor(0);
    this.comojogar.body.allowGravity = false;
    this.comojogar.setDepth(2);
    this.comojogar.setScale(3);
    this.comojogar.setInteractive({ cursor: "pointer" });

    this.fundocomojogar = this.physics.add.sprite(600, 210, "bigIa");
    this.fundocomojogar.setVisible(false);
    this.fundocomojogar.setScrollFactor(0);
    this.fundocomojogar.body.allowGravity = false;
    this.fundocomojogar.setDepth(1);
    this.fundocomojogar.setScale(1.7);

    this.comojogarText = this.add
      .text(
        600,
        215,
        "Utilize as teclas dos números 1,2,3 e 4. Cada coluna/linha deve ter um dígito de cada,\nou seja, uma coluna/linha não deve ter dígitos repetidos.\nCaso termine o sudoku e ele ficar vermelho, significa que algum número\ndo tabuleiro está errado. Descubra onde está seu(s) erro(s) e coloque o(s) número(s) certo(s)\nno lugar. Clique em (como jogar) de novo para fechar o tutorial e recomeçar o desafio.",
        {
          fill: "#00ff0d",
          fontFamily: "sarpanchregular",
          fontSize: "20px",
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

     this.input.keyboard.on("keydown-ESC", () => {
      console.log("Jogador cancelou o minigame Genius.");
      
      // Retoma a cena de origem caso ela tenha sido pausada (comum em minigames)
      if (this.cenaOrigem) {
        this.scene.resume(this.cenaOrigem);
      }
      
      // Fecha a cena do minigame
      this.scene.stop();
    });

    //this.AmbientLight = this.add.rectangle(530, 360, 700, 720, 0x111111);

    this.add
      .text(400, 50, "sudoku 4x4 (Usa o teclado 1-4)", {
        fontSize: "24px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Grelha 4x4 base (0 = vazio)
    this.mapa = [
      [1, 0, 0, 4],
      [0, 2, 3, 0],
      [0, 4, 1, 0],
      [3, 0, 0, 2],
    ];

    this.celulasUI = [];
    this.celulaSelecionada = null;

    for (let linha = 0; linha < 4; linha++) {
      this.celulasUI[linha] = [];
      for (let col = 0; col < 4; col++) {
        let x = 250 + col * 70;
        let y = 150 + linha * 70;

        let rect = this.add
          .rectangle(x, y, 65, 65, 0x222222)
          .setStrokeStyle(2, 0xffffff)
          .setInteractive();
        let valor = this.mapa[linha][col];
        let txt = this.add
          .text(x, y, valor === 0 ? "" : valor, {
            fontSize: "32px",
            fill: valor === 0 ? "#fff" : "#00ff00",
          })
          .setOrigin(0.5);

        let celula = { rect, txt, linha, col, fixo: valor !== 0 };
        this.celulasUI[linha].push(celula);

        if (!celula.fixo) {
          rect.on("pointerdown", () => this.selecionarCelula(celula));
        }
      }
    }

    this.input.keyboard.on("keydown", this.inserirNumero, this);
  }

  selecionarCelula(celula) {
    this.celulaSelecionada = celula;
    this.atualizarEstilosCelulas();
  }

  inserirNumero(event) {
    if (!this.celulaSelecionada) return;
    let num = parseInt(event.key);
    if (num >= 1 && num <= 4) {
      this.celulaSelecionada.txt.setText(num);
      this.mapa[this.celulaSelecionada.linha][this.celulaSelecionada.col] = num;
      if (this.errosAtivos) {
        this.errosAtivos = false;
      }
      this.atualizarEstilosCelulas();
      this.verificarVitoria();
    }
  }

  isCelulaValida(celula) {
    let valor = this.mapa[celula.linha][celula.col];
    if (valor === 0) return true;
    if (valor < 1 || valor > 4) return false;

    // Linha
    for (let j = 0; j < 4; j++) {
      if (j !== celula.col && this.mapa[celula.linha][j] === valor) {
        return false;
      }
    }

    // Coluna
    for (let i = 0; i < 4; i++) {
      if (i !== celula.linha && this.mapa[i][celula.col] === valor) {
        return false;
      }
    }

    // Bloco 2x2
    let baseLinha = Math.floor(celula.linha / 2) * 2;
    let baseCol = Math.floor(celula.col / 2) * 2;
    for (let i = baseLinha; i < baseLinha + 2; i++) {
      for (let j = baseCol; j < baseCol + 2; j++) {
        if (
          (i !== celula.linha || j !== celula.col) &&
          this.mapa[i][j] === valor
        ) {
          return false;
        }
      }
    }

    return true;
  }

  atualizarEstiloCelula(celula) {
    let cor = 0xffffff;
    let espessura = 2;

    if (this.errosAtivos && !celula.fixo && !this.isCelulaValida(celula)) {
      cor = 0xff0000;
      espessura = 4;
    } else if (celula === this.celulaSelecionada) {
      espessura = 4;
      cor = 0xffff00;
    }

    celula.rect.setStrokeStyle(espessura, cor);
  }

  atualizarEstilosCelulas() {
    for (let linha = 0; linha < 4; linha++) {
      for (let col = 0; col < 4; col++) {
        this.atualizarEstiloCelula(this.celulasUI[linha][col]);
      }
    }
  }

  verificarVitoria() {
    let completo = true;
    let valido = true;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let valor = this.mapa[i][j];
        if (valor === 0) {
          completo = false;
        }
        if (valor < 1 || valor > 4) {
          valido = false;
        }
      }
    }

    if (completo) {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (!this.isCelulaValida(this.celulasUI[i][j])) {
            valido = false;
          }
        }
      }
    }

    if (completo && valido) {
      this.scene.get(this.cenaOrigem).abrirPorta(this.portaId);
      this.scene.stop();
    } else if (completo && !valido) {
      this.errosAtivos = true;
      this.atualizarEstilosCelulas();
    }
  }
}
