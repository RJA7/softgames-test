import Card from './objects/card';
import Scene from '../scene';
import config from '../../config';

export default class SpritesStack extends Scene {
  constructor() {
    super();

    const cardsGroup = new PIXI.Container();
    this.addChild(cardsGroup);

    const cards = [];
    const cardDefs = [];

    for (let rankKey in Card.rank) {
      if (!Card.rank.hasOwnProperty(rankKey)) continue;

      for (let suitKey in Card.suit) {
        if (!Card.suit.hasOwnProperty(suitKey)) continue;

        cardDefs.push({
          rank: Card.rank[rankKey],
          suit: Card.suit[suitKey],
        })
      }
    }

    for (let i = 0, l = 144; i < l; i++) {
      const def = cardDefs[i % cardDefs.length];
      const card = new Card(def);
      card.x = -200;
      card.y = (i - l * 0.5 + 0.5) * 2 + 40;
      cards.push(card);
      cardsGroup.addChild(card);
    }

    const fpsText = new PIXI.Text('', new PIXI.TextStyle({
      fontSize: 60,
      fontFamily: config.font.main,
      fill: '#ffffff',
      fontWeight: 'bold',
    }));
    fpsText.x = 10;
    fpsText.y = 15;
    this.addChild(fpsText);

    this.headerText.text = 'Sprites Stack';
    this.cardsGroup = cardsGroup;
    this.fpsText = fpsText;
    this.cards = cards;
    this.updateFPS = this.updateFPS.bind(this);

    this.updateFPS();
    this.onResize();
    this.moveCards();
  }

  onResize() {
    super.onResize();

    this.cardsGroup.x = app.screen.width * 0.5;
    this.cardsGroup.y = app.screen.height * 0.5;
  }

  moveCards() {
    const { cards } = this;

    for (let i = 0, l = cards.length; i < l; i++) {
      const card = cards[l - 1 - i];

      new TWEEN.Tween(card)
        .to({ x: 200 }, 2000)
        .delay(i * 1000)
        .start();

      PIXI.setTimeout(1 + i, () => this.cardsGroup.addChild(card));
    }
  }

  updateFPS() {
    PIXI.setTimeout(1, this.updateFPS);
    this.fpsText.text = app.ticker.FPS.toFixed(0);
  }
}
