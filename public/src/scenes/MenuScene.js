import Phaser from "phaser";
import HttpRequest from "../client/http";
import Button from "../sprites/Button";
import _ from "lodash";
export default class MenuScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "MenuScene",
    });

    // Scene main attributes
    this.socket;
    this.matchCode;

    // Buttons
    this.createMatchButton;
    this.joinMatchButton;
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
      y: 400,
    });

    this.joinMatchButton.on("pointerdown", () => this._startJoinMatch());

    // Match id input
    this.matchCodeInput = this.add.rexInputText(400, 340, 160, 32, {
      type: "text",
      placeholder: "Enter game code",
      fontSize: "15px",
      lineHeight: "30px",
      paddingLeft: "10px",
      background: "rgba(255,255,255,0.3)",
      borderRadius: "12px",
    });

    this.matchCodeInput.on("textchange", (inputText) => {
      this.matchCode = inputText.text;
    });
  }

  update() {
    console.log("update menu");
  }

  _startJoinMatch() {
    if (_.isUndefined(this.matchCode)) {
      alert("You must enter a game code.");
      return;
    }
    this._joinMatch(this.matchCode);
  }

  _matchJoined(matchId) {
    this.scene.start("LobbyScene", {
      matchCode: this.matchCode,
      matchId: matchId,
    });
    this.matchCode = null;
  }

  _createMatch() {
    HttpRequest.createMatch()
      .then((response) => {
        console.log("create match response!", response);
        this.matchCode = response.data.code;
        this._joinMatch(response.data.code);
      })
      .catch((e) => {
        console.error(e);
        alert("Something went wrong creating match..");
      });
  }

  _joinMatch(matchCode) {
    HttpRequest.joinMatch(matchCode)
      .then((response) => {
        console.log("join match response!", response);
        if (response.status === 200) this._matchJoined(response.data.id);
      })
      .catch((e) => {
        console.error(e);
        alert("Something went wrong joining match..");
      });
  }
}
