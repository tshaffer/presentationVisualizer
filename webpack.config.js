module.exports = {

  entry: './src/index.js',
  output: {
    publicPath: './build/',
    path: './build',
    filename: 'bundle.js'
  },
  devtool: "source-map",
  watchOptions: {
    poll: true
  },
  target: 'electron',
  module: {
    preLoaders: [
      {
        test: /\.jsx$|\.js$/,
        loader: 'eslint-loader',
        include: __dirname + '/src',
        exclude: /build\.js$/
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          'babel?presets[]=react,presets[]=es2015,presets[]=stage-1'
        ]
      },
      {
        test: /\.json?$/,
        loader: 'json'
      },
    ]
  }
}