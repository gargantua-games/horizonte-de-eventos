export default class Tetravex extends Phaser.Scene {
  constructor() {
    super("tetravex");
    this.lendotutorial = false;
  }

  init(data) {
    this.portaId = data.portaId;
    this.cenaOrigem = data.cenaOrigem;

    // Configuração de Tamanho Inicial (padrão 3x2)
    this.cells_x = 3;
    this.cells_y = 2;

    // Cores clássicas adaptadas
    this.BG_COLOURS = [
      "000000",
      "C17D11",
      "CC0000",
      "F57900",
      "EDD400",
      "73D216",
      "3465A4",
      "75507B",
      "BABDB6",
      "FFFFFF",
    ];
    this.BG_COLOURS_LIGHT = [];
    this.BG_COLOURS_DARK = [];
    this.TEXT_COLOURS = [
      "#FFFFFF",
      "#FFFFFF",
      "#FFFFFF",
      "#FFFFFF",
      "#000000",
      "#000000",
      "#FFFFFF",
      "#FFFFFF",
      "#000000",
      "#000000",
    ];
    this.BTN_HT = 35;

    this.global_mode = "boards";
    this.cur_btns_action = [];
    this.cur_btns_all = [];
    this.global_mode_stack = [];

    this.SOLUTION = [];
    this.UNPLACED = [];
    this.ASSEMBLY = [];

    this.BOARDS_TO_SAVE = [this.SOLUTION, this.UNPLACED, this.ASSEMBLY];
    this.TILES_SIDES = ["top", "right", "bottom", "left"];

    this.cnf = {
      cell_wd: null,
      cell_ht: null,
      assembly_pos: { x: null, y: null },
      unplaced_pos: { x: null, y: null },
      main_space_x: null,
      main_space_y: null,
      main_space_wd: null,
      main_space_ht: null,
    };

    this.BOARDS = [
      { board: this.ASSEMBLY, pos: this.cnf.assembly_pos },
      { board: this.UNPLACED, pos: this.cnf.unplaced_pos },
    ];

    this.dragging_tile = null;
    this.dragging_tile_x = 0;
    this.dragging_tile_y = 0;
    this.dragging_tile_board = null;
    this.dragging_tile_xi = 0;
    this.dragging_tile_yi = 0;
    this.pressing_button = false;

    this.winingness = "unfinished";
    this.jogoTerminou = false;

    this.initColours();
  }

  create() {
    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    this.comojogar = this.physics.add.sprite(400, 50, "comojogar");
    this.comojogar.setScrollFactor(0);
    this.comojogar.body.allowGravity = false;
    this.comojogar.setDepth(2);
    this.comojogar.setScale(3);
    this.comojogar.setInteractive({ cursor: "pointer" });

    this.fundocomojogar = this.physics.add.sprite(580, 190, "bigIa");
    this.fundocomojogar.setVisible(false);
    this.fundocomojogar.setScrollFactor(0);
    this.fundocomojogar.body.allowGravity = false;
    this.fundocomojogar.setDepth(1);
    this.fundocomojogar.setScale(1.7);

    this.comojogarText = this.add
      .text(
        650,
        190,
        "Cada quadrado desse jogo tem, em cada lateral, um número/cor.\nOs mesmos números sempre corresponderão às mesmas cores.\nEntão o número sete (7) sempre será roxo, o roxo sempre será o número 7;\no número zero (0) sempre será preto, e por aí vai.\nVocê deve encaixar os quadrados no tabuleiro, de forma que a lateral de um quadrado\nfique encostando na lateral de outro quadrado com o mesmo número/cor. Por exemplo,\num quadrado com a lateral esquerda contendo o número 5 e a cor verde, só poderá ter\nna sua esquerda, um outro quadrado cuja lateral direita contém o número 5/cor verde.\nClique em (como jogar) de novo para fechar o tutorial e recomeçar o desafio.",
        {
          fill: "#00ff0d",
          fontFamily: "sarpanchregular",
          fontSize: "25px",
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

    // Criar superfície dinâmica de desenho dentro do Phaser
    this.canvasTexture = this.textures.createCanvas(
      "tetravex_canvas",
      width,
      height,
    );
    this.ctx = this.canvasTexture.getContext();
    this.canvasImage = this.add.image(0, 0, "tetravex_canvas").setOrigin(0);

    this.resetConfig();

    // Configuração dos Botões de Ação superiores
    this.add_action_btn(
      this.handle_btn_change_size.bind(this),
      "Change Size",
      130,
    );
    this.add_action_btn(
      this.handle_btn_solution.bind(this),
      "Show Solution",
      150,
    );
    this.set_button_status(null, null);

    // Sempre gerar um novo jogo ao abrir (ignora o cookie salvo)
    this.create_solution();
    this.create_starting_board();

    this.resetConfig();
    this.draw_everything();

    // Interações de Rato/Toque do Phaser
    this.input.on("pointerdown", this.handleMouseDown, this);
    this.input.on("pointermove", this.handleMouseMove, this);
    this.input.on("pointerup", this.handleMouseUp, this);

    // Atalho de Teclado (R para reiniciar tabuleiro)
    this.input.keyboard.on("keydown-R", () => {
      if (this.jogoTerminou) return;
      this.create_solution();
      this.create_starting_board();
      this.save_boards();
      this.draw_everything();
    });
  }

  resetConfig() {
    let cnv_wd = this.cameras.main.width;
    let cnv_ht = this.cameras.main.height;
    const THRESHOLD = 480;
    let gutter_min = cnv_wd >= THRESHOLD || cnv_ht >= THRESHOLD ? 50 : 20;

    let vertical = cnv_wd / cnv_ht < 1;
    let horz_cell_sz =
      (cnv_wd - gutter_min * (vertical ? 2 : 3)) /
      (this.cells_x * (vertical ? 1 : 2));
    let vert_cell_sz =
      (cnv_ht - gutter_min * (vertical ? 3 : 2) - this.BTN_HT) /
      (this.cells_y * (vertical ? 2 : 1));
    this.cnf.cell_wd = this.cnf.cell_ht = Math.min(horz_cell_sz, vert_cell_sz);

    let gutter_x =
      (cnv_wd - this.cells_x * this.cnf.cell_wd * (vertical ? 1 : 2)) /
      (vertical ? 2 : 3);
    let gutter_y =
      (cnv_ht -
        this.cells_y * this.cnf.cell_ht * (vertical ? 2 : 1) -
        this.BTN_HT) /
      (vertical ? 3 : 2);

    this.cnf.main_space_x = this.cnf.assembly_pos.x = gutter_x;
    this.cnf.main_space_y = this.cnf.assembly_pos.y = gutter_y + this.BTN_HT;
    this.cnf.main_space_wd = cnv_wd - 2 * gutter_x;
    this.cnf.main_space_ht = cnv_ht - 2 * gutter_y - this.BTN_HT;

    if (vertical) {
      this.cnf.unplaced_pos.x = this.cnf.assembly_pos.x;
      this.cnf.unplaced_pos.y =
        this.cnf.assembly_pos.y + this.cells_y * this.cnf.cell_ht + gutter_y;
    } else {
      this.cnf.unplaced_pos.x =
        this.cnf.assembly_pos.x + this.cells_x * this.cnf.cell_wd + gutter_x;
      this.cnf.unplaced_pos.y = this.cnf.assembly_pos.y;
    }

    let end_x = cnv_wd - gutter_x;
    let btn_top = gutter_y / 2;
    for (let i = 0; i < this.cur_btns_action.length; ++i) {
      let btn = this.cur_btns_action[i];
      btn.height = this.BTN_HT;
      btn.x = end_x - btn.width;
      btn.y = btn_top;
      end_x = btn.x - 20;
    }
  }

  initColours() {
    for (let i = 0; i < this.BG_COLOURS.length; ++i) {
      let hsl = this.rgbHexToHslArray(this.BG_COLOURS[i]);
      this.BG_COLOURS_LIGHT.push(this.hslToCss(hsl[0], hsl[1], hsl[2] * 1.2));
      this.BG_COLOURS_DARK.push(this.hslToCss(hsl[0], hsl[1], hsl[2] * 0.8));
      this.BG_COLOURS[i] = "#" + this.BG_COLOURS[i];
    }
  }

  rgbHexToHslArray(hex) {
    let colnum = parseInt(hex, 16);
    let r = (colnum >> 16) / 255;
    let g = ((colnum >> 8) & 0xff) / 255;
    let b = (colnum & 0xff) / 255;
    let min = Math.min(r, g, b),
      max = Math.max(r, g, b);
    let h = 0,
      s = 0,
      l = (min + max) / 2;
    if (min !== max) {
      s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
      if (max === r) h = (g - b) / (max - min);
      else if (max === g) h = 2 + (b - r) / (max - min);
      else h = 4 + (r - g) / (max - min);
      h *= 60;
    }
    return [h, s, l];
  }

  hslToCss(h, s, l) {
    return `hsl(${h}, ${s * 100}%, ${l * 100}%)`;
  }

  add_action_btn(handler, label, width) {
    let btn = { handler: handler, label: label, width: width };
    this.cur_btns_action.push(btn);
    this.cur_btns_all.push(btn);
  }

  set_button_status(update_btn, new_status) {
    for (let i = 0; i < this.cur_btns_all.length; ++i) {
      let btn = this.cur_btns_all[i];
      btn.status = btn === update_btn ? new_status : "ready";
    }
  }

  push_global_mode(new_global_mode) {
    this.global_mode_stack.push({
      mode: this.global_mode,
      btns_action: [...this.cur_btns_action],
      btns_all: [...this.cur_btns_all],
    });
    this.global_mode = new_global_mode;
    this.cur_btns_action = [];
    this.cur_btns_all = [];
  }

  pop_global_mode() {
    let old = this.global_mode_stack.pop();
    this.global_mode = old.mode;
    this.cur_btns_action = old.btns_action;
    this.cur_btns_all = old.btns_all;
    this.resetConfig();
    this.draw_everything();
  }

  draw_everything() {
    let ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvasTexture.width, this.canvasTexture.height);

    // Fundo cinzento clássico
    ctx.fillStyle = "#ccc";
    ctx.fillRect(0, 0, this.canvasTexture.width, this.canvasTexture.height);

    if (this.global_mode === "boards") {
      this.draw_winningness(
        ctx,
        this.cnf.assembly_pos.x,
        this.cnf.assembly_pos.y,
      );
      for (let i = 0; i < 2; ++i) {
        this.draw_board(
          ctx,
          this.BOARDS[i].board,
          this.BOARDS[i].pos.x,
          this.BOARDS[i].pos.y,
        );
      }
      this.draw_buttons(ctx);
      if (this.dragging_tile) {
        this.draw_tile(
          ctx,
          this.dragging_tile_x - this.cnf.cell_wd / 2 - 1,
          this.dragging_tile_y - this.cnf.cell_ht / 2 - 1,
          this.dragging_tile,
        );
      }
    } else if (this.global_mode === "choose_size") {
      this.draw_buttons(ctx);
    }

    this.canvasTexture.refresh();
  }

  draw_board(ctx, board, bx, by) {
    ctx.save();
    ctx.beginPath();
    for (let x = 0; x <= this.cells_x; ++x) {
      ctx.moveTo(bx + x * this.cnf.cell_wd, by);
      ctx.lineTo(
        bx + x * this.cnf.cell_wd,
        by + this.cells_y * this.cnf.cell_ht,
      );
    }
    for (let y = 0; y <= this.cells_y; ++y) {
      ctx.moveTo(bx, by + y * this.cnf.cell_ht);
      ctx.lineTo(
        bx + this.cells_x * this.cnf.cell_wd,
        by + y * this.cnf.cell_ht,
      );
    }
    ctx.strokeStyle = "#666";
    ctx.stroke();
    ctx.restore();

    for (let yi = 0; yi < this.cells_y; ++yi) {
      for (let xi = 0; xi < this.cells_x; ++xi) {
        this.draw_tile(
          ctx,
          bx + xi * this.cnf.cell_wd,
          by + yi * this.cnf.cell_ht,
          board[yi][xi],
        );
      }
    }
  }

  draw_tile(ctx, x, y, tile) {
    if (!tile) return;
    ctx.save();
    ctx.font = `${this.cnf.cell_ht * 0.3}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let left_x = x + 1,
      right_x = x + this.cnf.cell_wd - 1,
      mid_x = x + this.cnf.cell_wd / 2;
    let top_y = y + 1,
      bottom_y = y + this.cnf.cell_ht - 1,
      mid_y = y + this.cnf.cell_ht / 2;

    this.draw_triangle(
      ctx,
      tile.top,
      "top",
      left_x,
      top_y,
      right_x,
      top_y,
      mid_x,
      mid_y,
    );
    this.draw_triangle(
      ctx,
      tile.right,
      "right",
      right_x,
      top_y,
      right_x,
      bottom_y,
      mid_x,
      mid_y,
    );
    this.draw_triangle(
      ctx,
      tile.bottom,
      "bottom",
      right_x,
      bottom_y,
      left_x,
      bottom_y,
      mid_x,
      mid_y,
    );
    this.draw_triangle(
      ctx,
      tile.left,
      "left",
      left_x,
      bottom_y,
      left_x,
      top_y,
      mid_x,
      mid_y,
    );
    ctx.restore();
  }

  draw_triangle(ctx, num, which, x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.fillStyle = this.BG_COLOURS[num];
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();

    let midx12 = (x1 + x2) / 2,
      midy12 = (y1 + y2) / 2;
    let midx23 = (x2 + x3) / 2,
      midy23 = (y2 + y3) / 2;
    let midx31 = (x3 + x1) / 2,
      midy31 = (y3 + y1) / 2;
    let EDGE_SIZE = 0.1;
    let inx1 = x1 + (midx23 - x1) * EDGE_SIZE,
      iny1 = y1 + (midy23 - y1) * EDGE_SIZE;
    let inx2 = x2 + (midx31 - x2) * EDGE_SIZE,
      iny2 = y2 + (midy31 - y2) * EDGE_SIZE;
    let inx3 = x3 + (midx12 - x3) * EDGE_SIZE,
      iny3 = y3 + (midy12 - y3) * EDGE_SIZE;

    this.draw_triangle_edge(
      ctx,
      num,
      which,
      1,
      x1,
      y1,
      x2,
      y2,
      inx2,
      iny2,
      inx1,
      iny1,
    );
    this.draw_triangle_edge(
      ctx,
      num,
      which,
      2,
      x2,
      y2,
      x3,
      y3,
      inx3,
      iny3,
      inx2,
      iny2,
    );
    this.draw_triangle_edge(
      ctx,
      num,
      which,
      3,
      x3,
      y3,
      x1,
      y1,
      inx1,
      iny1,
      inx3,
      iny3,
    );

    let avg_x = (x1 + x2 + x3) / 3;
    let avg_y = (y1 + y2 + y3) / 3 + (which === "top" ? (y3 - y1) * 0.1 : 0);
    ctx.fillStyle = this.TEXT_COLOURS[num];
    ctx.fillText(num, avg_x, avg_y, this.cnf.cell_wd / 3);
  }

  draw_triangle_edge(ctx, num, which, side, x1, y1, x2, y2, x3, y3, x4, y4) {
    let colours = this.BG_COLOURS_LIGHT;
    if (
      (which === "top" && side === 2) ||
      (which === "right" && side === 1) ||
      (which === "bottom" && side !== 2) ||
      (which === "left" && side !== 1)
    ) {
      colours = this.BG_COLOURS_DARK;
    }
    ctx.beginPath();
    ctx.fillStyle = colours[num];
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  }

  draw_buttons(ctx) {
    ctx.save();
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < this.cur_btns_all.length; ++i) {
      let btn = this.cur_btns_all[i];
      ctx.beginPath();
      ctx.rect(btn.x, btn.y, btn.width, btn.height);
      ctx.fillStyle = "#999";
      ctx.fill();
      ctx.lineWidth = btn.status === "pressed" ? 3 : 1;
      ctx.strokeStyle = "#333";
      ctx.stroke();

      ctx.fillStyle = "#fff";
      ctx.fillText(
        btn.label,
        btn.x + btn.width / 2,
        btn.y + btn.height / 2,
        btn.width - 20,
      );
    }
    ctx.restore();
  }

  draw_winningness(ctx, board_x, board_y) {
    if (this.winingness === "unfinished") return;
    let wd = this.cells_x * this.cnf.cell_wd;
    let ht = this.cells_y * this.cnf.cell_ht;

    ctx.save();
    ctx.shadowColor = this.winingness === "win" ? "#292" : "#b44";
    ctx.shadowBlur = 50;
    ctx.fillStyle = "#000";
    ctx.fillRect(board_x, board_y, wd, ht);
    ctx.restore();
  }

  update_winingness() {
    if (this.jogoTerminou) return;
    this.winingness = "win";
    for (let xi = 0; xi < this.cells_x; ++xi) {
      for (let yi = 0; yi < this.cells_y; ++yi) {
        let tile = this.ASSEMBLY[yi][xi];
        let right = xi + 1 === this.cells_x ? null : this.ASSEMBLY[yi][xi + 1];
        let below = yi + 1 === this.cells_y ? null : this.ASSEMBLY[yi + 1][xi];
        if (!tile) this.winingness = "unfinished";
        else if (
          (right && tile.right !== right.left) ||
          (below && tile.bottom !== below.top)
        ) {
          this.winingness = "wrong";
          return;
        }
      }
    }

    if (this.winingness === "win") {
      this.vencerJogo();
    }
  }

  vencerJogo() {
    this.jogoTerminou = true;
    this.draw_everything();
    this.add
      .text(500, 200, "ACESSO CONCEDIDO", {
        fontSize: "48px",
        fill: "#00ff00",
        fontStyle: "bold",
        fontFamily: "monospace",
        backgroundColor: "#000",
      })
      .setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.scene.get(this.cenaOrigem).abrirPorta(this.portaId);
      this.scene.stop();
    });
  }

  create_solution() {
    this.SOLUTION.length = 0;
    for (let yi = 0; yi < this.cells_y; ++yi) {
      this.SOLUTION[yi] = [];
      for (let xi = 0; xi < this.cells_x; ++xi) {
        this.SOLUTION[yi][xi] = { top: 0, right: 0, bottom: 0, left: 0 };
      }
    }
    for (let yi = 0; yi < this.cells_y; ++yi) {
      for (let xi = 0; xi < this.cells_x; ++xi) {
        let tile = this.SOLUTION[yi][xi];
        if (xi === 0) tile.left = Math.floor(Math.random() * 10);
        if (yi === 0) tile.top = Math.floor(Math.random() * 10);
        tile.right = Math.floor(Math.random() * 10);
        if (xi < this.cells_x - 1) this.SOLUTION[yi][xi + 1].left = tile.right;
        tile.bottom = Math.floor(Math.random() * 10);
        if (yi < this.cells_y - 1) this.SOLUTION[yi + 1][xi].top = tile.bottom;
      }
    }
  }

  create_starting_board() {
    this.UNPLACED.length = 0;
    this.ASSEMBLY.length = 0;
    for (let yi = 0; yi < this.cells_y; ++yi) {
      this.UNPLACED[yi] = [];
      this.ASSEMBLY[yi] = [];
      for (let xi = 0; xi < this.cells_x; ++xi) {
        this.UNPLACED[yi][xi] = this.SOLUTION[yi][xi];
        this.ASSEMBLY[yi][xi] = null;
      }
    }
    this.winingness = "unfinished";

    let num_tiles = this.cells_x * this.cells_y;
    for (let i = 0; i < num_tiles - 1; ++i) {
      let xi = i % this.cells_x;
      let yi = Math.floor(i / this.cells_x);
      let j = Math.floor(Math.random() * (num_tiles - i)) + i;
      let xj = j % this.cells_x;
      let yj = Math.floor(j / this.cells_x);
      let tmp = this.UNPLACED[yi][xi];
      this.UNPLACED[yi][xi] = this.UNPLACED[yj][xj];
      this.UNPLACED[yj][xj] = tmp;
    }
  }

  find_pos_in_boards(pos) {
    for (let i = 0; i < 2; ++i) {
      let bx = this.BOARDS[i].pos.x;
      let by = this.BOARDS[i].pos.y;
      let x = pos.x - bx;
      let y = pos.y - by;
      if (x >= 0 && y >= 0) {
        let xi = Math.floor(x / this.cnf.cell_wd);
        let yi = Math.floor(y / this.cnf.cell_ht);
        if (xi < this.cells_x && yi < this.cells_y) {
          return {
            board: this.BOARDS[i].board,
            xi: xi,
            yi: yi,
            tile: this.BOARDS[i].board[yi][xi],
          };
        }
      }
    }
    return null;
  }

  find_pos_in_buttons(pos) {
    for (let i = 0; i < this.cur_btns_all.length; ++i) {
      let btn = this.cur_btns_all[i];
      if (
        pos.x >= btn.x &&
        pos.x <= btn.x + btn.width &&
        pos.y >= btn.y &&
        pos.y <= btn.y + btn.height
      )
        return btn;
    }
    return null;
  }

  handleMouseDown(pointer) {
    if (this.jogoTerminou) return;
    if (this.dragging_tile) return this.handleMouseUp(pointer);

    let pos = { x: pointer.x, y: pointer.y };
    let match = this.find_pos_in_boards(pos);
    if (match && match.tile) {
      this.dragging_tile = match.tile;
      this.dragging_tile_board = match.board;
      this.dragging_tile_xi = match.xi;
      this.dragging_tile_yi = match.yi;
      match.board[match.yi][match.xi] = null;
      this.update_winingness();
    }

    let btn = this.find_pos_in_buttons(pos);
    if (btn) {
      this.set_button_status(btn, "pressed");
      this.pressing_button = true;
    }

    this.dragging_tile_x = pointer.x;
    this.dragging_tile_y = pointer.y;
    this.draw_everything();
  }

  handleMouseMove(pointer) {
    if (!this.dragging_tile) return;
    this.dragging_tile_x = pointer.x;
    this.dragging_tile_y = pointer.y;
    this.draw_everything();
  }

  handleMouseUp(pointer) {
    if (!this.dragging_tile && !this.pressing_button) return;
    let pos = { x: pointer.x, y: pointer.y };

    if (this.pressing_button) {
      let btn = this.find_pos_in_buttons(pos);
      if (btn) {
        this.set_button_status(btn, "ready");
        btn.handler();
      }
      this.pressing_button = false;
    } else {
      let match = this.find_pos_in_boards(pos);
      if (match) {
        this.dragging_tile_board[this.dragging_tile_yi][this.dragging_tile_xi] =
          match.tile;
        this.dragging_tile_board = match.board;
        this.dragging_tile_xi = match.xi;
        this.dragging_tile_yi = match.yi;
      }
      this.dragging_tile_board[this.dragging_tile_yi][this.dragging_tile_xi] =
        this.dragging_tile;
      this.dragging_tile = null;
      this.update_winingness();
      this.save_boards();
    }
    this.draw_everything();
  }

  handle_btn_change_size_cancel() {
    this.pop_global_mode();
  }

  handle_btn_change_size() {
    let inputSenha = prompt("INTRODUZA A CHAVE DE ACESSO AO NÚCLEO:");
    if (inputSenha !== "GARGANTUAHORIZONTE2026") {
      alert("ACESSO NEGADO! CHAVE INCORRETA.");
      return;
    }

    this.push_global_mode("choose_size");
    this.add_action_btn(
      this.handle_btn_change_size_cancel.bind(this),
      "Cancel",
      100,
    );

    let btn_wd = this.cnf.main_space_wd / 3;
    let btn_ht = this.cnf.main_space_ht / 3;
    const tamanhosPermitidos = [
      { w: 3, h: 2 },
      { w: 2, h: 3 },
      { w: 2, h: 2 },
    ];

    for (let i = 0; i < tamanhosPermitidos.length; ++i) {
      let wd = tamanhosPermitidos[i].w;
      let ht = tamanhosPermitidos[i].h;
      let x = this.cnf.main_space_x + btn_wd * i;
      let y = this.cnf.main_space_y + btn_ht;

      this.cur_btns_all.push({
        x: x + 10,
        y: y,
        width: btn_wd - 20,
        height: btn_ht - 10,
        label: `${wd}×${ht}`,
        handler: () => {
          this.cells_x = wd;
          this.cells_y = ht;
          this.create_solution();
          this.create_starting_board();
          this.save_boards();
          this.pop_global_mode();
        },
      });
    }
    this.resetConfig();
    this.draw_everything();
  }

  handle_btn_solution() {
    let targetYi = -1,
      targetXi = -1;
    outerLoop: for (let yi = 0; yi < this.cells_y; ++yi) {
      for (let xi = 0; xi < this.cells_x; ++xi) {
        if (this.ASSEMBLY[yi][xi] !== this.SOLUTION[yi][xi]) {
          targetYi = yi;
          targetXi = xi;
          break outerLoop;
        }
      }
    }
    if (targetYi === -1) return;

    let correctTile = this.SOLUTION[targetYi][targetXi];
    let foundBoard = null,
      foundYi = -1,
      foundXi = -1;

    for (let yi = 0; yi < this.cells_y; ++yi) {
      for (let xi = 0; xi < this.cells_x; ++xi) {
        if (this.UNPLACED[yi][xi] === correctTile) {
          foundBoard = this.UNPLACED;
          foundYi = yi;
          foundXi = xi;
          break;
        }
      }
    }
    if (!foundBoard) {
      for (let yi = 0; yi < this.cells_y; ++yi) {
        for (let xi = 0; xi < this.cells_x; ++xi) {
          if (this.ASSEMBLY[yi][xi] === correctTile) {
            foundBoard = this.ASSEMBLY;
            foundYi = yi;
            foundXi = xi;
            break;
          }
        }
      }
    }

    if (foundBoard) {
      let wrongTile = this.ASSEMBLY[targetYi][targetXi];
      this.ASSEMBLY[targetYi][targetXi] = correctTile;
      foundBoard[foundYi][foundXi] = wrongTile;
    }

    this.update_winingness();
    this.save_boards();
    this.draw_everything();
  }

  save_boards() {
    let tiles = [];
    for (let bi = 0; bi < this.BOARDS_TO_SAVE.length; ++bi) {
      let board = this.BOARDS_TO_SAVE[bi];
      for (let yi = 0; yi < this.cells_y; ++yi) {
        for (let xi = 0; xi < this.cells_x; ++xi) {
          let tile = board[yi][xi];
          if (!tile) {
            tiles.push(".");
            continue;
          }
          for (let si = 0; si < this.TILES_SIDES.length; ++si)
            tiles.push(tile[this.TILES_SIDES[si]]);
        }
      }
    }
    document.cookie = `tetravex_boards=${this.cells_x},${this.cells_y},${tiles.join("")}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
  }

  load_boards() {
    let match = document.cookie.match(
      /(?:^|;\s*)tetravex_boards=([.,0-9]+)(?:;|$)/,
    );
    if (!match) return false;
    match = match[1].match(/^(\d+),(\d+),([.0-9]+)$/);
    if (!match) return false;

    let cx = +match[1],
      cy = +match[2];
    if (
      (cx === 3 && cy === 2) ||
      (cx === 2 && cy === 3) ||
      (cx === 2 && cy === 2)
    ) {
      this.cells_x = cx;
      this.cells_y = cy;
    } else {
      this.cells_x = 3;
      this.cells_y = 2;
      return false;
    }

    let tiles = match[3];
    let pos = 0;
    for (let bi = 0; bi < this.BOARDS_TO_SAVE.length; ++bi) {
      let board = this.BOARDS_TO_SAVE[bi];
      board.length = 0;
      for (let yi = 0; yi < this.cells_y; ++yi) {
        let row = [];
        board.push(row);
        for (let xi = 0; xi < this.cells_x; ++xi) {
          let c = tiles[pos];
          if (c === ".") {
            row.push(null);
            ++pos;
            continue;
          }
          let tile = {};
          for (let si = 0; si < this.TILES_SIDES.length; ++si)
            tile[this.TILES_SIDES[si]] = +tiles[pos + si];
          row.push(tile);
          pos += 4;
        }
      }
    }
    this.update_winingness();
    return true;
  }
}
