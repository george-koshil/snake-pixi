import * as PIXI from "pixi.js";

export class Food {
  food;
  tileSize;
  fieldSize;
  gameContainer;

  constructor(gameContainer, tileSize, fieldSize) {
    this.tileSize = tileSize;
    this.fieldSize = fieldSize;
    this.gameContainer = gameContainer;

    this.food = new PIXI.Graphics();
    this.spawn();
  }

  spawn() {
    const x = Math.floor(Math.random() * (this.fieldSize - 2)) + 1;
    const y = Math.floor(Math.random() * (this.fieldSize - 2)) + 1;

    this.food.clear();
    this.food.beginFill(0xff0000);
    this.food.drawRect(0, 0, this.tileSize, this.tileSize);
    this.food.endFill();

    this.food.x = x * this.tileSize;
    this.food.y = y * this.tileSize;

    if (!this.gameContainer.children.includes(this.food)) {
      this.gameContainer.addChild(this.food);
    }
  }

  getPosition() {
    return { x: this.food.x / this.tileSize, y: this.food.y / this.tileSize };
  }

  setVisible(visible) {
    this.food.visible = visible;
  }
}
