import Jobs from '../models/jobs';
import {
    addRecordsFactory,
    removeRecordByAddressFactory,
    getAllFactory
} from './utils/factories';

/**
 * Add (or update) jobs records
 *
 * @param {Object} data { records: Array[Object], baseline: Boolean }
 * @param {Object} options Options provided by task
 * @returns {Promise}
 */
export const add = addRecordsFactory(Jobs, {
    baselineFlag: 'jobsBaseline', 
    subscribeEvent: ['subscribeJobs', 'subscribeJobStateChanged'],
    formatRecord: record => ({
        address: record.address, 
        activeWorkers: record.activeWorkers.join(';'), 
        dataset: record.dataset, 
        kernel: record.kernel,
        kernelIpfs: record.kernelIpfs,
        datasetIpfs: record.datasetIpfs,
        description: record.description, 
        ipfsResults: record.ipfsResults.join(';'), 
        state: record.state, 
        jobType: record.jobType, 
        progress: record.progress
    })
});

/**
 * Remove dataset(s) from database 
 *
 * @param {Object} data { records: Array[Object], baseline: Boolean }
 * @param {Object} options Options provided by task
 * @returns {Promise}
 */
export const remove = removeRecordByAddressFactory(Jobs);

/**
 * Get all jobs that fits to options
 *
 * @param {Object} options Query options
 * @returns {Promise}
 */
export const getAll = getAllFactory(Jobs);
