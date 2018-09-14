const webpack = require('webpack');
const merge = require('webpack-merge');

// Shared webpack config
const { baseDir, commonModule, entries, htmls, magicConstants  } = require('./webpack.common');

module.exports = {
    devtool: 'inline-source-map',
    target: 'electron-renderer',
    node: {
        __dirname: false,
        __filename: false,
    },
    entry: entries,
    mode: 'development',
    module: merge.smart({
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.svg$/,
                use: ['svg-loader']
            }
        ]
    }, commonModule),
    plugins: [
        ...htmls,
        new webpack.DefinePlugin(magicConstants),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['.js', '.json'],
    },
    output: {
        path: baseDir,
        filename: '[name]/index.js',
        globalObject: 'self'
    }
};
