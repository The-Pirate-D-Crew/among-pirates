import Phaser from "phaser";
import Player from "../sprites/Player";
export default class LobbyScene extends Phaser.Scene {
  constructor(test) {
    console.log("LobbyScene instance!");
    super({
      key: "LobbyScene",
    });
  }

  preload() {
    console.log("preload LobbyScene");
  }

  create() {
    // Background
    this.add.sprite(0, 0, "background").setOrigin(0, 0);

    // KEYS
    this.keys = {
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
    };



    // CREATE PLAYER! :)
    this.player = new Player({
      scene: this,
      key: "player",
      x: 16 * 6,
      y: this.sys.game.config.height - 48 - 48,
    });
  }

  update(time, delta) {

    // player updates
    this.player.update(this.keys, time, delta);
  }
}
