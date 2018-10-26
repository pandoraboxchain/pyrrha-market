// import path from 'path';
// import fs from 'fs';
import logger from 'electron-log';
import pack from '../package.json';

export const createLogger = level => {

    logger.transports.console.format = '{h}:{i}:{s}:{ms} {text}';
    logger.transports.file.maxSize = 5 * 1024 * 1024;    
    logger.transports.file.format = '{h}:{i}:{s}:{ms} {text}';
    logger.transports.file.appName = pack.name;
    // logger.transports.file.file = path.resolve(__dirname, 'log.txt');
    // logger.transports.file.streamConfig = { flags: 'w' };
    // logger.transports.file.stream = fs.createWriteStream(logger.transports.file.file);

    if (level) {

        logger.transports.console.level = level;
        logger.transports.file.level = level;
    }
};

export default logger;
