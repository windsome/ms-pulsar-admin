import path from 'path'
import webpack from 'webpack'
import _debug from 'debug'
const debug = _debug('app:webpack:config')
var nodeExternals = require('webpack-node-externals');

const path_base = path.resolve(__dirname, '..');
const resolve = path.resolve;
const base = (...args) => Reflect.apply(resolve, null, [path_base, ...args]);
const paths = {
  base,
  server: base.bind(null, 'src'),
  sdist: base.bind(null, 'sdist')
}

debug('Create configuration.', paths.server());

const webpackConfig = {
  name: 'server',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  devtool: 'source-map',
  resolve: {
    //root: paths.server(),
    extensions: ['.js', '.jsx']
  },
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  module: {}
}

// ------------------------------------
// Entry Points
// ------------------------------------
webpackConfig.entry = {
  server: [
    paths.server('index.js')
  ]
}

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
//  filename: `[name].[${config.compiler_hash_type}].js`,
  filename: "index.js",
  path: paths.sdist(),
  //publicPath: config.compiler_public_path
}
debug('windsome:filename='+webpackConfig.output.filename+",path="+webpackConfig.output.path+",publicPath="+webpackConfig.output.publicPath);

// ------------------------------------
// Plugins
// ------------------------------------
const envs = {
  NODE_PATH:"src/;common/"
}
webpackConfig.plugins = [
  new webpack.DefinePlugin(envs),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      unused: true,
      dead_code: true,
      warnings: false
    }
  })
]


// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.loaders = [{
  test: /\.(js|jsx)$/,
  exclude: [/node_modules/, 'src'],
  //include: [paths.server()],
  loader: 'babel-loader',
  query: {
    cacheDirectory: true,
    plugins: ['transform-decorators-legacy', 'transform-runtime'],
    presets: ['es2015', 'stage-0']
  }
},
{
  test: /\.json$/,
  //exclude: ['package.json'],
  //include: [paths.server()],
  loader: 'json-loader'
}]


export default webpackConfig
