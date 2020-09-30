export default class TargetCursor extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key, config.name);
    config.scene.sys.updateList.add(this);
    config.scene.sys.displayList.add(this);
    config.scene.add.existing(this);

    this.scene.input.on("pointermove", (pointer) => {
      const transformedPoint = this.scene.cameras.main.getWorldPoint(
        pointer.x,
        pointer.y
      );
      this.x = transformedPoint.x;
      this.y = transformedPoint.y;
    });
    this.scene.input.setDefaultCursor("none");
  }

  update(keys, _time, _delta) { }
}
