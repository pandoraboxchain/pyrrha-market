const path = require('path');
const { spawn } = require('child_process');
const electronExecPath = require(path.resolve(__dirname, 'node_modules/electron'));
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const express = require('express');

const { devPort, baseDir  } = require('./config');
const mainConfig = require('./webpack.main');
const rendererConfig = require('./webpack.renderer');
const isDev = process.env.NODE_ENV === 'development';

// Electron instance
let lastSpawnedElectron;

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
        writeToDisk: true,
        noInfo: true
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

const spawnElectron = () => {

    if (!electronExecPath) {

        throw new Error('Electron executable not found');
    }

    const spawnOptions = {
        stdio: 'inherit',
        env: Object.assign({}, process.env, {
            ELECTRON_ENABLE_LOGGING: 'true',
            ELECTRON_ENABLE_STACK_DUMPING: 'true'
        }),
        shell: true
    };

    const spawnedElectron =  spawn(electronExecPath, [path.resolve(__dirname, '.webpack')], spawnOptions);

    spawnedElectron.on('error', err => {
        console.error(`could not start electron ${err}`);
    });

    spawnedElectron.on('exit', (code, signal) => {
        console.log(`process exited with code ${code}`);
        process.exit(code);
    });

    spawnedElectron.on('SIGTERM', () => {
        spawnedElectron.kill('SIGTERM');
    });

    spawnedElectron.on('SIGINT', () => {
        spawnedElectron.kill('SIGINT');
    });

    return spawnedElectron;
};

const spawnWrapper = () => {

    lastSpawnedElectron = spawnElectron();

    if (process.stdin.isPaused()) {

        process.stdin.resume();
    }

    lastSpawnedElectron.on('exit', () => {

        if (lastSpawnedElectron.restarted) {

            return;
        }

        if (!process.stdin.isPaused()) {

            process.stdin.pause();
        }
    });
};

const startWebpackDev = async () => {
    
    try {

        await build(mainConfig);
        await launchDevServers(rendererConfig);

        process.stdin.on('data', async (data) => {

            if (data.toString().trim() === 'rs' && lastSpawnedElectron) {

                console.info('\nRestarting App\n'.cyan);
                lastSpawnedElectron.restarted = true;
                lastSpawnedElectron.kill('SIGTERM');
                lastSpawnedElectron.emit('restarted', spawnWrapper());
            }
        });

        spawnWrapper();

    } catch (err) {

        throw err;
    }    
};

const startWebpackProd = async () => {

    try {

        await build(mainConfig);
        await build(rendererConfig);

        // Build an electron app


    } catch (err) {

        throw err;
    }
};

if (isDev) {

    startWebpackDev()
        .catch(console.err);
} else {

    // Build the app
    startWebpackProd()
        .catch(console.err);
}
    