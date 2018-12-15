import TWEEN from '@tweenjs/tween.js';
import resources from './resources';
import * as PIXI from 'pixi.js';
import Game from './game';
import 'pixi-particles';
import 'pixi-timeout';

class App extends PIXI.Application {
  constructor() {
    super();

    document.body.appendChild(this.view);
    window.addEventListener('resize', () => this.onResize());

    this.onResize();
    this.preload();
  }

  preload() {
    Object.keys(resources).forEach(key => PIXI.loader.add(key, resources[key]));
    PIXI.loader.load(() => this.onLoad());
  }

  onLoad() {
    this.ticker.add(this.onUpdate, this);

    const game = new Game(this);
    app.stage.addChild(game);
  }

  onResize() {
    window.LP = window.innerWidth > window.innerHeight ? a => a : (a, b) => b;

    const mw = LP(window.innerWidth * 640 / window.innerHeight, window.innerWidth * 960 / window.innerHeight);
    const mh = LP(window.innerHeight * 960 / window.innerWidth, window.innerHeight * 640 / window.innerWidth);
    const scale = Math.max(mw / window.innerWidth, mh / window.innerHeight);
    // const dpr = screen.systemXDPI / screen.logicalXDPI || window.devicePixelRatio || 1;

    this.renderer.resize(Math.ceil(window.innerWidth * scale), Math.ceil(window.innerHeight * scale));
    this.view.style.width = `${window.innerWidth}px`;
    this.view.style.height = `${window.innerHeight}px`;
  }

  onUpdate(dt) {
    TWEEN.update(this.ticker.lastTime);
  }

}

const app = new App();

window.TWEEN = TWEEN;
window.app = app;
