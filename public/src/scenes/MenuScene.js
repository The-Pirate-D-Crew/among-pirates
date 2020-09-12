import Phaser from "phaser";
import HttpRequest from "../client/http";
import Socket from "../client/socket";
import _ from "lodash";
export default class MenuScene extends Phaser.Scene {
  constructor(game) {
    console.log("Menu instance!");
    super({
      key: "MenuScene",
    });
    this.socket = null;
    this.matchId = null;
  }

  preload() {
    console.log("preload menu");
  }

  async create() {
    console.log("create menu");

    // start match
    this.matchId = this._createMatch();
    if (this._joinMatch(this.matchId)) this._matchJoined();
  }

  update() {
    console.log("update menu");
  }

  _matchJoined() {
    this.socket = Socket(this.matchId);

    this.socket.onPlayerStates((data) => {
      console.log("player states", data);
    });
  }

  async _createMatch() {
    try {
      const response = await HttpRequest.createMatch();
      return response.id;
    } catch (e) {
      console.error(e);
      alert("Something went wrong creating match..");
    } finally {
      return null;
    }
  }

  async _joinMatch(matchId) {
    try {
      const response = await HttpRequest.joinMatch(matchId);
      if (response.status === 200) return true;
    } catch (e) {
      console.error(e);
      alert("Something went wrong joining match..");
    } finally {
      return false;
    }
  }
}
