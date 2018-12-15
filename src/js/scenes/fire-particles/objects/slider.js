import Signal from 'signals';
import config from '../../../config';

export default class Slider extends PIXI.Container {
  constructor() {
    super();

    this.minValue = 10;
    this.maxValue = 30;
    this.color = '#6487bc';

    const back = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.createLineCanvas()));
    back.anchor.set(0.5);
    this.addChild(back);

    const fader = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.createCircleCanvas()));
    fader.anchor.set(0.5);
    fader.interactive = true;
    fader.buttonMode = true;
    fader.on('pointerdown', () => this.onFaderPointerDown());
    fader.on('pointerup', () => this.onFaderPointerUp());
    this.addChild(fader);

    const style = new PIXI.TextStyle({
      fontFamily: config.font.main,
      fill: '#ffffff',
      fontSize: 28,
      strokeThickness: 1,
      fontWeight: 'bold',
      stroke: '#000000',
    });

    const countText = new PIXI.Text(this.maxValue, style);
    countText.anchor.set(0, 0.5);
    countText.x = -back.width * 0.5;
    countText.y = -80;
    this.addChild(countText);

    const freqText = new PIXI.Text(this.maxValue, style);
    freqText.anchor.set(0, 0.5);
    freqText.x = -back.width * 0.5;
    freqText.y = -40;
    this.addChild(freqText);

    app.ticker.add(this.onUpdate, this);

    this.back = back;
    this.fader = fader;
    this.isSliderPointerDown = false;
    this.onChange = new Signal();
    this.minX = back.x - back.width * 0.5;
    this.maxX = back.x + back.width * 0.5;
    this.percent = 1;
    this.countText = countText;
    this.freqText = freqText;
  }

  set(percent) {
    if (this.percent === percent) return;

    this.fader.x = this.back.x + this.back.width * (percent - 0.5);

    this.onChange.dispatch(percent);
  }

  onFaderPointerDown() {
    this.isSliderPointerDown = true;
  }

  onFaderPointerUp() {
    this.isSliderPointerDown = false;
  }

  createLineCanvas() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 10;
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 3, canvas.width, 4);

    return canvas;
  }

  createCircleCanvas() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const r = 20;
    canvas.width = r * 2;
    canvas.height = r * 2;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
  }

  onUpdate() {
    if (this.isSliderPointerDown) {
      const { fader, minX, maxX } = this;
      const pos = fader.parent.toLocal(app.renderer.plugins.interaction.eventData.data.global);
      const percent = Math.max(0, Math.min(1, (pos.x - minX) / (maxX - minX)));

      this.set(percent);
    }
  }
}
