import Phaser from "phaser";
import HttpRequest from "../client/http";
import Socket from "../client/socket";
import Button from "../sprites/Button";
import _ from "lodash";
export default class MenuScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "MenuScene",
    });

    // Scene main attributes
    this.socket;
    this.matchId;

    // Buttons
    this.createMatchButton;
    this.joinMatchButton;

    // Inputs
    this.matchIdInput;
  }

  preload() {
    console.log("preload menu");
  }

  create() {
    // Background
    this.add.sprite(0, 0, "background").setOrigin(0, 0);

    // Create Match Button
    this.createMatchButton = new Button({
      scene: this,
      key: "create-match-button",
      x: 400,
      y: 250,
    });

    this.createMatchButton.on("pointerdown", () => this._createMatch());

    // Join Match Button
    this.joinMatchButton = new Button({
      scene: this,
      key: "join-match-button",
      x: 400,
      y: 400
    })

    this.joinMatchButton.on("pointerdown", () => this._startJoinMatch());

    // Match id input
    this.matchIdInput = this.add.rexInputText(400, 340, 160, 32, {
      type: "text",
      placeholder: "Enter game code",
      fontSize: "15px",
      lineHeight: "30px",
      paddingLeft: "10px",
      background: "rgba(255,255,255,0.3)",
      borderRadius: "12px",
    });

    this.matchIdInput.on("textchange", (inputText) => {
      this.matchId = inputText.text;
    });
  }

  update() {
    console.log("update menu");
  }

  _startJoinMatch() {
    this.scene.start("LobbyScene");
    // if(_.isUndefined(this.matchId)) {
    //     alert("You must enter a game code.")
    // }
  }

  _matchJoined() {
    this.socket = new Socket(this.matchId);
    this.socket.onPlayerStates((data) => {
      console.log("player states", data);
    });
  }

  _createMatch() {
    HttpRequest.createMatch()
      .then((response) => {
        console.log("create match response!", response);
        this._joinMatch(response.id);
      })
      .catch((e) => {
        console.error(e);
        alert("Something went wrong creating match..");
      });
  }

  _joinMatch(matchId) {
    HttpRequest.joinMatch(matchId)
      .then((response) => {
        console.log("join match response!", response);
        if (response.status === 200) this._matchJoined();
      })
      .catch((e) => {
        console.error(e);
        alert("Something went wrong joining match..");
      });
  }
}
