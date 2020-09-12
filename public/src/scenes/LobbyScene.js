import Phaser from "phaser";

export default class LobbyScene extends Phaser.Scene {
  
  constructor(game) {
    console.log("LobbyScene instance!");
    super({
      key: "LobbyScene",
    });
  }

  preload() {
    console.log("preload LobbyScene");
  }

  create() {
    console.log("create LobbyScene");
  }

  update() {
    console.log("update LobbyScene");
  }
}
