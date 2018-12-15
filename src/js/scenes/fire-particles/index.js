import Slider from './objects/slider';
import Signal from 'signals';
import Scene from '../scene';

export default class FireParticlesScene extends Scene {
  constructor() {
    super();

    const overlay = new PIXI.Graphics();
    this.addChildAt(overlay, 0);

    const emitterOwner = new PIXI.Container();
    this.addChild(emitterOwner);

    const emitter = new PIXI.particles.Emitter(
      emitterOwner,
      new Array(3).fill(0).map((v, i) => `fire/${i}.png`),

      {
        alpha: {
          list: [
            { value: 0.5, time: 0 },
            { value: 0, time: 1 },
          ],
          isStepped: false,
        },
        scale: {
          list: [
            { value: 2, time: 0 },
            { value: 40, time: 1 },
          ],
          isStepped: false,
        },
        speed: {
          list: [
            { value: 3000, time: 0 },
            { value: 3400, time: 1 },
          ],
          isStepped: false,
        },
        startRotation: { min: 265, max: 275 },
        rotationSpeed: { min: 0, max: 0 },
        lifetime: { min: 0.04, max: 0.05 },
        frequency: 0.005,
        spawnChance: 1,
        particlesPerWave: 1,
        emitterLifetime: Infinity,
        maxParticles: 10,
        addAtBack: false,
        spawnType: 'circle',
        spawnCircle: { x: 0, y: 0, r: 30 },
        pos: { x: 0, y: 0 },
      },
    );

    emitter.particleBlendMode = PIXI.BLEND_MODES.ADD;

    const slider = new Slider();
    this.addChild(slider);

    app.ticker.add(this.onUpdate, this);

    this.slider = slider;
    this.headerText.text = 'Fire Particles';
    this.onCloseClick = new Signal();
    this.emitterOwner = emitterOwner;
    this.emitter = emitter;
    this.overlay = overlay;

    emitter.emit = true;
    slider.onChange.add(this.handleSliderChange, this);
    app.ticker.add(this.onUpdate, this);

    this.onResize();
    slider.set(0);
  }

  onResize() {
    super.onResize();

    const { emitterOwner, slider, overlay } = this;

    emitterOwner.x = app.screen.width * 0.5;
    emitterOwner.y = app.screen.height * 0.5 + 240;

    slider.x = app.screen.width * 0.5;
    slider.y = app.screen.height - 50;

    overlay.clear();
    overlay.beginFill(0x000000, 1);
    overlay.drawRect(0, 0, app.screen.width, app.screen.height);
  }

  handleSliderChange(percent) {
    const { emitter, slider } = this;
    emitter.maxParticles = slider.minValue + Math.floor((slider.maxValue - slider.minValue + 1) * percent);
    emitter.frequency = 0.05 / emitter.maxParticles;

    emitter.startSpeed.value = 3000 + percent * 8000;
    emitter.startSpeed.next.value = emitter.startSpeed.value * 1.1;

    slider.countText.text = `Count: ${emitter.maxParticles}`;
    slider.freqText.text = `Freq: ${(emitter.frequency * 1000).toFixed(2)}ms`;

    this.overlay.alpha = 0.2 + 0.4 * percent;
  }

  onUpdate(dt) {
    this.emitter.update(dt * 0.001);
  }
}
