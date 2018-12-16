## SoftGames test

### Instructions for devs

```
$ npm i
$ npm start
```

The development server will run on http://localhost:3000

### How to build

```
$ npm run build
```

### Description
<pre>
This project contains 3 solved tasks and menu screen.

All the screens are fully responsive to resize or orientation change.

1. Sprites Stack
There is stack of 144 cards. Every second one card goes to another stack.

2. Mixed Texts
The module extends and preserves all PIXI Text properties.
Adds ability to draw images directly in text field.
It uses the same canvas as the text object, to draw images into it.
And doesn't create sprite for images. Canvas context is used to draw
the textures, which also are cached.

3. Fire Particles
Particles demo that shows fire effect, using 10 sprites by default.
You can increase the amount of sprites by slider at the bottom.
</pre>
