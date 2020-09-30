import Bullet from "./Bullet"
export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.sys.updateList.add(this);
    config.scene.sys.displayList.add(this);
    config.scene.add.existing(this);
    config.scene.physics.world.enableBody(this);

    this.playerIdLabel = config.scene.add.text(10, 10, "", {
      fontSize: "12px",
      fill: "#ffffff",
    });

    this.speed = 180;
    this.setCollideWorldBounds(true);

    // setting up player id
    this.scene.socket.on("connect", () => {
      this.playerIdLabel.text = this.scene.socket.id;
    });

    // Player angle to pointer
    this.scene.input.on("pointermove", (pointer) => {
      this.rotation = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX , pointer.worldY)
    });

    // Bullet group
    this.bulletGroup = this.scene.add.group();
    this.fireRate = 100;
    this.nextFire = 0;
  }

  applyState(playerState) {
    this.scene.physics.moveTo(this, playerState.x, playerState.y, null, 1000/20);
  }

  shoot(time) {
    if(time > this.nextFire) {
      this.nextFire = time + this.fireRate;
      this.bulletGroup.add(
        new Bullet({
          scene: this.scene,
          key: "bullet",
          x: this.x + (Math.cos(this.rotation) * 20),
          y: this.y + (Math.sin(this.rotation) * 20),
        })
      );
    }
  }

  update(keys, time, delta) {

    let playerAction = {
      left: keys.left.isDown,
      right: keys.right.isDown,
      down: keys.down.isDown,
      up: keys.up.isDown,
      shoot: keys.space.isDown
    };

    // socket player actionUpdate emit
    this.scene.socket.emit("actionUpdate", playerAction);

    if (this.active === true) {

      // Update name position
      this.playerIdLabel.x = this.x - 20;
      this.playerIdLabel.y = this.y - 20;

      // Shoot, TODO: improve this!
      if (playerAction.shoot) this.shoot(time)
    }
  }
}
