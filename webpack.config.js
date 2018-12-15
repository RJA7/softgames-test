const path = require('path');

const config = {
  context: path.resolve(__dirname, 'src', 'js'),

  entry: {
    main: ['./main.js'],
  },

  output: {
    path      : path.resolve(__dirname, 'www'),
    filename  : '[name].js',
  },

  mode: 'development',
};

module.exports = config;
