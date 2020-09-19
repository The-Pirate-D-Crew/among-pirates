import makeAnimations from '../helpers/animations';

class BootScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "BootScene",
    });
  }
  preload() {
    const progress = this.add.graphics();

    // Register a load progress event to show a load bar
    this.load.on("progress", (value) => {
      progress.clear();
      progress.fillStyle(0xffffff, 1);
      progress.fillRect(
        0,
        this.sys.game.config.height / 2,
        this.sys.game.config.width * value,
        60
      );
    });

    // Register a load complete event to launch the title screen when all files are loaded
    this.load.on("complete", () => {
      // prepare all animations, defined in a separate file
      makeAnimations(this);
      progress.destroy();
      this.scene.start("MenuScene");
    });

    this.load.image("background", "assets/menu-background.png");
    this.load.image("create-match-button", "assets/create-match-button.png");
    this.load.image("join-match-button", "assets/join-match-button.png");
    this.load.image("player", "assets/soldier1_stand.png")
    this.load.image("tilesheet-complete", "assets/tilesheet_complete.png")
    this.load.image("exit-icon", "assets/exit-icon.png")
    this.load.image("start-match-button", "assets/start-match-button.png")
    this.load.image("zombie", "assets/zoimbie1_stand.png")
    this.load.tilemapTiledJSON("lobby-map", "assets/maps/lobby-map.json");
  }
}

export default BootScene;
