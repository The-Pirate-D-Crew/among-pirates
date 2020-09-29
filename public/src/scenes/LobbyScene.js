import Phaser from "phaser";
import Player from "../sprites/Player";
import RemotePlayer from "../sprites/RemotePlayer";
import Button from "../sprites/Button";
import settings from "../../config/settings";
import io from "socket.io-client";

const { baseWSocketUrl } = settings;

export default class LobbyScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "LobbyScene",
    });
  }

  init(data) {
    if (!data.matchId || !data.matchCode) {
      console.error("LobbyScene requires {MatchId, MatchCode}");
      this.scene.start("MenuScene");
      return;
    }

    this.remotePlayersCollection = new Map();
    this.remotePlayersBufferCollection = new Map();
    this.matchCode = data.matchCode;

    this.socket = io(baseWSocketUrl, {
      path: `/match/${data.matchId}`,
      autoConnect: false,
      transports: ["websocket"],
    });

    this.socket.connect();

    this.socket.on("playerUpdates", (playerUpdates) => {
      this.serverUpdate(playerUpdates);
    });

    this.socket.on("playerDisconnection", (player) => {
      console.log("player disconnected", player.playerId);
      this.remotePlayersCollection.get(player.playerId).kill();
    });

    console.log("MATCH CODE", this.matchCode);
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
    this.remotePlayersBufferCollection.forEach((remotePlayer, remotePlayerId) => {
      
      // update remote player sprite
      this.remotePlayersCollection
          .get(remotePlayerId)
          .update(remotePlayer.playerStates, remotePlayer.remotePlayerActions);
    });
  }

  serverUpdate(playerUpdates) {
    const { playerActions, playerStates } = playerUpdates;
    for (const [remotePlayerId, remotePlayerActions] of Object.entries(
      playerActions
    )) {
      if (remotePlayerId !== this.player.playerIdLabel.text) {
        if (!this.remotePlayersCollection.has(remotePlayerId)) {
          this._createRemotePlayer(remotePlayerId, {remotePlayerActions, playerStates: playerStates[remotePlayerId]});
          return;
        }
        this.remotePlayersBufferCollection.get(remotePlayerId).remotePlayerActions = remotePlayerActions
        this.remotePlayersBufferCollection.get(remotePlayerId).playerStates = playerStates[remotePlayerId]
        this.remotePlayersCollection.get(remotePlayerId).applyState(playerStates[remotePlayerId]);
      }else{
        this.player.applyState(playerStates[this.player.playerIdLabel.text]);
      }
    }
  }

  _createRemotePlayer(remotePlayerId, playerUpdates) {
    console.log("Player joined!", playerUpdates);
    const remotePlayer = new RemotePlayer({
      scene: this,
      key: "player",
      id: remotePlayerId,
      x: 700,
      y: 550,
    });

    this.physics.add.collider(remotePlayer, this.topLayer);
    this.remotePlayersCollection.set(remotePlayerId, remotePlayer);
    this.remotePlayersBufferCollection.set(remotePlayerId, playerUpdates)
  }
}
