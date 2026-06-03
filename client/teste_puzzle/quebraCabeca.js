export default class quebraCabeca extends Phaser.Scene {
    constructor() {
      super("quebraCabeca");
      this.lendotutorial = false;
    }

    init(data) {
        this.portaId = data.portaId;
        this.cenaOrigem = data.cenaOrigem;
        this.pecasCorretas = 0;
    }

    preload() {
        for (let i = 0; i < 16; i++) {
            this.load.image(`peca${i}`, `assets/puzzles/peca${i + 1}.png`);
        }
    }

    create() {
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;

      this.cameras.main.setZoom(0.4);
        this.cameras.main.centerOn(width / 1.5, height / 1);
        this.AmbientLight = this.add.rectangle(590, 450, 1500, 900, 0x111111);

      this.comojogar = this.physics.add.sprite(400, 500, "comojogar");
      this.comojogar.setScrollFactor(0);
      this.comojogar.body.allowGravity = false;
      this.comojogar.setDepth(2);
      this.comojogar.setScale(6);
      this.comojogar.setInteractive({ cursor: "pointer" });

      this.fundocomojogar = this.physics.add.sprite(600, 250, "bigIa");
      this.fundocomojogar.setVisible(false);
      this.fundocomojogar.setScrollFactor(0);
      this.fundocomojogar.body.allowGravity = false;
      this.fundocomojogar.setDepth(1);
      this.fundocomojogar.setScale(3);

      this.comojogarText = this.add
        .text(
          650,
          215,
          "Use o mouse para arrastar as peças do quebra-cabeça aos lugares certos.\nSe a peça estiver no lugar errado, ela retornará ao lado do tabuleiro.\nClique em (como jogar) de novo para fechar o tutorial e recomeçar o desafio.",
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

      // Variáveis de tamanho para facilitar (o tamanho exato das tuas peças)
      const largPeca = 182;
      const altPeca = 128;

      this.add
        .text(640, 30, "Monte o quebra-Cabeças", {
          fontSize: "38px",
          fill: "#fff",
        })
        .setOrigin(0.5);

      // 1. GERAR AS POSIÇÕES DA GRELHA 4x4
      const posicoesGrelha = [];

      // Ponto inicial da grelha (ajusta o 150 e o 100 para mover a grelha toda pelo ecrã)
      const inicioX = 150 + largPeca / 2;
      const inicioY = 100 + altPeca / 2;

      for (let linha = 0; linha < 4; linha++) {
        for (let coluna = 0; coluna < 4; coluna++) {
          posicoesGrelha.push({
            x: inicioX + coluna * largPeca,
            y: inicioY + linha * altPeca,
          });
        }
      }

      // Cria as zonas de drop (Drop Zones) com os tamanhos reais
      for (let i = 0; i < 16; i++) {
        let zone = this.add
          .zone(posicoesGrelha[i].x, posicoesGrelha[i].y, largPeca, altPeca)
          .setRectangleDropZone(largPeca, altPeca);
        zone.idCorreto = i;

        // Contorno amarelo para a zona
        let graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeRect(
          zone.x - zone.input.hitArea.width / 2,
          zone.y - zone.input.hitArea.height / 2,
          zone.input.hitArea.width,
          zone.input.hitArea.height,
        );
      }

      // 2. GERAR AS POSIÇÕES DAS PEÇAS BARALHADAS
      let posicoesBarra = [];

      // Vamos colocar as peças em duas colunas ao lado da grelha (ou podes pôr em baixo)
      // Como as peças são grandes, agrupá-las à direita pode ser melhor
      const barraX = inicioX + 4 * largPeca + 50; // Começa à direita da grelha
      const barraY = inicioY;

      for (let linha = 0; linha < 8; linha++) {
        for (let coluna = 0; coluna < 2; coluna++) {
          posicoesBarra.push({
            x: barraX + coluna * largPeca,
            // Sobrepomos um bocadinho (altPeca * 0.5) em Y para caberem todas na tela
            y: barraY + linha * (altPeca * 0.5),
          });
        }
      }

      Phaser.Utils.Array.Shuffle(posicoesBarra);

      // Criar as imagens
      for (let i = 0; i < 16; i++) {
        let peca = this.add
          .image(posicoesBarra[i].x, posicoesBarra[i].y, `peca${i}`)
          .setInteractive();
        this.input.setDraggable(peca);
        peca.idPeca = i;
        peca.posicaoInicial = { x: posicoesBarra[i].x, y: posicoesBarra[i].y };

        // Para garantir que a peça do inventário não nasce atrás de outra e fique escondida
        this.children.bringToTop(peca);
      }

      // 3. LÓGICA DE DRAG & DROP
      this.input.on("dragstart", (pointer, gameObject) => {
        this.children.bringToTop(gameObject);
        gameObject.setTint(0xdddddd); // Dá um efeito visual ao pegar na peça
      });

      this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
      });

      this.input.on("drop", (pointer, gameObject, dropZone) => {
        gameObject.clearTint();

        if (gameObject.idPeca === dropZone.idCorreto) {
          // Encaixou certo
          gameObject.x = dropZone.x;
          gameObject.y = dropZone.y;
          gameObject.input.enabled = false;
          this.pecasCorretas++;

          if (this.pecasCorretas === 16) {
            this.vencerPuzzle();
          }
        } else {
          // Errado, volta ao início
          this.tweens.add({
            targets: gameObject,
            x: gameObject.posicaoInicial.x,
            y: gameObject.posicaoInicial.y,
            duration: 300,
            ease: "Power2",
          });
        }
      });

      this.input.on("dragend", (pointer, gameObject, dropped) => {
        gameObject.clearTint();
        if (!dropped) {
          this.tweens.add({
            targets: gameObject,
            x: gameObject.posicaoInicial.x,
            y: gameObject.posicaoInicial.y,
            duration: 300,
            ease: "Power2",
          });
        }
      });
    }

    vencerPuzzle() {
        this.add.text(640, 300, "COMPLETO!", { 
            fontSize: '64px', 
            fill: '#0f0', 
            fontStyle: 'bold',
            backgroundColor: '#000'
        }).setOrigin(0.5);

        this.time.delayedCall(1500, () => {
            this.scene.get(this.cenaOrigem).abrirPorta(this.portaId);
            this.scene.stop();
        });
    }
}