import { normalizePageLimit } from '../../utils/pagination';
import { getAll } from '../../db/api/jobs';

// @route /jobs
export const getJobs = async (req, res, next) => {

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

// @route /jobs/:address
export const getJobByAddress = async (req, res, next) => {

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
