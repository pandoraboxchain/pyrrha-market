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
    resolve: {
        modules: [
            path.resolve(path.dirname(baseDir), './'),
            path.resolve(path.dirname(baseDir), 'node_modules')
        ],
    },
    entry: {
        main: [
            '@babel/polyfill',
            path.resolve(path.dirname(baseDir), 'src/main/index.js')
        ]
    },
    module: commonModule,
    plugins: [
        new CleanWebpackPlugin([
            baseDir
        ]),
        new CopyWebpackPlugin([
            {
                from: path.resolve(path.dirname(baseDir), 'src/assets'),
                to: path.resolve(baseDir, 'assets')
            }
        ]),
        new CopyWebpackPlugin([
            {
                from: path.resolve(path.dirname(baseDir), 'package.json'),
                to: baseDir
            }
        ]),
        new webpack.DefinePlugin(magicConstants),
    ],
    output: {
        path: baseDir,
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    }
};
