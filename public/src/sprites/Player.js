export default class Player extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    this.speed = 5;
  }

  update(keys, time, delta) {
    let input = {
      left: keys.left.isDown,
      right: keys.right.isDown,
      down: keys.down.isDown,
      up: keys.up.isDown,
    };

    if (input.up) {
      this.y -= this.speed;
    }

    if (input.down) {
      this.y += this.speed;
    }

    if (input.left) {
      this.x -= this.speed;
    }

    if (input.right) {
      this.x += this.speed;
    }
  }
}
