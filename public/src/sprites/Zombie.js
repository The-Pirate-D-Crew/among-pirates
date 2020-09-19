export default class Zombie extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key, config.name);
    config.scene.sys.updateList.add(this);
    config.scene.sys.displayList.add(this);
    config.scene.add.existing(this);
    config.scene.physics.world.enableBody(this);
    this.setCollideWorldBounds(true);
  }

  update(_time, _delta) {
    this.scene.physics.moveToObject(this, this.scene.player, 50);
    this.rotation = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.player.x,
      this.scene.player.y
    );
  }
}
