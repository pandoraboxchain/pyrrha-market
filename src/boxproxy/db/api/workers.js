import Workers from '../models/workers';
import {
    addRecordsFactory,
    removeRecordByAddressFactory,
    getAllFactory
} from './utils/factories';

/**
 * Add (or update) workers records
 *
 * @param {Object} data { records: Array[Object], baseline: Boolean }
 * @param {Object} options Options provided by task
 * @returns {Promise}
 */
export const add = addRecordsFactory(Workers, {
    baselineFlag: 'workersBaseline', 
    subscribeEvent: 'subscribeWorkers',
    subscribeUpdateEvent: 'subscribeWorkerAddress',
    subscribeUpdateFilter: {},
    formatRecord: record => ({
        address: record.address, 
        currentJob: record.currentJob, 
        currentJobStatus: record.currentJobStatus, 
        currentState: record.currentState
    })
});

/**
 * Remove dataset(s) from database 
 *
 * @param {Object} data { records: Array[Object], baseline: Boolean }
 * @param {Object} options Options provided by task
 * @returns {Promise}
 */
export const remove = removeRecordByAddressFactory(Workers);

/**
 * Get all workers that fits to options
 *
 * @param {Object} options Query options
 * @returns {Promise}
 */
export const getAll = getAllFactory(Workers);
