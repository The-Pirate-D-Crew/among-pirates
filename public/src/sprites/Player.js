export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.sys.updateList.add(this);
    config.scene.sys.displayList.add(this);
    config.scene.add.existing(this);
    config.scene.physics.world.enableBody(this);

    this.playerId = config.scene.add.text(10, 10, "", {
      fontSize: "12px",
      fill: "#ffffff",
    });

    this.speed = 180;
    this.setCollideWorldBounds(true);

    this.scene.socket.socket.on('connect', () => {
      this.playerId.text = this.scene.socket.socket.id
    });

  }

  update(keys, _time, _delta) {
    let playerAction = {
      left: keys.left.isDown,
      right: keys.right.isDown,
      down: keys.down.isDown,
      up: keys.up.isDown,
    };

    this.playerId.x = this.body.position.x - 20; 
    this.playerId.y = this.body.position.y - 20; 

    // socket emit
    this.scene.socket.emit("actionUpdate", playerAction)
    
    if (this.active === true) {
      if (playerAction.up) {
        this.setVelocityY(-this.speed);
        this.angle = -90;
      } else if (playerAction.down) {
        this.setVelocityY(this.speed);
        this.angle = 90;
      } 

      if (playerAction.left) {
        this.setVelocityX(-this.speed);
        this.angle = 180;
      } else if (playerAction.right) {
        this.setVelocityX(this.speed);
        this.angle = 360;
      }
      
      if (playerAction.up && playerAction.right) {
        this.angle = -40;
      }

      if (playerAction.up && playerAction.left) {
        this.angle = -140;
      }

      if (playerAction.down && playerAction.right) {
        this.angle = 40;
      }

      if (playerAction.down && playerAction.left) {
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
