const path = require('path');
const { utils: { fromBuildIdentifier } } = require('@electron-forge/core');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const sharedModule = {
    rules: [
        {
            test: /\.js?$/,
            exclude: /(node_modules)/,
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
                    entry: {
                        index: [
                            '@babel/polyfill',
                            path.resolve(__dirname, 'src/main/index.js')
                        ],
                        db: [
                            '@babel/polyfill',
                            path.resolve(__dirname, 'src/workers/db/index.js')
                        ]
                    },
                    module: sharedModule,
                    plugins: [
                        new HtmlWebpackPlugin({
                            inject: true,
                            chunks: ['db'],
                            filename: 'db.html',
                            template: 'src/workers/template/index.html'
                        }),
                        new CopyWebpackPlugin([
                            {
                                from: path.resolve(__dirname, 'src/assets'),
                                to: path.resolve(__dirname, '.webpack/assets')
                            }
                        ])
                    ],
                    output: {
                        filename: '[name].js'
                    },
                    externals: ['sqlite3']
                },
                renderer: {
                    config: {
                        module: merge.smart({
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
                            extensions: ['.js', '.json'],
                        }
                    },
                    prefixedEntries: process.env.NODE_ENV === 'production' ? [] : ['react-hot-loader/patch'],
                    entryPoints: [
                        {
                            html: path.resolve(__dirname, 'src/renderer/index.html'),
                            js: path.resolve(__dirname, 'src/renderer/index.js'),
                            name: 'main_window'
                        }
                    ]
                }
            }
        ]
    ],
    hooks: {},
    buildIdentifier: process.env.IS_BETA ? 'beta' : 'prod',
    packagerConfig: {
        appBundleId: fromBuildIdentifier({ beta: 'com.beta.app', prod: 'com.app' })
    }
};
