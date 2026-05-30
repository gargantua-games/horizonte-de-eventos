export default class sudoku extends Phaser.Scene {
    constructor() { super("sudoku"); }

    init(data) {
        this.portaId = data.portaId;
        this.cenaOrigem = data.cenaOrigem;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.cameras.main.setZoom(1);
        this.cameras.main.centerOn(width / 2, height / 2);

        //this.AmbientLight = this.add.rectangle(530, 360, 700, 720, 0x111111);
        
        this.add.text(400, 50, "sudoku 4x4 (Usa o teclado 1-4)", { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        // Grelha 4x4 base (0 = vazio)
        this.mapa = [
            [1, 0, 0, 4],
            [0, 2, 3, 0],
            [0, 4, 1, 0],
            [3, 0, 0, 2]
        ];
        
        this.celulasUI = [];
        this.celulaSelecionada = null;

        for (let linha = 0; linha < 4; linha++) {
            this.celulasUI[linha] = [];
            for (let col = 0; col < 4; col++) {
                let x = 250 + col * 70;
                let y = 150 + linha * 70;
                
                let rect = this.add.rectangle(x, y, 65, 65, 0x222222).setStrokeStyle(2, 0xffffff).setInteractive();
                let valor = this.mapa[linha][col];
                let txt = this.add.text(x, y, valor === 0 ? "" : valor, { fontSize: '32px', fill: valor === 0 ? '#fff' : '#00ff00' }).setOrigin(0.5);
                
                let celula = { rect, txt, linha, col, fixo: valor !== 0 };
                this.celulasUI[linha].push(celula);

                if (!celula.fixo) {
                    rect.on('pointerdown', () => this.selecionarCelula(celula));
                }
            }
        }

        this.input.keyboard.on('keydown', this.inserirNumero, this);
    }

    selecionarCelula(celula) {
        if (this.celulaSelecionada) this.celulaSelecionada.rect.setStrokeStyle(2, 0xffffff);
        this.celulaSelecionada = celula;
        this.celulaSelecionada.rect.setStrokeStyle(4, 0xffff00);
    }

    inserirNumero(event) {
        if (!this.celulaSelecionada) return;
        let num = parseInt(event.key);
        if (num >= 1 && num <= 4) {
            this.celulaSelecionada.txt.setText(num);
            this.mapa[this.celulaSelecionada.linha][this.celulaSelecionada.col] = num;
            this.verificarVitoria();
        }
    }

    verificarVitoria() {
        // Validação simples (somas das linhas e colunas num 4x4 completo deve ser 10)
        let completo = true;
        for (let i = 0; i < 4; i++) {
            let somaLinha = 0; let somaCol = 0;
            for (let j = 0; j < 4; j++) {
                if (this.mapa[i][j] === 0) completo = false;
                somaLinha += this.mapa[i][j];
                somaCol += this.mapa[j][i];
            }
            if (somaLinha !== 10 || somaCol !== 10) completo = false;
        }

        if (completo) {
            this.scene.get(this.cenaOrigem).abrirPorta(this.portaId);
            this.scene.stop();
        }
    }
}
