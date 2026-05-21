import config from "./config.js";
import start from "./start.js";
import scene0 from "./scene0.js";
import scene1 from "./scene1.js";
import scene2 from "./scene2.js";
import preloader from "./preloader.js";
import gameover1 from "./gameover1.js";

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.room = new URLSearchParams(location.search).get("room") || "main";

    this.scene.add("start", start);
    this.scene.add("scene0", scene0);
    this.scene.add("scene1", scene1);
    this.scene.add("scene2", scene2);
    this.scene.add("preloader", preloader);
    this.scene.add("gameover1", gameover1);
    this.scene.start("start");

    this.audio = document.querySelector("audio");
    this.iceServers = {
      iceServers: [
        {
          urls: "turn:feira-de-jogos.dev.br",
          username: "adc20261",
          credential: "adc20261",
        },
        {
          urls: "stun:feira-de-jogos.dev.br",
        },
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };

    if (location.hostname.match(/localhost|127\.0\.0\.1/)) {
      this.socket = io("http://localhost:3000");
    } else if (location.hostname.match(/github\.dev/)) {
      this.socket = io(location.hostname.replace("8080", "3000"));
    } else {
      this.socket = io();
    }

    this.socket.on("connect", () => {
      console.log("Socket ID:", this.socket.id, "room:", this.room);
      this.socket.emit("join-room", this.room);

      this.socket.on("change-scene", (scene) => {
        let currentScene = this.scene.scenes.find((s) => s.scene.isActive())
          .scene.key;

        if (currentScene !== scene) {
          console.log("Changing scene to:", scene);
          this.scene.stop(currentScene);
          this.scene.start(scene);
        }
      });
    });
  }
}

window.onload = () => {
  window.game = new Game();
};
