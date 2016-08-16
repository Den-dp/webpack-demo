const webpack = require('webpack');

exports.setupCSS = function(paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css?sourceMap'],
          // If include isn't set, Webpack will traverse all files within the base directory.
          // This can hurt performance! It is a good idea to set up include always.
          // There's also exclude option that may come in handy. Prefer include, however.
          include: paths
        }
      ]
    }
  };
}

exports.minify = function() {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        // Don't beautify output (enable for neater output)
        beautify: false,

        // Eliminate comments
        comments: false,
        compress: {
          // Uglify warnings can help you to understand how it processes the code.
          // Therefore it may be beneficial to have a peek at the full output every once in a while.
          warnings: false,
          // Drop `console` statements
          drop_console: true
        },
        // Mangling specific options
        mangle: {
          // Don't mangle $
          except: ['$', 'webpackJsonp'],

          // Don't care about IE8
          screw_ie8 : true,

          // Don't mangle function names
          // keep_fnames: true
        }
      })
    ]
  };
}

exports.devServer = function(options) {
  return {
/*
    // The setup may be problematic on certain versions of Windows, Ubuntu, and Vagrant. We can solve this through polling
    // There are more details in webpack-dev-server issue https://github.com/webpack/webpack-dev-server/issues/155
    watchOptions: {
      // Delay the rebuild after the first change
      aggregateTimeout: 300,
      // Poll using interval (in ms, accepts boolean too)
      poll: 1000
    },
*/
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host, // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  };
}
