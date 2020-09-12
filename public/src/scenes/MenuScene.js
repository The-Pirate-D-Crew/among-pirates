import Phaser from "phaser";
import HttpRequest from "../client/http";
import Socket from "../client/socket";
import _ from "lodash"
export default class MenuScene extends Phaser.Scene {
  constructor(game) {
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

    this.load.image("background", "assets/menu-background.png");
    this.load.image("create-match-button", "assets/create-match-button.png");
    this.load.image("join-match-button", "assets/join-match-button.png");
  }

  create() {
    // Background
    this.add.sprite(0, 0, "background").setOrigin(0, 0);
    
    // Create Match Button
    this.createMatchButton = this.add.sprite(400, 250, "create-match-button");
    this.createMatchButton.inputEnabled = true;
    this.createMatchButton.setInteractive({ useHandCursor: true });

    this.createMatchButton.on("pointerover", () => {
      this.createMatchButton.alpha = 0.8;
    });

    this.createMatchButton.on("pointerout", () => {
      this.createMatchButton.alpha = 1;
    });

    this.createMatchButton.on("pointerdown", () => this._createMatch());

    // Join Match Button
    this.joinMatchButton = this.add.sprite(400, 400, "join-match-button");
    this.joinMatchButton.inputEnabled = true;
    this.joinMatchButton.setInteractive({ useHandCursor: true });

    this.joinMatchButton.on("pointerover", () => {
      this.joinMatchButton.alpha = 0.8;
    });

    this.joinMatchButton.on("pointerout", () => {
      this.joinMatchButton.alpha = 1;
    });

    this.joinMatchButton.on("pointerdown", () => this._startJoinMatch());

    // Match id input
    this.matchIdInput = this.add.rexInputText(400, 340, 160, 32, {
        type: 'text',
        placeholder: "Enter game code",
        fontSize: '15px',
        lineHeight: "30px",
        paddingLeft: "10px",
        background: "rgba(255,255,255,0.3)",
        borderRadius: "12px"
    })

    this.matchIdInput.on('textchange', (inputText) => {
        this.matchId = inputText.text;
    })
  }

  update() {
    console.log("update menu");
  }

  _startJoinMatch() {
    if(_.isUndefined(this.matchId)) {
        alert("You must enter a game code.")
    }
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
