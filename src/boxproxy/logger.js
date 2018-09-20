import winston from 'winston';

export const createLogger = level => {

    const config = {
        level,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.splat(),
            winston.format.simple()
        ),
        exitOnError: false,
        transports: []
    };
    
    // Setup transports
    config.transports.push(new winston.transports.Console());
    // config.transports.push(new winston.transports.File({
    //     filename: 'boxproxy-log.log',
    //     level: 'debug'
    // }));

    return winston.createLogger(config);
};

export default createLogger(process.env.NODE_ENV === 'testing' ? 'error' : process.env.LOG_LEVEL || 'warn');
