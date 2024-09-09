import * as PIXI from 'pixi.js';
import { GameMode } from './GameMode';

export class GUI {
  private app: PIXI.Application;
  private bestScoreLabel: PIXI.Text = null!;
  private currentScoreLabel: PIXI.Text = null!;
  private menuButton: PIXI.Container = null!;
  private playButton: PIXI.Container = null!;
  private exitButton: PIXI.Container = null!;
  private modeSelectors: PIXI.Graphics[] = [];
  private selectedMode: GameMode = GameMode.Classic;
  private modesContainer: PIXI.Container = null!;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.createGUI();
  }

  private createGUI() {
    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: '#ffffff',
    });


    this.bestScoreLabel = new PIXI.Text('Best Score: 0', style);
    this.bestScoreLabel.position.set(20, 520);
    this.app.stage.addChild(this.bestScoreLabel);

    this.currentScoreLabel = new PIXI.Text('Current Score: 0', style);
    this.currentScoreLabel.position.set(20, 560);
    this.app.stage.addChild(this.currentScoreLabel);

    this.modesContainer = new PIXI.Container();
    this.app.stage.addChild(this.modesContainer);

    this.menuButton = this.createButton('Menu', 700, 520, style);
    this.playButton = this.createButton('Play', 700, 520, style);
    this.exitButton = this.createButton('Exit', 700, 560, style);

    this.app.stage.addChild(this.menuButton);
    this.app.stage.addChild(this.playButton);
    this.app.stage.addChild(this.exitButton);


    this.createModeSelector();


    this.playButton.visible = true;
    this.exitButton.visible = true;
    this.menuButton.visible = false;


    this.playButton.on('pointerdown', () => this.startGame());
    this.menuButton.on('pointerdown', () => this.showMenu());
    this.exitButton.on('pointerdown', () => this.exitGame());
  }

  private createButton(text: string, x: number, y: number, style: PIXI.TextStyle): PIXI.Container {
    const container = new PIXI.Container();

    const background = new PIXI.Graphics();
    background.beginFill(0x000000);
    background.drawRect(0, 0, 100, 40);
    background.endFill();

    const textObject = new PIXI.Text(text, style);
    textObject.position.set(10, 5);

    container.position.set(x, y);
    container.addChild(background);
    container.addChild(textObject);

    container.eventMode = 'static'; 
    return container;
  }

  private createModeSelector() {
    const style = new PIXI.TextStyle({ fontFamily: 'Arial', fontSize: 24, fill: 'white' });
    const modes = ['Classic', 'No Die', 'Walls', 'Portal', 'Speed'];
    let yOffset = 150;

    modes.forEach((mode, index) => {
      let modeText = new PIXI.Text(mode, style);
      modeText.position.set(700, yOffset);
      this.modesContainer.addChild(modeText);

      let selector = new PIXI.Graphics();
      selector.beginFill(index === 0 ? 0x0000FF : 0xFFFFFF);
      selector.drawCircle(0, 0, 10);
      selector.endFill();
      selector.position.set(680, yOffset + 10);
      selector.eventMode = 'static';
      selector.on('pointerdown', () => this.selectMode(index));
      this.modesContainer.addChild(selector);
      this.modeSelectors.push(selector);

      yOffset += 30;
    });
  }

  private selectMode(index: number) {
    this.selectedMode = index as GameMode;
    this.modeSelectors.forEach((selector, idx) => {
      selector.clear();
      selector.beginFill(idx === index ? 0x0000FF : 0xFFFFFF);
      selector.drawCircle(0, 0, 10);
      selector.endFill();
    });
  }

  private startGame() {
    console.log("Game starting with mode:", this.selectedMode);
    this.modesContainer.visible = false;  
    this.playButton.visible = false;    
    this.exitButton.visible = false;     
    this.menuButton.visible = true;      
    this.app.stage.emit('game-start', this.selectedMode);  
  }

  public showMenu() {
    this.modesContainer.visible = true;  
    this.playButton.visible = true;       
    this.exitButton.visible = true;     
    this.menuButton.visible = false;    
  
 
    this.app.stage.emit('game-reset');
  }
  

  private exitGame() {
    console.log("Exiting game...");
    window.close(); 
  }

  public updateCurrentScore(score: number) {
    this.currentScoreLabel.text = `Current Score: ${score}`;
  }

  public getSelectedMode(): GameMode {
    return this.selectedMode;
  }
}
