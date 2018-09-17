const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Common config
const devPort = 3000;
const baseDir = path.resolve(__dirname, '.webpack');
const entryPoints = [
    {
        name: 'main_window',
        html: path.resolve(path.dirname(baseDir), 'src/renderer/index.html'),
        js: path.resolve(path.dirname(baseDir), 'src/renderer/index.js')
    },
    {
        name: 'db_worker',
        html: path.resolve(path.dirname(baseDir), 'src/workers/template/index.html'),
        js: path.resolve(path.dirname(baseDir), 'src/workers/db/index.js'),
        noHmr: true,
        externals: ['npm', 'aws-sdk', 'mysql2', 'pg', 'pg-hstore', 'tedious']
    }
];

// Build entries config
let htmls = [];
let magicConstants = {};
let externals = [];
const entries = entryPoints.reduce((acc, curr) => {
    acc[curr.name] = ['@babel/polyfill'];

    if (curr.html && curr.js) {

        const additionalPrefixes = curr.noHmr ? [] : [
            'react-hot-loader/patch',
            'webpack-hot-middleware/client'
        ];

        acc[curr.name] = [
            ...acc[curr.name], 
            ...additionalPrefixes,
            curr.js
        ];

        htmls.push(new HtmlWebpackPlugin({
            inject: true,
            chunks: [curr.name],
            filename: `${curr.name}/index.html`,
            template: curr.html,
            showErrors: true
        }));

        magicConstants[`${curr.name.toUpperCase()}_WEBPACK_ENTRY`] = `'http://localhost:${devPort}/${curr.name}'`;
    } else if (!curr.html && curr.js) {

        acc[curr.name] = [...acc[curr.name], ...[
            curr.js
        ]];
    } else {

        throw new Error('Entry point configuration have to include at least "html" or "js" options');
    }

    if (curr.externals) {

        externals = [...externals, ...curr.externals];
    }

    return acc;
}, {});

module.exports.devPort = devPort;
module.exports.baseDir = baseDir;
module.exports.entries = entries;
module.exports.htmls = htmls;
module.exports.magicConstants = magicConstants;
module.exports.externals = externals;
