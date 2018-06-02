import Sequelize from 'sequelize';
import db from './db';

class Migrator {
    constructor(options = {}) {
        this.queryInterface = db.getQueryInterface();
        this.sequelize = Sequelize;
        this.options = {
            migrations: options.migrations || []
        };
    }

    async up(...names) {
        return await Promise.all(this.options.migrations.map(mgr => {

            if (names.length > 0 && !names.includes(mgr.name)) {

                return Promise.resolve();
            }

            return mgr.up(this.queryInterface, this.sequelize);
        }));
    }
}

export default (migrationsObj) => new Migrator(migrationsObj);
