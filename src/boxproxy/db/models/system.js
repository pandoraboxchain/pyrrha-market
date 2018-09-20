import Sequelize from 'sequelize';
import db from '../db';

export default db.define('system', {
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
        type: Sequelize.STRING
    }
}, {
    timestamps: false
});
