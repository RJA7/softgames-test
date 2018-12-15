import Signal from 'signals';
import config from '../config';

export default class Scene extends PIXI.Container {
  constructor() {
    super();

    const headerText = new PIXI.Text('', new PIXI.TextStyle({
      fontFamily: config.font.main,
      fontSize: 60,
      fontWeight: 'bold',
      fill: '#ffffff',
      strokeThickness: 7,
      stroke: '#000000',
    }));
    headerText.anchor.set(0.5);
    this.addChild(headerText);

    const closeButton = new PIXI.Sprite(PIXI.Texture.fromFrame('close.png'));
    closeButton.anchor.set(0.5);
    closeButton.interactive = true;
    closeButton.buttonMode = true;
    closeButton.on('pointerdown', () => this.handleCloseClick());
    this.addChild(closeButton);

    this.headerText = headerText;
    this.closeButton = closeButton;
    this.onCloseClick = new Signal();

    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const { headerText, closeButton } = this;

    headerText.x = app.screen.width * 0.5;
    headerText.y = 50;

    closeButton.x = app.screen.width - 50;
    closeButton.y = 50;
  }

  handleCloseClick() {
    this.onCloseClick.dispatch();
  }
}
