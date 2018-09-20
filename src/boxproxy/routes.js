import systemEndpoint from './api/system';
import jobsEndpoint from './api/jobs';
import datasetsEndpoint from './api/datasets';
import kernelsEndpoint from './api/kernels';
import workersEndpoint from './api/workers';

export default async (app) => {

    // System endpoints
    app.use('/system', systemEndpoint);

    // API routes
    app.use('/jobs', jobsEndpoint);
    app.use('/datasets', datasetsEndpoint);
    app.use('/kernels', kernelsEndpoint);    
    app.use('/workers', workersEndpoint);
    
    
    app.get('/*', (req, res, next) => {
        const err = new Error('Please use appropriate API route');
        err.code = 400;
        next(err);
    });

    // Error handler
    app.use(function(err, req, res, next) {
        const response = {
            error: {
                code: err.code || 500,
                message: err.message || 'Internal Server Error'
            }
        };

        res.status(response.error.code).json(response);
    });
};
