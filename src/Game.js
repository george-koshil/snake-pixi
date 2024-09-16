import * as PIXI from 'pixi.js';
import { Snake } from './entities/Snake';
import { Food } from './entities/Food';
import { GUI } from './GUI';
import { GameMode } from './GameMode';

export class Game {
   app;
   gui;
   gameContainer;
   tileSize = 20;
   fieldSize = 20;
   snake;
   food;
   score = 0;
   moveCounter = 0;
   moveInterval = 40;
   walls = [];
   secondFood= null;
   mode;
   fieldBackground;

  constructor(mode) {
    this.mode = mode;
    this.app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb,
    });

    document.body.appendChild(this.app.view);

    this.gameContainer = new PIXI.Container();
    this.app.stage.addChild(this.gameContainer);

    this.gui = new GUI(this.app);

    this.snake = new Snake(this.gameContainer, this.tileSize);
    this.food = new Food(this.gameContainer, this.tileSize, this.fieldSize);

    this.snake.setVisible(false);
    this.food.setVisible(false);

    if (this.mode === GameMode.Portal) {
      this.secondFood = new Food(this.gameContainer, this.tileSize, this.fieldSize);
    }

    this.setupControls();
    this.createFieldBackground();
    this.setupGUIEvents();
    this.start();
  }

   setupGUIEvents() {
    this.app.stage.on('game-start', (mode) => {
      this.startGame(mode);
    });

    this.app.stage.on('game-reset', () => {
      this.resetGame();
    });
  }

   createBoundaryWalls() {
    for (let x = 0; x < this.fieldSize; x++) {
      this.addWall(x, 0);
      this.addWall(x, this.fieldSize - 1);
    }

    for (let y = 0; y < this.fieldSize; y++) {
      this.addWall(0, y);
      this.addWall(this.fieldSize - 1, y);
    }
  }

   createFieldBackground() {
    const fieldColor = 0x006600;
    this.fieldBackground = new PIXI.Graphics();
    this.fieldBackground.beginFill(fieldColor);
    this.fieldBackground.drawRect(this.tileSize, this.tileSize, (this.fieldSize - 2) * this.tileSize, (this.fieldSize - 2) * this.tileSize);
    this.fieldBackground.endFill();
    this.gameContainer.addChildAt(this.fieldBackground, 0);
  }

   startGame(mode) {
    this.mode = mode;
    this.snake.reset();
    this.food.spawn();

    if (this.mode === GameMode.Portal) {
      if (!this.secondFood) {
        this.secondFood = new Food(this.gameContainer, this.tileSize, this.fieldSize);
      }
      this.secondFood.spawn();
      this.secondFood.setVisible(true);
    }

    this.createBoundaryWalls();
    this.snake.setVisible(true);
    this.food.setVisible(true);
    this.app.ticker.start();
  }

   setupControls() {
    window.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowUp':
          this.snake.setDirection(0, -1);
          break;
        case 'ArrowDown':
          this.snake.setDirection(0, 1);
          break;
        case 'ArrowLeft':
          this.snake.setDirection(-1, 0);
          break;
        case 'ArrowRight':
          this.snake.setDirection(1, 0);
          break;
      }
    });
  }

   checkCollisions() {
    const snakeHead = this.snake.getHeadPosition();

    if (this.mode !== GameMode.NoDie) {
      for (const wall of this.walls) {
        if (wall.x / this.tileSize === snakeHead.x && wall.y / this.tileSize === snakeHead.y) {
          this.endGame();
          return;
        }
      }
    }

    if (this.mode === GameMode.Classic || this.mode === GameMode.Speed) {
      this.classicModeCollisions(snakeHead);
    }

    if (this.mode === GameMode.NoDie) {
      this.noDieModeCollisions(snakeHead);
    }

    if (this.mode === GameMode.Walls) {
      this.wallsModeCollisions(snakeHead);
    }

    if (this.mode === GameMode.Portal) {
      this.portalModeCollisions(snakeHead);
    }

    if (this.snake.checkCollision() && this.mode !== GameMode.NoDie) {
      this.endGame();
    }
  }

   classicModeCollisions(snakeHead) {
    const foodPosition = this.food.getPosition();
    if (snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y) {
      this.snake.grow();
      this.food.spawn();
      this.score += 10;
      this.updateScore();
    }
  }

   noDieModeCollisions(snakeHead) {
    const foodPosition = this.food.getPosition();
    if (snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y) {
      this.snake.grow();
      this.food.spawn();
      this.score += 10;
      this.updateScore();
    }

    if (snakeHead.x < 0) {
      this.snake.setPosition(this.fieldSize - 1, snakeHead.y);
    }
    if (snakeHead.y < 0) {
      this.snake.setPosition(snakeHead.x, this.fieldSize - 1);
    }
    if (snakeHead.x >= this.fieldSize) {
      this.snake.setPosition(0, snakeHead.y);
    }
    if (snakeHead.y >= this.fieldSize) {
      this.snake.setPosition(snakeHead.x, 0);
    }
  }

   wallsModeCollisions(snakeHead) {
    const foodPosition = this.food.getPosition();
    if (snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y) {
      this.snake.grow();
      this.food.spawn();
      this.score += 10;
      this.updateScore();

      const x = Math.floor(Math.random() * this.fieldSize);
      const y = Math.floor(Math.random() * this.fieldSize);

      this.addWall(x, y);
    }

    for (const wall of this.walls) {
      if (wall.x / this.tileSize === snakeHead.x && wall.y / this.tileSize === snakeHead.y) {
        this.endGame();
      }
    }
  }

   addWall(x, y) {
    const wall = new PIXI.Graphics();
    wall.beginFill(0x808080);
    wall.drawRect(0, 0, this.tileSize, this.tileSize);
    wall.endFill();
    wall.x = x * this.tileSize;
    wall.y = y * this.tileSize;
    this.walls.push(wall);
    this.gameContainer.addChild(wall);
  }

   portalModeCollisions(snakeHead) {
    const foodPosition = this.food.getPosition();
    const secondFoodPosition = this.secondFood?.getPosition();

    if (secondFoodPosition === undefined) return;

    if (snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y) {
      this.snake.setPosition(secondFoodPosition.x, secondFoodPosition.y);
      this.snake.grow();
      this.food.spawn();
      this.secondFood?.spawn();
      this.score += 10;
      this.updateScore();
    }

    if (snakeHead.x === secondFoodPosition.x && snakeHead.y === secondFoodPosition.y) {
      this.snake.setPosition(foodPosition.x, foodPosition.y);
      this.snake.grow();
      this.food.spawn();
      this.secondFood?.spawn();
      this.score += 10;
      this.updateScore();
    }
  }

   updateScore() {
    this.gui.updateCurrentScore(this.score);

    if (this.mode === GameMode.Speed) {
      this.moveInterval = Math.max(1, this.moveInterval - 1);
    }
  }

   resetGame() {
    this.snake.reset();
    for (const wall of this.walls) {
      if (this.gameContainer.children.includes(wall)) {
        this.gameContainer.removeChild(wall);
      }
    }
    this.walls.length = 0;
    this.food.setVisible(false);
    if (this.secondFood) this.secondFood.setVisible(false);
    this.score = 0;
    this.gui.updateCurrentScore(this.score);
    this.app.ticker.start();
  }

   endGame() {
    this.app.ticker.stop();
  }

   start() {
    this.app.ticker.add(() => {
      this.moveCounter++;
      if (this.moveCounter >= this.moveInterval) {
        this.snake.move();
        this.checkCollisions();
        this.moveCounter = 0;
      }
    });
  }
}
