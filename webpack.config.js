const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./utils/parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const common = {
  // Entry accepts a path or an object of entries.
  // We'll be using the latter form given it's
  // convenient with more complex configurations.
  entry: {
    app: PATHS.app,
    vendor: ['react']
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo'
    })
  ]
};

var config;

// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,   
      {
        // production usage friendly sourcemaps:
        // =====================================
        // Sourcemap type	        Quality	            Notes
        // cheap-source-map	        Transformed code	Generated sourcemaps don't have column mappings. Sourcemaps from loaders are not used.
        //                          (lines only)
        // cheap-module-source-map	Original source     Same except sourcemaps from loaders are simplified to a single mapping per line.
        //                          (lines only)
        // source-map	            Original source	    The best quality with the most complete result, but also the slowest.
        devtool: 'source-map'
      },
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.minify(),
      parts.setupCSS(PATHS.app)
    );
    break;
  default:
    config = merge(
      common,
      {
        // dev friendly sourcemaps:
        // ========================
        // Sourcemap type                 Quality             Notes
        // eval	                        Generated code	    Each module is executed with eval and //@ sourceURL.
        // cheap-eval-source-map	        Transformed code	Each module is executed with eval and a sourcemap is added as a dataurl to the eval.
        //                                (lines only)
        // cheap-module-eval-source-map	Original source	    Same idea, but higher quality with lower performance.
        //                                (lines only)
        // eval-source-map        	    Original source	    Same idea, but highest quality and lowest performance.
        devtool: 'eval-source-map'
      },
      parts.setupCSS(PATHS.app),
      parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

module.exports = validate(config);
