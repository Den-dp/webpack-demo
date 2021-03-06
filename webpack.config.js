const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const merge = require('webpack-merge');
const validate = require('webpack-validator');
const pkg = require('./package.json');

const parts = require('./utils/parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  style: [
    path.join(__dirname, 'node_modules', 'purecss'),
    path.join(__dirname, 'app', 'main.css')
  ],
  build: path.join(__dirname, 'build')
};

const common = {
  // Entry accepts a path or an object of entries.
  // We'll be using the latter form given it's
  // convenient with more complex configurations.
  entry: {
    style: PATHS.style,
    app: PATHS.app,
    // vendor: Object.keys(pkg.dependencies)
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
        devtool: 'source-map',
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          // This is used for require.ensure. The setup
          // will work without but this is useful to set.
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.clean(PATHS.build),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react']
      }),
      parts.minify(),
      parts.extractCSS(PATHS.style),
      parts.purifyCSS([PATHS.app])
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
      parts.setupCSS(PATHS.style),
      parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

// Run validator in quiet mode to avoid output in stats
module.exports = validate(config, {
  quiet: true
});
