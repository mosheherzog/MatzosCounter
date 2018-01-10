/*
    ./webpack.config.js
*/
const path = require('path');

module.exports = {
  entry: ['./src/index.js', './src/listener.js'],
  output: {
    path: path.resolve('client'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
}
