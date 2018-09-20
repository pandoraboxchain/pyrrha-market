import Sequelize from 'sequelize';
import db from '../db';

export default db.define('datasets', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    address: {
        type: Sequelize.STRING,
        unique: true
    },
    ipfsAddress: {
        type: Sequelize.STRING,
    },
    dataDim: {
        type: Sequelize.INTEGER,
    },
    batchesCount: {
        type: Sequelize.INTEGER
    },
    currentPrice: {
        type: Sequelize.INTEGER,
    },
    metadata: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
}, {
    timestamps: false
});
