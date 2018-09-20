import Datasets from '../models/datasets';
import {
    addRecordsFactory,
    removeRecordByAddressFactory,
    getAllFactory
} from './utils/factories';

/**
 * Add (or update) datasets records
 *
 * @param {Object} data { records: Array[Object], baseline: Boolean }
 * @param {Object} options Options provided by task
 * @returns {Promise}
 */
export const add = addRecordsFactory(Datasets, {
    baselineFlag: 'datasetsBaseline', 
    subscribeEvent: 'subscribeDatasets',
    formatRecord: record => ({
        address: record.address,
        ipfsAddress: record.ipfsAddress,
        dataDim: record.dataDim,
        batchesCount: record.batchesCount,
        currentPrice: record.currentPrice,
        metadata: record.metadata,
        description: record.description
    })
});

/**
 * Remove dataset(s) from database 
 *
 * @param {Object} data { records: Array[Object], baseline: Boolean }
 * @param {Object} options Options provided by task
 * @returns {Promise}
 */
export const remove = removeRecordByAddressFactory(Datasets);

/**
 * Get all datasets that fits to options
 *
 * @param {Object} options Query options
 * @returns {Promise}
 */
export const getAll = getAllFactory(Datasets);
