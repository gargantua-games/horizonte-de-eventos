import QuebraCabeca from './quebraCabeca.js';
import Termo from './termo.js';
import Sudoku from './sudoku.js';
import StratagemHero from './stratagemHero.js';
// Cena simulada para agir como a tua "scene1"
class CenaFalsa extends Phaser.Scene {
    constructor() {
        super('CenaFalsa');
    }

    create() {
        this.add.text(400, 30, 'Simulador da scene1', { fill: '#aaa' }).setOrigin(0.5);

        // =========================================================
        // MUDAR AQUI PARA TESTAR OUTRO PUZZLE
        // Substitui 'QuebraCabeca' por 'Termo', 'Sudoku' 
        // =========================================================
        let puzzleParaTestar = 'stratagemHero'; 
        
        this.scene.launch(puzzleParaTestar, { portaId: 1, cenaOrigem: 'CenaFalsa' });
    }

    // A função que o puzzle vai tentar chamar quando for resolvido
    abrirPorta(idPorta) {
        console.log(`%c[SUCESSO] O puzzle resolveu e abriu a porta ${idPorta}!`, 'color: green; font-size: 16px; font-weight: bold;');
        
        let textoSucesso = this.add.text(400, 300, `PORTA ${idPorta} ABERTA COM SUCESSO!`, { 
            fontSize: '32px', 
            fill: '#0f0',
            backgroundColor: '#000'
        }).setOrigin(0.5);

        // Efeito de piscar para saberes que funcionou
        this.tweens.add({
            targets: textoSucesso,
            alpha: 0,
            yoyo: true,
            repeat: -1,
            duration: 500
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    // Adiciona aqui todas as cenas de puzzle que queres que o Phaser conheça
    scene: [CenaFalsa, QuebraCabeca, Termo, Sudoku]
};

const game = new Phaser.Game(config);