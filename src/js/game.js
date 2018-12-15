import MenuScene from './scenes/menu';
import resources from './resources';

export default class Game extends PIXI.Container {
  constructor() {
    super();

    const bg = new PIXI.Sprite(PIXI.Texture.fromFrame(resources.bg));
    bg.anchor.set(0.5);
    this.addChild(bg);

    this.bg = bg;
    this.scene = null;

    window.addEventListener('resize', () => this.onResize());

    this.showMenuScene();
    this.onResize();
  }

  onResize() {
    const { bg } = this;

    bg.x = app.screen.width * 0.5;
    bg.y = app.screen.height * 0.5;
    bg.scale.set(Math.max(app.screen.width / bg.width, app.screen.height / bg.height) * bg.scale.x);
  }

  showMenuScene() {
    this.scene && this.scene.destroy();
    this.scene = new MenuScene();
    this.scene.onButtonClick.addOnce(this.handleMenuButtonClick, this);
    this.addChild(this.scene);
  }

  handleMenuButtonClick(Scene) {
    this.scene && this.scene.destroy();
    this.scene = new Scene();
    this.scene.onCloseClick.add(this.showMenuScene, this);
    this.addChild(this.scene);
  }
}
