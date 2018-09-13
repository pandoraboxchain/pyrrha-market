const path = require('path');
const { utils: { fromBuildIdentifier } } = require('@electron-forge/core');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const sharedModule = {
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

module.exports = {
    electronRebuildConfig: {
        // force: true
    },
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            platforms: [
                'win32'
            ],
            config: {
                name: 'test'
            }
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: [
                'darwin'
            ]
        },
        {
            name: '@electron-forge/maker-deb',
            platforms: [
                'linux'
            ],
            'config': {}
        },
        {
            name: '@electron-forge/maker-rpm',
            platforms: [
                'linux'
            ],
            'config': {}
        }
    ],
    publishers: [],
    plugins: [
        [
            '@electron-forge/plugin-webpack', {
                mainConfig: {
                    entry: [
                        '@babel/polyfill',
                        path.resolve(__dirname, 'src/main/index.js')
                    ],
                    module: sharedModule,
                    plugins: [
                        new CopyWebpackPlugin([
                            {
                                from: path.resolve(__dirname, 'src/assets'),
                                to: path.resolve(__dirname, '.webpack/assets')
                            }
                        ])
                    ]
                },
                renderer: {
                    config: {
                        module: merge({
                            rules: [
                                {
                                    test: /\.css$/,
                                    use: ['style-loader', 'css-loader']
                                },
                                {
                                    test: /\.(svg)$/,
                                    use: ['svg-loader']
                                }
                            ]
                        }, sharedModule),
                        resolve: {
                            extensions: ['.js', '.json']
                        },
                        externals: ['aws-sdk', 'pg', 'pg-hstore', 'mysql2', 'tedious']
                    },
                    prefixedEntries: process.env.NODE_ENV === 'production' ? [] : ['react-hot-loader/patch'],
                    entryPoints: [
                        {
                            html: path.resolve(__dirname, 'src/renderer/index.html'),
                            js: path.resolve(__dirname, 'src/renderer/index.js'),
                            name: 'main_window'
                        },
                        {
                            html: path.resolve(__dirname, 'src/workers/template/index.html'),
                            js: path.resolve(__dirname, 'src/workers/db/index.js'),
                            name: 'db_worker'
                        }
                    ]
                }
            }
        ]
    ],
    hooks: {},
    buildIdentifier: process.env.IS_BETA ? 'beta' : 'prod',
    packagerConfig: {
        appBundleId: fromBuildIdentifier({ beta: 'com.beta.app', prod: 'com.app' }),
        asar: true
    }
};
