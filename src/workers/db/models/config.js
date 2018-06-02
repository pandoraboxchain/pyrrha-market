import Sequelize from 'sequelize';
import sequelize from '../db';

export default sequelize.define('config', {
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
