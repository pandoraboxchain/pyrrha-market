import path from 'path';
import Sequelize from 'sequelize';
import log from '../logger';

import { app } from 'electron';
import fs from 'fs';

const useDir = dirPath => {

    if (fs.existsSync(dirPath)) {

        fs.accessSync(dirPath, fs.W_OK);
        return dirPath;
    }

    fs.mkdirSync(dirPath);
    return dirPath;
};

const findResourcesPath = (appName) => {
    const appDataDir = app.getPath('appData');

    try {
        return useDir(path.resolve(appDataDir, appName));
    } catch (err) {

        log.error(`Data path "${appDataDir}" not writeable or not found:`, err);
        return null;
    }
};

const dbFilePath = !!process.execPath.match(/[\\/]electron/) ? 
    path.resolve(__dirname, '../../market.db') : path.resolve(findResourcesPath(app.getName()), 'market.db');

log.warn(`Database file created on path: ${dbFilePath}`);

export default new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: dbFilePath,
    operatorsAliases: false,
    logging: process.env.NODE_ENV === 'development' ? data => log.info('Sequelize: %s', data) : false
});
