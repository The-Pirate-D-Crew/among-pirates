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
    // KEYS
    this.keys = {
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
    };

    // CREATE MAP!
    this.map = this.add.tilemap("lobby-map");
    this.terrain = this.map.addTilesetImage(
      "lobby-map",
      "tilesheet-complete",
      32,
      32,
      0,
      0
    );

    this.map.createStaticLayer("bot-lvl3", [this.terrain], 0, 0).setDepth(-1);
    this.map.createStaticLayer("bot-lvl2", [this.terrain], 0, 0).setDepth(-2);
    this.map.createStaticLayer("bot", [this.terrain], 0, 0).setDepth(-3);

    // WORLD PHYSICS
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.topLayer = this.map.createStaticLayer("top", [this.terrain], 0, 0);

    this.topLayer.setCollisionByProperty({ collide: true });

    // FOR DEBUGGIN PURPOSES
    // this.topLayer.renderDebug(this.add.graphics(), {
    //   tileColor: null, //non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles,
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Colliding face edges
    // });

    // CREATE PLAYER! :)
    this.player = new Player({
      scene: this,
      key: "player",
      name: "Thunderkey95",
      x: 700,
      y: 550,
    });

    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.topLayer);

    this.cameras.main.startFollow(this.player);

    // EXIT BUTTON
    this.exitButton = this.add.sprite(760, 560, "exit-icon");
    this.exitButton.setScrollFactor(0, 0);

    this.exitButton.inputEnabled = true;
    this.exitButton.setInteractive({ useHandCursor: true });

    this.exitButton.on("pointerover", () => {
      this.exitButton.alpha = 0.8;
    });

    this.exitButton.on("pointerout", () => {
      this.exitButton.alpha = 1;
    });

    this.exitButton.on("pointerdown", () => this.scene.start("MenuScene"));

    // START MATCH BUTTON
    this.startMatchButton = this.add.sprite(400, 560, "start-match-button");
    this.startMatchButton.setScrollFactor(0, 0);

    this.startMatchButton.inputEnabled = true;
    this.startMatchButton.setInteractive({ useHandCursor: true });

    this.startMatchButton.on("pointerover", () => {
      this.startMatchButton.alpha = 0.8;
    });

    this.startMatchButton.on("pointerout", () => {
      this.startMatchButton.alpha = 1;
    });

    this.startMatchButton.on("pointerdown", () => this._startMatch());
  }

  _startMatch() {
    console.log("start match!");
  }

  update(time, delta) {
    // player updates
    this.player.update(this.keys, time, delta);
  }
}
