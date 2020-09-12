import Phaser from "phaser";
import InputTextPlugin from 'phaser3-rex-plugins/plugins/inputtext-plugin.js';
import BootScene from './scenes/BootScene';
import MenuScene from "./scenes/MenuScene";
import LobbyScene from "./scenes/LobbyScene";

const config = {
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  parent: "content",
  width: 800,
  height: 600,
  dom: {
    createContainer: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 800,
      },
      debug: false,
    },
  },
  plugins: {
    global: [
      {
        key: "rexInputTextPlugin",
        plugin: InputTextPlugin,
        start: true,
      },
    ],
  },
  scene: [BootScene, MenuScene, LobbyScene],
};

const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars
