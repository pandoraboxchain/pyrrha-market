/**
 * Fetching workers
 *
 * @param {Object} pjs Pjs instance
 * @returns {Promise} {Array[{Object}]}
 */
export const getWorkersRecords = async (pjs) => {
    
    const blockNumber = await pjs.web3.eth.getBlockNumber();
    const { records, error } = await pjs.api.workers.fetchAll();

    return {
        records,
        blockNumber,
        error
    };
};

/**
 * Subscribe to WorkerNodeCreated event
 *
 * @param {Object} pjs Pjs instance
 * @param {Object} options eventWorkerNodeCreated, see pyrrha-js for details
 * @param {Function} dataCallback Return { records: Array[Object], blockNumber: Number }
 * @param {Function} errorCallback
 * @returns {Promise}
 */
export const subscribeWorkerAdded = async (pjs, options = {}, dataCallback = () => {}, errorCallback = () => {}) => {

    const workerNodeCreated = await pjs.api.workers.eventWorkerNodeCreated(options);
    return workerNodeCreated
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
 * Subscribe to WorkerNodeStateChanged event
 *
 * @param {Object} pjs Pjs instance
 * @param {Object} address Worker address
 * @param {Object} options eventWorkerNodeStateChanged, see pyrrha-js for details
 * @param {Function} dataCallback Return { records: Array[Object], blockNumber: Number }
 * @param {Function} errorCallback
 * @returns {Promise}
 */
export const subscribeWorkerNodeStateChanged = async (pjs, address, options = {}, dataCallback = () => {}, errorCallback = () => {}) => {

    const workerNodeStateChanged = await pjs.api.workers.eventWorkerNodeStateChanged(address, options);
    return workerNodeStateChanged
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