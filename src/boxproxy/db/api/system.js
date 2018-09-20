import { Op } from 'sequelize';
import System from '../models/system';
import * as expect from '../../utils/expect';
import { getAllFactory } from './utils/factories';

/**
 * Fetch all system records
 *
 * @returns {Promise<[{Object}]>} 
 */
export const getAll = getAllFactory(System);

/**
 * Check is system has benn already seeded
 *
 * @returns {Promise<{Boolean}>} 
 */
export const isAlreadySeeded = async () => {
    const alreadySeeded = await System.findOne({
        where: {
            name: {
                [Op.eq]: 'alreadySeeded'
            },
            value: {
                [Op.eq]: 'yes'
            }
        }
    });

    return !!alreadySeeded;
};

/**
 * Save block number
 * 
 * @param {Object} data { records: Array[Object], baseline: Boolean }
 * @param {Object} options Options provided by task
 * @returns {Promise} upsert result
 */
export const saveBlockNumber = async (data = {}, options = {}) => {

    expect.all(data, {
        'name': {
            type: 'string'
        },
        'blockNumber': {
            type: 'number'
        }
    });

    return await System.upsert({
        name: `${data.name}.blockNumber`,
        value: data.blockNumber
    });
};

/**
 * Fetch last saved block number
 * 
 * @param {String} name Model name
 * @returns {Promise<{Number}>} 
 */
export const getBlockNumber = async (name) => {

    expect.all({ name }, {
        'name': {
            type: 'string'
        }
    });

    const blockNumber = await System.findOne({
        where: {
            name: {
                [Op.eq]: `${name}.blockNumber`
            }
        }
    });

    return blockNumber ? parseInt(blockNumber.value, 10) : 0;
};

/**
 * Check the flag is baseline has been saved
 * 
 * @param {String} flag
 * @returns {Promise<{Boolean}>}
 */
export const isBaseline = async (flag) => {

    expect.all({ flag }, {
        'flag': {
            type: 'enum',
            values: [
                'kernelsBaseline',
                'datasetsBaseline',
                'workersBaseline',
                'jobsBaseline'
            ]
        }
    });

    const kernelsBaseline = await System.findOne({
        where: {
            name: {
                [Op.eq]: flag
            }
        }
    });

    return !!(kernelsBaseline && kernelsBaseline.value === 'yes');
};

/**
 * Get saved contracts addresses from database
 * 
 * @returns {Promise<Object>} {Pandora: {String}, PandoraMarket: {String}}
 */
export const getContactsAddresses = async () => {

    const [ pandoraRecord, marketRecord ] = await Promise.all([
        'contract.Pandora', 
        'contract.PandoraMarket'
    ].map(key => System.findOne({
        where: {
            name: {
                [Op.eq]: key
            }
        }
    })));

    return {
        Pandora: pandoraRecord ? pandoraRecord.value : null,
        PandoraMarket: marketRecord ? marketRecord.value : null
    };
};

/**
 * Save flag about baseline has been saved
 * 
 * @param {String} flag
 * @returns {Promise} upsert result
 */
export const fixBaseline = async (flag) => {

    expect.all({ flag }, {
        'flag': {
            type: 'enum',
            values: [
                'kernelsBaseline',
                'datasetsBaseline',
                'workersBaseline',
                'jobsBaseline'
            ]
        }
    });

    return await System.upsert({
        name: flag,
        value: 'yes'
    });
};

/**
 * Clear flag about baseline has been saved
 * 
 * @param {String} flag
 * @returns {Promise} upsert result
 */
export const clearBaseline = async (flag) => {

    expect.all({ flag }, {
        'flag': {
            type: 'enum',
            values: [
                'kernelsBaseline',
                'datasetsBaseline',
                'workersBaseline',
                'jobsBaseline'
            ]
        }
    });
    
    return await System.upsert({
        name: flag,
        value: 'no'
    });
};
