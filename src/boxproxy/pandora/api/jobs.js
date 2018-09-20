/**
 * Fetching jobs
 *
 * @param {Object} pjs Pjs instance
 * @returns {Promise} {Array[{Object}]}
 */
export const getJobsRecords = async (pjs) => {
    
    const blockNumber = await pjs.web3.eth.getBlockNumber();
    const { records, error } = await pjs.api.jobs.fetchAll();

    return {
        records,
        blockNumber,
        error
    };
};

/**
 * Subscribe to CognitiveJobCreated event
 *
 * @param {Object} pjs Pjs instance
 * @param {Object} options eventCognitiveJobCreated, see pyrrha-js for details
 * @param {Function} dataCallback Return { records: Array[Object], blockNumber: Number }
 * @param {Function} errorCallback
 * @returns {Promise}
 */
export const subscribeCognitiveJobCreated = async (pjs, options = {}, dataCallback = () => {}, errorCallback = () => {}) => {

    const cognitiveJobCreated = await pjs.api.jobs.eventCognitiveJobCreated(options);
    return cognitiveJobCreated
        .data(async ({records, event}) => {

            try {

                const blockNumber = await pjs.web3.eth.getBlockNumber();

                dataCallback({
                    records,
                    event,
                    blockNumber
                });
            } catch (err) {
                errorCallback(err);
            }
        })
        .error(errorCallback);
};

/**
 * Subscribe to event JobStateChanged for CognitiveJob
 *
 * @param {Object} pjs Pjs instance
 * @param {Object} options eventCognitiveJobStateChanged, see pyrrha-js for details
 * @param {Function} dataCallback Return { records: Array[Object], blockNumber: Number }
 * @param {Function} errorCallback
 * @returns {Promise}
 */
export const subscribeJobStateChanged = async (pjs, options = {}, dataCallback = () => {}, errorCallback = () => {}) => {

    const jobStateChanged = await pjs.api.jobs.eventJobStateChanged(options);
    return jobStateChanged
        .data(async ({records, event}) => {

            try {

                const blockNumber = await pjs.web3.eth.getBlockNumber();

                dataCallback({
                    records,
                    event,
                    blockNumber
                });
            } catch (err) {
                errorCallback(err);
            }
        })
        .error(errorCallback);    
};