export default class RemotePlayer extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key, config.id);
    config.scene.sys.updateList.add(this);
    config.scene.sys.displayList.add(this);
    config.scene.add.existing(this);
    config.scene.physics.world.enableBody(this);

    this.playerIdLabel = config.scene.add.text(10, 10, config.id, {
      fontSize: "12px",
      fill: "#ffffff",
    });

    this.speed = 180;
    this.setCollideWorldBounds(true);
  }

  applyState(playerState){
    this.scene.physics.moveTo(this, playerState.x, playerState.y, null, 1000/20);
  }

  update(playerState, playerAction) {
    const currentTime = Date.now();

    // Set player positin
    // this.setX(playerState.x);
    // this.setY(playerState.y);

    // Set player name position
    this.playerIdLabel.setX(this.x - 20);
    this.playerIdLabel.setY(this.y - 20);

    // this.playerIdLabel.x = this.body.position.x - 20;
    // this.playerIdLabel.y = this.body.position.y - 20;

    // const missingPixels =
    //   ((currentTime - playerAction.time) * this.speed) / 1000;

    // if (Math.round(playerState.y - this.y) > 1) {
    //   this.y += missingPixels;
    // }

    // if (Math.round(playerState.y - this.y) < -1) {
    //   this.y -= missingPixels;
    // }

    // if (Math.round(playerState.x - this.x) > 1) {
    //   this.x += missingPixels;
    // }

    // if (Math.round(playerState.x - this.x) < -1) {
    //   this.x -= missingPixels;
    // }

    // if (playerAction.up) {
    //   this.setVelocityY(-this.speed);  
    //   this.angle = -90;
    // } else if (playerAction.down) {
    //   this.setVelocityY(this.speed);
    //   this.angle = 90;
    // }

    // if (playerAction.left) {
    //   this.setVelocityX(-this.speed);
    //   this.angle = 180;
    // } else if (playerAction.right) {
    //   this.setVelocityX(this.speed);
    //   this.angle = 360;
    // }

    // if (playerAction.up && playerAction.right) {
    //   this.angle = -40;
    // }

    // if (playerAction.up && playerAction.left) {
    //   this.angle = -140;
    // }

    // if (playerAction.down && playerAction.right) {
    //   this.angle = 40;
    // }

    // if (playerAction.down && playerAction.left) {
    //   this.angle = 140;
    // }

    // if (
    //   !playerAction.down &&
    //   !playerAction.up &&
    //   !playerAction.left &&
    //   !playerAction.right
    // ) {
    //   this.setVelocityX(0);
    //   this.setVelocityY(0);
    // }
  }

  kill() {
    this.playerIdLabel.destroy();
    this.destroy();
  }
}
