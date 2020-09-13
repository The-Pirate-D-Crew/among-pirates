import Phaser from "phaser";
import Player from "../sprites/Player";
import Button from "../sprites/Button";

export default class LobbyScene extends Phaser.Scene {
  constructor(test) {
    console.log("LobbyScene instance!");
    super({
      key: "LobbyScene",
    });
  }

  create() {

    // Keys
    this.keys = {
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
    };

    // Create Map!
    this.map = this.add.tilemap("lobby-map");
    this.terrain = this.map.addTilesetImage(
      "lobby-map",
      "tilesheet-complete",
      32,
      32,
      0,
      0
    );

    // Map Layers
    this.map.createStaticLayer("bot-lvl3", [this.terrain], 0, 0).setDepth(-1);
    this.map.createStaticLayer("bot-lvl2", [this.terrain], 0, 0).setDepth(-2);
    this.map.createStaticLayer("bot", [this.terrain], 0, 0).setDepth(-3);
    this.topLayer = this.map.createStaticLayer("top", [this.terrain], 0, 0);
    this.topLayer.setCollisionByProperty({ collide: true });

    // For debugging purposes
    // this.topLayer.renderDebug(this.add.graphics(), {
    //   tileColor: null, //non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles,
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Colliding face edges
    // });

    // Map World Bounds
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    // CREATE PLAYER! :)
    this.player = new Player({
      scene: this,
      key: "player",
      name: "Thunderkey95",
      x: 700,
      y: 550,
    });

    this.physics.add.collider(this.player, this.topLayer);
    this.cameras.main.startFollow(this.player);

    // Exit Button
    this.exitButton = new Button({
      scene: this,
      key: "exit-icon",
      x: 760,
      y: 560,
      cameraSticky: true,
    }).on("pointerdown", () => this.scene.start("MenuScene"));

    // Start Match Button
    this.startMatchButton = new Button({
      scene: this,
      key: "start-match-button",
      x: 400,
      y: 560,
      cameraSticky: true,
    }).on("pointerdown", () => this._startMatch());
  }

  // Starts the Match
  _startMatch() {
    console.log("start match!");
  }

  update(time, delta) {
    // Player updates
    this.player.update(this.keys, time, delta);
  }
}
