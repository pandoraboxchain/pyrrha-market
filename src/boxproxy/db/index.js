import { EventEmitter } from 'events';
import * as expect from '../utils/expect';
import { safeObject } from '../utils/json';
import Queue from '../utils/queue';
import db from './db';
import migrator from './migrator';
import migrations from './seeders';
import api from './api';

// Models
import systemModel from './models/system';
import configModel from './models/config';
import kernelsModel from './models/kernels';
import datasetsModel from './models/datasets';
import jobsModel from './models/jobs';
import workersModel from './models/workers';

export const allModels = [
    systemModel,
    configModel,
    kernelsModel,
    datasetsModel,
    jobsModel,
    workersModel
];

/**
 * Pandora database manager
 *
 * @class PandoraDb
 * @extends {EventEmitter}
 * @event initialized
 * @event beforeAction
 * @event action
 * @event stopped
 * @event error
 */
export class PandoraDb extends EventEmitter {

    /**
     * Api reference getter
     *
     * @readonly
     * @memberof PandoraDb
     */
    get api() {
        return api;
    };
    
    constructor() {
        super();
        this.initialized = false;
        this.tasks = [];// tasks config
        this.options = {};
        this.queue = new Queue();
        this.queue.on('error', err => this.emit('error', safeObject(err)));

        // Start all tasks after the Db initialization
        this.once('initialized', () => this.tasks.map(task => this._setupTask(task)));
    }

    // Setup a task by config
    _setupTask(task) {

        let endpoint;

        if (typeof task.action === 'function') {

            // Custom action
            endpoint = task.action;
        } else {

            // API-based action
            endpoint = task.action.split('.').reduce((acc, part) => {
                return acc && acc[part] !== undefined ? acc[part] : null;
            }, this.api);
        }

        if (task.source && task.event && endpoint) {

            // Subscribe on provider event
            task.source.on(task.event, async (data) => {

                try {

                    this.emit('beforeAction', {
                        name: task.name,
                        event: task.event,
                        data
                    });

                    this.queue.add(task, [], async (task) => {

                        try {

                            // Run task action
                            await endpoint(data, {
                                ...task.actionOptions,
                                source: task.source
                            });

                            this.emit('action', {
                                name: task.name,
                                event: task.event,
                                data
                            });
                        } catch (err) {

                            this.emit('error', safeObject(err));
                        }                        

                    }, undefined, false);

                } catch (err) {

                    this.emit('error', safeObject(err));
                }
            });
        }

        // Handle the initialization callback
        if (task.init && task.initEvent) {

            if (task.isInitialized) {

                if (task.source[task.isInitialized]) {

                    task.init(task);
                } else {

                    task.source.once(task.initEvent, () => task.init(task));
                }                
            } else {

                task.source.once(task.initEvent, () => task.init(task));                    
            }            
        }
    }

    /**
     * Initialize the DB
     *
     * @param {Object} config Manager config
     * @returns {Promise}
     * @memberof PandoraDb
     */
    async initialize(config = {}) {

        try {
            Object.assign(this.options , config.database || {});

            await Promise.all(allModels.map(model => model.sync()));

            await db.authenticate();
            const alreadySeeded = await api.system.isAlreadySeeded();

            if (!alreadySeeded) {

                // Seed some initial data
                await migrator({ migrations }).up();
            } else {

                const { Pandora, PandoraMarket } = await api.system.getContactsAddresses();

                // Check for used Pandora contract version
                if (config.addresses.Pandora !== Pandora || config.addresses.PandoraMarket !== PandoraMarket) {

                    // Wipe database
                    await migrator({ migrations }).down();

                    // And seed initial data
                    await migrator({ migrations }).up();
                }
            }
            
            this.initialized = true;
            this.emit('initialized');
            
            return this;

        } catch(err) {

            this.initialized = false;
            this.emit('error', safeObject(err));
            return Promise.reject(err);
        }
    }

    /**
     * Gracefully stop the DB
     *
     * @memberof PandoraDb
     */
    async stop() {

        try {
            await db.close();
            this.initialized = false;
            this.emit('stopped');
        } catch(err) {
            this.emit('error', safeObject(err));
            return Promise.reject(err);
        }
    }

    /**
     * Add manager task
     *
     * @param {Object} options Task configuration
     * @memberof PandoraDb
     */
    addTask(options = {}) {
        expect.all(options, {
            name: {
                type: 'string'
            },
            source: {
                type: 'object'
            },
            event: {
                type: 'string',
                required: false
            },
            action: {
                type: 'functionOrMember',
                provider: this.api,
                required: false
            },
            actionOptions: {
                type: 'object',
                required: false
            },
            isInitialized: {
                type: 'string',
                required: false
            },
            initEvent: {
                type: 'string',
                required: false
            },
            init: {
                type: 'function',
                required: false
            }
        });

        this.tasks.push(options);

        if (this.initialized) {

            this._setupTask(options);
        }
    }
}

export default new PandoraDb();
