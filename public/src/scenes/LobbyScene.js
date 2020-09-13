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
      x: 30,
      y: 30,
    });

    this.player.setCollideWorldBounds(true);

    // CREATE MAP!
    this.map = this.add.tilemap("map1");
    this.terrain = this.map.addTilesetImage("tilesheet_complete", "map1-image");

    let botLayer = this.map
      .createStaticLayer("bot", [this.terrain], 0, 0)
      .setDepth(-1);
    this.topLayer = this.map.createStaticLayer("top", [this.terrain], 0, 0);

    this.topLayer.setCollisionByProperty({ collides: true });
    this.topLayer.renderDebug(this.add.graphics(), {
      tileColor: null, //non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles,
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Colliding face edges
    });

    this.physics.add.collider(this.player, this.topLayer);

    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
  }

  update(time, delta) {
    // player updates
    this.player.update(this.keys, time, delta);
  }
}
