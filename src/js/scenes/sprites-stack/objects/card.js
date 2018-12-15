export default class Card extends PIXI.Container {
  constructor(def) {
    super();

    const back = new PIXI.Sprite(new PIXI.Texture.fromFrame('cards/back@2x.png'));
    back.anchor.set(0.5);
    back.scale.set(0.7);
    this.addChild(back);

    const frame = `cards/${def.rank}_of_${def.suit}.png`;

    const view = new PIXI.Sprite(new PIXI.Texture.fromFrame(frame));
    view.anchor.set(0.5);
    this.addChild(view);
  }
}

Card.rank = {
  r_2: 2,
  r_3: 3,
  r_4: 4,
  r_5: 5,
  r_6: 6,
  r_7: 7,
  r_8: 8,
  r_9: 9,
  r_10: 10,
  j: 'jack',
  q: 'queen',
  k: 'king',
  a: 'ace',
};

Card.suit = {
  spades: 'spades',
  diamonds: 'diamonds',
  hearts: 'hearts',
  clubs: 'clubs',
};
