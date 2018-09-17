const path = require('path');
const { spawn } = require('child_process');
const packageJson = require('./package.json');
const electronExecPath = require(path.resolve(__dirname, 'node_modules/electron'));
const { rebuild: electronRebuild } = require('electron-rebuild');
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

const rebuildNativeDependencies = async () => {
    const electronVersion = packageJson.devDependencies.electron;

    const rebuilder =  electronRebuild({
        buildPath: path.resolve(__dirname),
        electronVersion
    });
    const  { lifecycle } = rebuilder;

    lifecycle.on('module-found', (module) => {
        console.log(`Native module "${module}" has been found`);
    });
    lifecycle.on('module-done', () => {
        console.log('Native module rebuild done');
    });

    await rebuilder;
};

const build = config => new Promise((resolve, reject) => {

    const compiler = webpack(config);
    compiler.run((err) => {

        if (err) {
            return reject(err);
        }

        console.log(`Webpack has done a build for entries: ${Object.keys(config.entry)}`);
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

            console.log(`Development server running at port: ${devPort}`);
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
        env: {
            ...process.env,
            ...{
                ELECTRON_ENABLE_LOGGING: 'true',
                ELECTRON_ENABLE_STACK_DUMPING: 'true'
            }
        },
        shell: true
    };

    const spawnedElectron =  spawn(electronExecPath, [path.resolve(__dirname, '.webpack')], spawnOptions);

    return spawnedElectron;
};

const spawnWrapper = () => {

    lastSpawnedElectron = spawnElectron();

    lastSpawnedElectron.on('error', err => {
        console.error(`electron error: ${err}`);
    });

    lastSpawnedElectron.on('exit', () => {

        if (lastSpawnedElectron.restarted) {

            return;
        }

        if (!process.stdin.isPaused()) {

            process.stdin.pause();
        }
    });

    if (process.stdin.isPaused()) {

        process.stdin.resume();
    }
};

const startWebpackDev = async () => {
    
    try {

        await rebuildNativeDependencies();
        await build(mainConfig);
        await launchDevServers(rendererConfig);        

        process.stdin.on('data', async (data) => {

            if (data.toString().trim() === 'rs' && lastSpawnedElectron) {

                console.info('\nRestarting App\n');
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
    