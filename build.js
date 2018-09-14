const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const express = require('express');

const { devPort, baseDir  } = require('./webpack.common');
const mainConfig = require('./webpack.main');
const rendererConfig = require('./webpack.renderer');
const isDev = process.env.NODE_ENV === 'development';

const build = config => new Promise((resolve, reject) => {

    const compiler = webpack(config);
    compiler.run((err) => {

        if (err) {
            return reject(err);
        }

        resolve();
    });
});

const launchDevServers = async (config) => {

    const compiler = webpack(config);
    const devServer = webpackDevMiddleware(compiler, {
        sourceBase: baseDir,
        publicPath: '/',
        hot: true,
        historyApiFallback: true,
        writeToDisk: true
    });
    const app = express();
    app.use(devServer);
    app.use(webpackHotMiddleware(compiler));
    const expressServer = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Server starting timeout exceeded')), 7000);
        const expressServer = app.listen(devPort, (err) => {
            clearTimeout(timeout);

            if (err) {
                return reject(err);
            }

            console.log(`Server running at port: ${devPort}`);
            resolve(expressServer);
        });
    });

    return expressServer;
};

const startWebpackDev = async () => {

    try {

        await build(mainConfig);
        await launchDevServers(rendererConfig);

        // Launch an electron


    } catch (err) {
        throw err;
    }    
};

if (isDev) {

    startWebpackDev();
} else {

    // Build app
}
    