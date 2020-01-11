import Phaser from "phaser";

export default class Scene extends Phaser.Scene {
  constructor() {
    super("bootGame");
    this.sceneWidth = 256;
    this.sceneHeight = 272;
  }

  preload() {
    this.load.image("background", "assets/bg.png");
    this.load.spritesheet("ship", "assets/hawk.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.image("ship2", "assets/ship2.png");
    this.load.image("ship3", "assets/ship3.png");
    this.load.image("pu", "assets/powerup.png");
  }

  create() {
    this.lives = 3;
    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0);

    this.scoreText = this.add.text(100, 20, "lives: " + this.lives);

    this.ship1 = this.physics.add.sprite(
      this.sceneWidth / 2 - 50,
      this.sceneHeight / 2,
      "ship"
    );
    this.ship2 = this.physics.add.image(this.sceneWidth / 2, 0, "ship2");
    this.ship3 = this.physics.add.image(this.sceneWidth / 2 + 50, 0, "ship3");

    this.enemyShips = this.physics.add.group();
    this.enemyShips.add(this.ship2);
    this.enemyShips.add(this.ship3);

    this.anims.create({
      key: "ship_anim",
      frames: this.anims.generateFrameNumbers("ship"),
      frameRate: 20,
      repeat: -1
    });
    this.ship1.play("ship_anim");
    this.keys = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(
      this.ship1,
      this.enemyShips,
      this.endGame,
      null,
      this
    );

    this.createPowerUps();
  }

  createPowerUps() {
    this.powerUps = this.physics.add.group();

    this.powerUp1 = this.physics.add.sprite(0, 0, "pu");
    this.powerUp1.setRandomPosition(0, 0, this.sceneWidth, this.sceneHeight);
    this.powerUp1.setVelocity(100, 100);
    this.physics.world.setBoundsCollision();
    this.powerUp1.setCollideWorldBounds(true);
    this.powerUp1.setBounce(1);

    this.physics.add.overlap(
      this.powerUp1,
      this.ship1,
      this.onPowerUpPickup,
      null,
      this
    );
  }

  onPowerUpPickup(powerup) {
    this.lives = this.lives + 1;
    this.updateLives();
    powerup.destroy();
  }

  update() {
    let speed = 2;

    if (this.keys.left.isDown && this.ship1.x > 0) {
      this.ship1.x = this.ship1.x - speed;
    } else if (this.keys.right.isDown && this.ship1.x < this.sceneWidth) {
      this.ship1.x = this.ship1.x + speed;
    }

    if (this.keys.up.isDown && this.ship1.y > 0) {
      this.ship1.y = this.ship1.y - speed;
    } else if (this.keys.down.isDown && this.ship1.y < this.sceneHeight) {
      this.ship1.y = this.ship1.y + speed;
    }

    this.ship2.y += 0.4;
    this.ship3.y += 1.1;

    if (this.ship2.y > this.sceneHeight) {
      this.ship2.y = 0;
      this.ship2.x = Math.random() * this.sceneWidth;
    }

    if (this.ship3.y > this.sceneHeight) {
      this.ship3.y = 0;
      this.ship3.x = Math.random() * this.sceneWidth;
    }
  }

  updateLives() {
    this.scoreText.setText("lives: " + this.lives);
  }

  onEnemiesCollide() {
    if (this.lives > 0) {
      this.lives = this.lives - 1;
      this.updateLives();
    } else {
      this.endGame();
    }
  }

  endGame() {
    this.lives = this.lives - 1;

    if (this.lives <= 0) {
      this.scene.start("endgame");
    }

    this.ship1.y = this.sceneHeight / 2;
    this.ship1.x = this.sceneWidth / 2;
  }
}
