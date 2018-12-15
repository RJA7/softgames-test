import SpritesStackScene from '../../scenes/sprites-stack';
import MixedTextsScene from '../../scenes/mixed-texts';
import FireParticlesScene from '../../scenes/fire-particles';
import config from '../../config';
import Signal from 'signals';
import Scene from '../scene';

export default class Menu extends Scene {
  constructor() {
    super();

    const buttons = [
      { label: 'Sprites Stack', Scene: SpritesStackScene },
      { label: 'Mixed Texts', Scene: MixedTextsScene },
      { label: 'Fire Particles', Scene: FireParticlesScene },
    ].map(({ label, Scene }) => {
      const button = new PIXI.Sprite(PIXI.Texture.fromFrame('button.png'));
      button.anchor.set(0.5);
      this.addChild(button);

      button.interactive = true;
      button.buttonMode = true;
      button.on('pointerdown', () => this.handleButtonClick(button, Scene));

      const labelText = new PIXI.Text(label, new PIXI.TextStyle({
        fontFamily: config.font.main,
        fontSize: 48,
        fontWeight: 'bold',
        fill: '#ffffff',
        strokeThickness: 5,
        stroke: '#000000',
      }));
      labelText.anchor.set(0.5);
      button.addChild(labelText);

      return button;
    });

    this.headerText.text = 'Menu';
    this.closeButton.visible = false;
    this.onButtonClick = new Signal();
    this.buttons = buttons;

    this.onResize();
  }

  onResize() {
    super.onResize();

    const { buttons } = this;
    const offsetY = LP(160, 200);

    for (let i = 0, l = buttons.length; i < l; i++) {
      const button = buttons[i];
      button.x = app.screen.width * 0.5;
      button.y = app.screen.height * 0.5 + 50 + (i - l * 0.5 + 0.5) * offsetY;
    }
  }

  handleButtonClick(button, Scene) {
    // new TWEEN.Tween(button.scale)
    //   .to({ x: 1.2, y: 1.2 }, 100)
    //   .start()
    //   .onComplete(() => {
    this.onButtonClick.dispatch(Scene);
    // });
  }
}
