var path = require("path")
var webpack = require('webpack')

module.exports = {
  context: __dirname,

  entry: {
    Home: './reactjs/R_Home/HomeApp',
    SpritePacker: './reactjs/R_SpritePacker/SPApp',
    SpriteBakingStudio: './reactjs/R_SpriteBakingStudio/SBSApp',
    vendors: ['react'],
  },

  output: {
    path: path.resolve('./main/static/bundles/local/'),
    filename: '[name]-[hash].js'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000000,
              mimetype: 'image/png',
              fallback: 'responsive-loader'
            }
          }
        ]
      }
    ],
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: 'vendors.js' }),
  ],

  resolve: {
    modules: ['node_modules', 'bower_components'],
    extensions: ['.js', '.json', '.jsx'],
  }
}
