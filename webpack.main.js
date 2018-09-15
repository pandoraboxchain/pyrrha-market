const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Shared config
const { baseDir, magicConstants  } = require('./config');
const commonModule = require('./webpack.common');

module.exports = {
    devtool: 'source-map',
    target: 'electron-main',
    mode: 'development',
    node: {
        __dirname: false,
        __filename: false,
    },
    entry: {
        main: [
            '@babel/polyfill',
            path.resolve(__dirname, 'src/main/index.js')
        ]
    },
    module: commonModule,
    plugins: [
        new CleanWebpackPlugin([
            baseDir
        ]),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/assets'),
                to: path.resolve(baseDir, 'assets')
            }
        ]),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'package.json'),
                to: path.resolve(baseDir)
            }
        ]),
        new webpack.DefinePlugin(magicConstants),
    ],
    output: {
        path: path.resolve(baseDir),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    }
};
