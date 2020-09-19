import Phaser from "phaser";
import Player from "../sprites/Player";
import Zombie from "../sprites/Zombie";
import Button from "../sprites/Button";
import Socket from "../client/socket";

export default class LobbyScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "LobbyScene",
    });
  }

  init(data) {
    console.log("init", data);
    this.matchCode = data.matchCode;

    this.socket = new Socket(data.matchId);
    this.socket.onPlayerStates((data) => {
      console.log("player states", data);
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
      name: "Thunderkey95", // TODO: change this
      x: 700,
      y: 550,
    });

    this.physics.add.collider(this.player, this.topLayer);
    this.cameras.main.startFollow(this.player);

    // Zombies Test
    this.enemyGroup = this.add.group();
    this.enemyGroup.add(
      new Zombie({ scene: this, key: "zombie", x: 100, y: 200 })
    );

    this.enemyGroup.add(
      new Zombie({ scene: this, key: "zombie", x: 750, y: 550 })
    );

    this.enemyGroup.add(
      new Zombie({ scene: this, key: "zombie", x: 300, y: 400 })
    );

    this.enemyGroup.add(
      new Zombie({ scene: this, key: "zombie", x: 130, y: 200 })
    );

    this.enemyGroup.add(
      new Zombie({ scene: this, key: "zombie", x: 800, y: 300 })
    );

    this.enemyGroup.children.entries.forEach((sprite) => {
      this.physics.add.collider(sprite, this.topLayer);
      this.physics.add.collider(sprite, this.player);
    });

    // Exit Button
    this.exitButton = new Button({
      scene: this,
      key: "exit-icon",
      x: 760,
      y: 560,
      cameraSticky: true,
    }).on("pointerdown", () => {
      this.socket.disconnect();
      this.scene.start("MenuScene");
    });

    // Start Match Button
    this.startMatchButton = new Button({
      scene: this,
      key: "start-match-button",
      x: 400,
      y: 560,
      cameraSticky: true,
    }).on("pointerdown", () => this._startMatch());

    // Match Code
    this.matchCodeText = this.add
      .text(350, 10, this.matchCode, {
        fontSize: "20px",
        fill: "#ffffff",
      })
      .setDepth(1);
    this.matchCodeText.setScrollFactor(0, 0);
  }

  // Starts the Match
  _startMatch() {
    console.log("start match!");
  }

  update(time, delta) {
    // Player updates
    this.player.update(this.keys, time, delta);

    // Enemy Updates
    this.enemyGroup.children.entries.forEach((sprite) => {
      sprite.update(time, delta);
    });
  }
}
