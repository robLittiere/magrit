const webpack = require('webpack');
const exec = require('child_process').exec;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ReplaceHashWebpackPlugin = require('replace-hash-webpack-plugin');
const version = require('./package.json').version;

module.exports = [
  {
    entry: {
      app: './js/main.js',
      vendor: [
        'alertifyjs', 'colorbrewer',
        'i18next', 'i18next-xhr-backend',
        'jschardet', 'loc-i18next', 'proj4',
        'sortablejs', 'tippy.js', 'topojson',
      ],
    },
    output: {
      filename: '[name].[hash:6].js',
      publicPath: 'static/dist/',
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    module: {
      rules: [
        // {
        //   enforce: "pre",
        //   test: /\.js$/,
        //   exclude: /node_modules/,
        //   loader: "eslint-loader",
        // },
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: [
            /node_modules/,
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          terserOptions: {
            ecma: 6,
            compress: false,
            mangle: false,
          },
        }),
      ],
    },
    plugins: [
      new CleanWebpackPlugin(['dist'], {
        watch: true,
      }),
      new webpack.ProvidePlugin({
        Promise: 'bluebird',
      }),
      new ReplaceHashWebpackPlugin({
        cwd: './',
        src: './html/modules.html',
        dest: 'dist',
      }),
      new webpack.DefinePlugin({
        MAGRIT_VERSION: JSON.stringify(version),
      }),
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
            exec('./post_build.sh', (err, stdout, stderr) => {
              if (stdout) process.stdout.write(stdout);
              if (stderr) process.stderr.write(stderr);
            });
          });
        },
      },
    ],
    watchOptions: {
      poll: true,
    },
  },
  {
    entry: './js/d3_custom.js',
    output: {
      filename: 'd3-custom.min.js',
      library: 'd3',
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: [
            /node_modules/,
          ],
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          terserOptions: {
            ecma: 6,
            compress: false,
            mangle: false,
          },
        }),
      ],
    },
    plugins: [{
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          exec('mkdir -p ../magrit_app/static/dist/ && cp dist/d3-custom.min.js ../magrit_app/static/dist/ && echo "Replacing d3-custom.min.js..."', (err, stdout, stderr) => {
            if (stdout) process.stdout.write(stdout);
            if (stderr) process.stderr.write(stderr);
          });
        });
      },
    }],
  },
];
