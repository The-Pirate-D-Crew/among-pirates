export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.sys.updateList.add(this);
    config.scene.sys.displayList.add(this);
    config.scene.add.existing(this);
    config.scene.physics.world.enableBody(this);
    this.speed = 180;
    this.setImmovable(true);
  }

  update(keys, time, delta) {
    let input = {
      left: keys.left.isDown,
      right: keys.right.isDown,
      down: keys.down.isDown,
      up: keys.up.isDown,
    };

    if (this.active === true) {
      if (input.up) {
        this.setVelocityY(-this.speed);
        this.angle = -90;
      }

      if (input.down) {
        this.setVelocityY(this.speed);
        this.angle = 90;
      }

      if (input.left) {
        this.setVelocityX(-this.speed);
        this.angle = 180;
      }

      if (input.right) {
        this.setVelocityX(this.speed);
        this.angle = 360;
      }

      if (input.up && input.right) {
        this.angle = -40;
      }

      if (input.up && input.left) {
        this.angle = -140;
      }

      if (input.down && input.right) {
        this.angle = 40;
      }

      if (input.down && input.left) {
        this.angle = 140;
      }

      if (keys.left.isUp && keys.right.isUp) {
        this.setVelocityX(0);
      }

      if (keys.down.isUp && keys.up.isUp) {
        this.setVelocityY(0);
      }
    }
  }
}
