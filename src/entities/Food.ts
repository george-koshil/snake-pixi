import * as PIXI from 'pixi.js';

export class Food {
    private food: PIXI.Graphics;
    private tileSize: number;
    private fieldSize: number;
    private gameContainer: PIXI.Container;

    constructor(gameContainer: PIXI.Container, tileSize: number, fieldSize: number) {
        this.tileSize = tileSize;
        this.fieldSize = fieldSize;
        this.gameContainer = gameContainer;

        this.food = new PIXI.Graphics();
        this.spawn();
    }

    public spawn() {
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

    public getPosition() {
        return { x: this.food.x / this.tileSize, y: this.food.y / this.tileSize };
    }

    public setVisible(visible: boolean) {
        this.food.visible = visible;
    }
}


