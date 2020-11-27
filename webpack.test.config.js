const webpack = require('webpack')
var path = require("path")
var BundleTracker = require('webpack-bundle-tracker')

var ip = 'localhost'

module.exports = {
  entry: {
    SpritePacker: './reactjs/SpritePacker',
    vendors: ['react'],
  },

  output: {
    path: path.resolve('./main/static/bundles/local/'),
    filename: '[name]-[hash].js',
    publicPath: '/static/bundles/local/'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: [
            'react',
            'stage-0'
          ],
        },
        exclude: ['/node_modules'],
      },
      {
        test: /\.css$/, // .css 파일인 경우
        use: ['style-loader', 'css-loader']
      }
    ],
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: 'vendors.js' }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new BundleTracker({filename: './webpack-stats-local.json'}),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'BASE_API_URL': JSON.stringify('https://'+ ip +':8000/api/v1/'),
    }}),
  ],

  resolve: {
    modules: ['node_modules', 'bower_components'],
    extensions: ['.js', '.json', '.jsx'],
  },
}
