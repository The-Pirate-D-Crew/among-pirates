export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key, config.name);
    config.scene.sys.updateList.add(this);
    config.scene.sys.displayList.add(this);
    config.scene.add.existing(this);
    config.scene.physics.world.enableBody(this);
    this.playerName = config.scene.add.text(10, 10, config.name, {
      fontSize: "12px",
      fill: "#ffffff",
    }),
    this.speed = 180;
    this.setCollideWorldBounds(true);
  }

  update(keys, _time, _delta) {
    let input = {
      left: keys.left.isDown,
      right: keys.right.isDown,
      down: keys.down.isDown,
      up: keys.up.isDown,
    };

    this.playerName.x = this.body.position.x - 20; 
    this.playerName.y =  this.body.position.y - 20; 

    if (this.active === true) {
      if (input.up) {
        this.setVelocityY(-this.speed);
        this.angle = -90;
      } else if (input.down) {
        this.setVelocityY(this.speed);
        this.angle = 90;
      } 


      if (input.left) {
        this.setVelocityX(-this.speed);
        this.angle = 180;
      } else if (input.right) {
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
