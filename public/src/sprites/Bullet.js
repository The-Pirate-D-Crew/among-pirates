export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.sys.updateList.add(this);
    config.scene.sys.displayList.add(this);
    config.scene.add.existing(this);
    config.scene.physics.world.enableBody(this);

    this.scene.sound.add("shoot")
    this.scene.sound.play("shoot");

    this.speed = 0.5;
    this.born = 0;

    this.direction = Math.atan(
      (this.scene.targetScope.x - this.x) / (this.scene.targetScope.y - this.y)
    );
    this.direction += Math.random() / 10 + -(Math.random() / 10);

    if (this.scene.targetScope.y >= this.y) {
      this.xSpeed = this.speed * Math.sin(this.direction);
      this.ySpeed = this.speed * Math.cos(this.direction);
    } else {
      this.xSpeed = -this.speed * Math.sin(this.direction);
      this.ySpeed = -this.speed * Math.cos(this.direction);
    }
  }

  update(_time, delta) {
    this.x += this.xSpeed * delta;
    this.y += this.ySpeed * delta;
    this.born += delta;
    if (this.born > 1500) {
      this.destroy();
    }
  }
}
