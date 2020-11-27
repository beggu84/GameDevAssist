var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

var ip = 'localhost'
var config = require('./webpack.base.config.js')

config.devtool = "#eval-source-map"

config.entry = {
  Home: [
    'webpack-dev-server/client?http://' + ip + ':3000',
    './reactjs/R_Home/HomeApp',
  ],
  SpritePacker: [
    'webpack-dev-server/client?http://' + ip + ':3000',
    './reactjs/R_SpritePacker/SPApp',
  ],
  SpriteBakingStudio: [
    'webpack-dev-server/client?http://' + ip + ':3000',
    './reactjs/R_SpriteBakingStudio/SBSApp',
  ]
}

config.output.publicPath = 'http://' + ip + ':3000' + '/assets/bundles/'

//config.output.crossOriginLoading = 'anonymous'

config.plugins = config.plugins.concat([
  new webpack.NoEmitOnErrorsPlugin(),
  new BundleTracker({filename: './webpack-stats-local.json'}),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('development'),
      'BASE_API_URL': JSON.stringify('https://'+ ip +':8000/api/v1/'),
  }})
])

config.module.rules.push(
  {
    test: /\.jsx?$/,
    use: ['babel-loader'],
    exclude: ['/node_modules'],
  }
)

module.exports = config
