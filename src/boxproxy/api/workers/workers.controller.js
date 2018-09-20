import { normalizePageLimit } from '../../utils/pagination';
import { getAll } from '../../db/api/workers';

// @route /workers/count
export const getWorkerNodesCount = async (req, res, next) => {

    try {

        const { count } = await getAll(req.query);        
        
        res.status(200).json({
            count
        });
    } catch(err) {
        next(err);
    }
};

// @route /workers
export const getWorkers = async (req, res, next) => {

    try {

        const { rows, count } = await getAll(req.query);
        const { limit, page } = normalizePageLimit(req.query.page, req.query.limit, count);
        
        res.status(200).json({
            records: rows,
            count,
            limit,
            page
        });
    } catch(err) {
        next(err);
    }
};

// @route /workers/:id
export const getWorkerById = async (req, res, next) => {

    try {

        const { rows, count } = await getAll({
            filterBy: `index:eq:${req.params.id}:number`
        });
        
        res.status(200).json({
            records: rows,
            count
        });
    } catch(err) {
        next(err);
    }
};

// @route /workers:address
export const getWorkerByAddress = async (req, res, next) => {

    try {

        const { rows, count } = await getAll({
            filterBy: `address:eq:${req.params.address}`
        });
        
        res.status(200).json({
            records: rows,
            count
        });
    } catch(err) {
        next(err);
    }
};
