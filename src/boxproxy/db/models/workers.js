import Sequelize from 'sequelize';
import db from '../db';

export default db.define('workers', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    address: {
        type: Sequelize.STRING,
        unique: true
    },
    currentJob: {
        type: Sequelize.STRING
    },
    currentJobStatus: {
        type: Sequelize.INTEGER
    },
    currentState: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
});
