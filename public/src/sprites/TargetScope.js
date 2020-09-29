export default class TargetCursor extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key, config.name);
    config.scene.sys.updateList.add(this);
    config.scene.sys.displayList.add(this);
    config.scene.add.existing(this);

    config.scene.input.on("pointermove", (pointer) => {
      const transformedPoint = config.scene.cameras.main.getWorldPoint(
        pointer.x,
        pointer.y
      );
      this.x = transformedPoint.x;
      this.y = transformedPoint.y;
    });
    config.scene.input.setDefaultCursor("none");
  }

  update(keys, _time, _delta) {
  
    let playerAction = {
      left: keys.left.isDown,
      right: keys.right.isDown,
      down: keys.down.isDown,
      up: keys.up.isDown,
    };

    if (
      playerAction.left ||
      playerAction.right ||
      playerAction.down ||
      playerAction.up
    ) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }
}
