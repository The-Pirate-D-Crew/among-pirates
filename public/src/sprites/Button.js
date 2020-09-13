export default class Button extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key, config.name);
    config.scene.add.existing(this);
    this.inputEnabled = true;
    this.setInteractive({ useHandCursor: true });

    this.on("pointerover", () => {
      this.alpha = 0.8;
    });

    this.on("pointerout", () => {
      this.alpha = 1;
    });

    if (config.cameraSticky) {
      this.setScrollFactor(0, 0);
    }
  }

}
