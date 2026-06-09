class creditos extends Phaser.Scene {
  constructor() {
    super("creditos");
  }

  create() {

     this.trilhacreditos = this.sound.add("trilhacreditos", {
       loop: true,
       volume: 1,
     });
     this.trilhacreditos.play();

    const content = [
      
      "Desenvolvedores de jogos:",
      "Luiza",
      "Rafael",
      "Pedro",
      "",

      "Designer de jogos:",
      "sla o q q é isso",
      "",

      "Artista digital:",
      "Luiza (capa do jogo)",
      "Assets pegos de itch.io",
      "Alterações nos assets feitas por:",
      "Luiza, Pedro e Rafael",
      "",

      "Game tester:",
      "Uma cambada de gente",
      "",

      "Roteiristas:",
      "Rafael",
      "Luiza",
      "",

      "Trilha sonora:",
      "Música durante o jogo:",
      " 'Brave Space Explorers' por Alexandr Zhelanov em opengameart.org",
      "Música dos créditos:",
      "'Streetsound' por p0ss em opengameart.org",
      "Efeitos sonoros:",
      "opengameart.org",
      "",

      "Programadores:",
      "Rafael",
      "Luiza",
      "Pedro",
      "Com ajuda de Prof Boi (Ederson)",
      "",

      "Responsáveis pelo hardware:",
      "Rafael",
      "Pedro",
      "Prof Boi (Ederson)",
      "Prof Clayrton",
      "",

      "OBRIGADO POR JOGAR HORIZONTE DE EVENTOS!"
    ];

    this.textC = this.add.text(300, 450, content, {
      fontFamily: "sarpanchregular",
      fontSize: "20px",
      fill: "#1fff1f",
    });

    this.tweens.add({
      targets: this.textC,
      y: -700,
      duration: 20000,
      //yoyo: true,
    });

   

    
  }
}

export default creditos;
