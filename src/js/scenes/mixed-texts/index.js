import Signal from 'signals';
import MixedText from './objects/mixed-text';
import Scene from '../scene';

export default class MixedTexts extends Scene {
  constructor() {
    super();

    const mixedText = new MixedText('asd $image(button.png) 32w\nasd $image(button.png) 32w');
    mixedText.anchor.set(0.5);
    mixedText.imageOffset.x = 4;
    mixedText.imageOffset.y = 4;
    this.addChild(mixedText);

    mixedText.style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      // wordWrap: true, // TODO Not implemented for mixed text
      // wordWrapWidth: 440
    });

    const infoText = new PIXI.Text('', new PIXI.TextStyle({
      fontSize: 36,
      fontWeight: 'bold',
      fill: '#ffffff',
      strokeThickness: 7,
      stroke: '#000000',
    }));
    infoText.anchor.set(0.5);
    this.addChild(infoText);

    this.randomWords = `Lorem ipsum 
dolor sit 
amet, consectetur 
adipiscing elit. 
Vestibulum ut 
accumsan lacus.`.split(' ');

    const parts = [this.getRandomText, this.getRandomEmoji];
    const counter = [0, 0, 0, 0];
    const templates = [];

    while (true) {
      const template = [];
      templates.push(template);

      for (let i = 0, l = counter.length; i < l; i++) {
        template[i] = parts[counter[i]];
      }

      if (!this.iterateCounter(counter, parts.length)) break;
    }

    this.headerText.text = 'Mixed Texts';
    this.mixedText = mixedText;
    this.templates = templates.slice(1, -1).sort(() => Math.random() - 0.5); // not important shuffle
    this.infoText = infoText;
    this.templateIndex = 0;
    this.refresh = this.refresh.bind(this);

    this.refresh();
    this.onResize();
  }

  onResize() {
    super.onResize();

    const { mixedText, infoText } = this;

    mixedText.x = app.screen.width * 0.5;
    mixedText.y = app.screen.height * 0.5 + 120;

    infoText.x = app.screen.width * 0.5;
    infoText.y = app.screen.height * 0.5 - 80;
  }

  iterateCounter(counter, limit) {
    let counterReelIndex = counter.length - 1;

    while (true) {
      counter[counterReelIndex]++;

      if (counter[counterReelIndex] < limit) {
        return true;
      }

      if (counterReelIndex === 0) {
        return false;
      }

      counter[counterReelIndex] = 0;
      counterReelIndex--;
    }
  }

  getRandomText() {
    const { randomWords } = this;
    const i = Math.floor(Math.random() * (randomWords.length - 2));

    return randomWords.slice(i, i + 2).join(' ');
  }

  getRandomEmoji() {
    return ` $IMAGE(emoji/emoji (${1 + Math.floor(Math.random() * 50)}).png)END$ `;
  }

  refresh() {
    PIXI.setTimeout(2, this.refresh);

    const { templates, mixedText, infoText } = this;

    const template = templates[this.templateIndex++ % templates.length];
    let text = '';

    for (let i = 0, l = template.length; i < l; i++) {
      text += template[i].call(this);
    }

    mixedText.text = text;
    mixedText.style.fontSize = 24 + Math.floor(Math.random() * 12);
    mixedText.style.align = ['left', 'center', 'right'][Math.floor(Math.random() * 3)];

    infoText.text = `Font size: ${mixedText.style.fontSize}
Align: ${mixedText.style.align}`;
  }
}
