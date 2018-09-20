import path from 'path';
import Sequelize from 'sequelize';
import log from '../logger';

export default new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../../market.db'),
    operatorsAliases: false,
    logging: process.env.NODE_ENV === 'development' ? data => log.info('Sequelize: %s', data) : false
});
