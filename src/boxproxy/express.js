import log from './logger';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';

export default (config) => {
    const app = express();

    app.set('trust proxy', 1);
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '5mb' }));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 
            'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.use(helmet());

    app.server = app.listen(config.port, () => {
        log.info(`Server running at ${config.port} port`);
    });

    return app;
};
