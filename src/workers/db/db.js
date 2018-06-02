import Sequelize from 'sequelize';

const db = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: 'market.db',
    logging: !!process.execPath.match(/[\\/]electron/)
});

export default db;
