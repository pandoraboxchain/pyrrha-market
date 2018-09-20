import Sequelize from 'sequelize';
import db from '../db';

export default db.define('config', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true
    },
    value: {
        type: Sequelize.TEXT
    }
}, {
    timestamps: false
});
