import * as PIXI from "pixi.js";

export class Snake {
  segments = [];
  direction;
  tileSize;
  gameContainer;

  constructor(gameContainer, tileSize) {
    this.tileSize = tileSize;
    this.gameContainer = gameContainer;
    this.direction = { x: 1, y: 0 };

    for (let i = 0; i < 5; i++) {
      this.addSegment(10 - i, 10);
    }
  }

  addSegment(x, y) {
    const segment = new PIXI.Graphics();
    segment.beginFill(0x00ff00);
    segment.drawRect(0, 0, this.tileSize, this.tileSize);
    segment.endFill();

    segment.x = x * this.tileSize;
    segment.y = y * this.tileSize;

    this.segments.push(segment);
    this.gameContainer.addChild(segment);
  }

  move() {
    for (let i = this.segments.length - 1; i > 0; i--) {
      this.segments[i].x = this.segments[i - 1].x;
      this.segments[i].y = this.segments[i - 1].y;
    }

    // Переміщення голови змійки у поточному напрямку
    this.segments[0].x += this.direction.x * this.tileSize;
    this.segments[0].y += this.direction.y * this.tileSize;
  }

  setDirection(x, y) {
    // Забороняємо зміну напряму на протилежний
    if (x !== -this.direction.x || y !== -this.direction.y) {
      this.direction = { x, y };
    }
  }

  getHeadPosition() {
    return {
      x: this.segments[0].x / this.tileSize,
      y: this.segments[0].y / this.tileSize,
    };
  }

  grow() {
    const lastSegment = this.segments[this.segments.length - 1];
    const newSegment = new PIXI.Graphics();
    newSegment.beginFill(0x00ff00);
    newSegment.drawRect(0, 0, this.tileSize, this.tileSize);
    newSegment.endFill();

    newSegment.x = lastSegment.x;
    newSegment.y = lastSegment.y;

    this.segments.push(newSegment);
    this.gameContainer.addChild(newSegment);
  }

  checkCollision() {
    const head = this.getHeadPosition();

    // Перевірка на зіткнення голови змійки з її тілом
    for (let i = 1; i < this.segments.length; i++) {
      const segment = this.segments[i];
      if (
        head.x === segment.x / this.tileSize &&
        head.y === segment.y / this.tileSize
      ) {
        return true;
      }
    }

    return false;
  }

  reset() {
    this.segments.forEach((segment) => {
      this.gameContainer.removeChild(segment);
    });
    this.segments = [];

    for (let i = 0; i < 5; i++) {
      this.addSegment(10 - i, 10);
    }

    this.setDirection(1, 0);
    this.setVisible(false);
  }

  setVisible(visible) {
    this.segments.forEach((segment) => {
      segment.visible = visible;
    });
  }

  setPosition(x, y) {
    this.segments[0].x = x * this.tileSize;
    this.segments[0].y = y * this.tileSize;
  }
}
