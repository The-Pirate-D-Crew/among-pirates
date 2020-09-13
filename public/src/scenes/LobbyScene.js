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

    // CREATE MAP!
    this.map = this.add.tilemap("lobby-map");
    this.terrain = this.map.addTilesetImage("lobby-map", "tilesheet-complete");

    this.map.createStaticLayer("bot-lvl3", [this.terrain], 0, 0).setDepth(-1);
    this.map.createStaticLayer("bot-lvl2", [this.terrain], 0, 0).setDepth(-2);
    this.map.createStaticLayer("bot", [this.terrain], 0, 0).setDepth(-3);
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
      name: this.add.text(10, 10, "Player Name", {
        fontSize: "12px",
        fill: "#ffffff",
      }),
      x: 30,
      y: 30,
    });

    this.player.setCollideWorldBounds(true);
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
