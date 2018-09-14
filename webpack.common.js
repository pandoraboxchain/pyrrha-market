const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Common config
const devPort = 3000;
const baseDir = path.resolve(__dirname, '.webpack');
const entryPoints = [
    {
        name: 'renderer',
        html: path.resolve(__dirname, 'src/renderer/index.html'),
        js: path.resolve(__dirname, 'src/renderer/index.js')
    }
];

// Build entries config
let htmls = [];
let magicConstants = {};
const entries = entryPoints.reduce((acc, curr) => {
    acc[curr.name] = ['@babel/polyfill'];
    
    if (curr.html && curr.js) {

        acc[curr.name] = [...acc[curr.name], ...[
            'react-hot-loader/patch',
            'webpack-hot-middleware/client',
            curr.js
        ]];

        htmls.push(new HtmlWebpackPlugin({
            inject: true,
            chunks: [curr.name],
            filename: `${curr.name}/index.html`,
            template: curr.html,
            showErrors: true
        }));

        magicConstants[`${curr.name.toUpperCase()}_WEBPACK_ENTRY`] = `http://localhost:${devPort}/${curr.name}`;
    } else if (!curr.html && curr.js) {

        acc[curr.name] = [...acc[curr.name], ...[
            curr.js
        ]];
    } else {

        throw new Error('Entry point configuration have to include at least "html" or "js" options');
    }

    return acc;
}, {});

module.exports.devPort = devPort;
module.exports.baseDir = baseDir;
module.exports.entries = entries;
module.exports.htmls = htmls;
module.exports.magicConstants = magicConstants;
module.exports.commonModule = {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: ['url-loader']
        }
    ]
};
