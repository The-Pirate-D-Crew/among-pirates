import Phaser from "phaser";
import MenuScene from './scenes/MenuScene';
import LobbyScene from "./scenes/LobbyScene"

const config = {
  type: Phaser.WEBGL,
  pixelArt: true,
  roundPixels: true,
  parent: 'content',
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: {
              y: 800
          },
          debug: false
      }
  },
  scene: [
    MenuScene,
    LobbyScene
  ]
};

new Phaser.Game(config);