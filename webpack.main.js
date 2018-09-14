const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Shared config
const { baseDir, commonModule, magicConstants  } = require('./webpack.common');

module.exports = {
    devtool: 'source-map',
    target: 'electron-main',
    mode: 'development',
    node: {
        __dirname: false,
        __filename: false,
    },
    entry: {
        index: [
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
        new webpack.DefinePlugin(magicConstants),
    ],
    resolve: {
        modules: [
            path.resolve(path.dirname(baseDir), './'),
            path.resolve(path.dirname(baseDir), '..', 'node_modules'),
            path.resolve(__dirname, '..', 'node_modules')
        ]
    },
    output: {
        path: path.resolve(baseDir, 'main'),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    }
};
