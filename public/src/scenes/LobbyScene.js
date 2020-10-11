import Phaser from "phaser";
import Player from "../sprites/Player";
import RemotePlayer from "../sprites/RemotePlayer";
import TargetCursor from "../sprites/TargetScope"
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
      path: "/socket.io",
      autoConnect: false,
      transports: ["websocket"],
      query: {
        matchId: data.matchId
      }
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
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
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

    // TODO: move all this stuff to GameScene when created
    // create target scope
    this.targetScope = new TargetCursor({
      scene: this,
      key: "target-scope",
      x: 700,
      y: 550,
    })

  }

  // Starts the Match
  _startMatch() {
    console.log("start match!");
  }

  update(time, delta) {
    // Player updates
    this.player.update(this.keys, time, delta);

    // Bullet updates
    this.player.bulletGroup.children.entries.forEach((bullet) => bullet.update(time, delta))

    this.remotePlayersBufferCollection.forEach((remotePlayer, remotePlayerId) => {
      
      // update remote player sprite
      this.remotePlayersCollection
          .get(remotePlayerId)
          .update(remotePlayer.playerStates, remotePlayer.remotePlayerActions);
    });

    // Target scope updates
    this.targetScope.update(this.keys, time, delta)
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
    console.log("Player joined!", remotePlayerId);
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
