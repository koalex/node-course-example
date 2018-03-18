// FIXME: file-loader v1.0 внутри url-loader глючит -> https://github.com/webpack-contrib/file-loader/issues/181 (откатился на file-loader v0.11)

'use strict';

global.__DEV__              = process.env.NODE_ENV === 'development';
global.__PROD__             = process.env.NODE_ENV === 'production';
const webpack               = require('webpack');
const config                = require('config');
const fs                    = require('fs');
const path                  = require('path');
const glob                  = require('glob');
const join                  = path.join;
const pkg                   = require('./package.json');
const AssetsPlugin          = require('assets-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const BrowserSyncPlugin     = require('browser-sync-webpack-plugin');
const WriteFilePlugin       = require('write-file-webpack-plugin');
const BundleAnalyzerPlugin  = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ZopfliPlugin          = require('zopfli-webpack-plugin');
const ExtractCssChunks      = require('extract-css-chunks-webpack-plugin');
const autoprefixer          = require('autoprefixer');
const cssMqpacker           = require('css-mqpacker');
// const OfflinePlugin         = require('offline-plugin');


module.exports = {
    context: join(config.projectRoot, './client'),
    entry: {
        outdatedbrowser: ['./outdatedbrowser.js'],
        vendor: __DEV__ ? ['./vendor.js'] : ['./vendor.js'],
        index: __DEV__ ? ['react-hot-loader/patch', 'webpack-hot-middleware/client', './index.js'] : ['./index.js']
    },
    output: {
        path: path.resolve(__dirname, './public'),
        publicPath: '/',
        filename: !__DEV__ ? '[name].js' : '[chunkhash].js',
        //library: '[name]',
        chunkFilename: __DEV__ ? '[id].js' : '[id].[chunkhash:8].js'
    },
    watchOptions: {
        aggregateTimeout: 100,
        ignored: /node_modules/
    },
    devtool: __DEV__ ? 'eval-source-map' : 'source-map',
    devServer: {
        hot: __DEV__,
        historyApiFallback: true
    },
    resolve: {
        modules: ['node_modules', 'bower_components'/*, 'modules'*/],
        alias: {
            'utils': path.resolve(__dirname, 'client', 'utils')
        },
        extensions: ['.js', '.jsx', '.less', '.styl', '.scss']
    },
    resolveLoader: {
        modules: ['node_modules', 'bower_components'],
        extensions: ['.js', '.jsx', '.less', '.styl', '.scss']
    },
    performance: {
        hints: false,
        maxEntrypointSize: 400000,
        maxAssetSize: 250000,
        assetFilter: function (assetFilename) {
            return !(/\.map$/.test(assetFilename));
        }
    },
    module: {
        noParse: [/jquery/],
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    // presets: [['@babel/preset-env', {'modules': false}], '@babel/preset-stage-0', '@babel/preset-react'], // когда перейду на babel-loader 8.x
                    presets: [['env', {'modules': false}], 'stage-0', 'react'], // для babel-loader 7.x
                    plugins: [
                        ['import', [
                            {
                                'libraryName': 'material-ui',
                                'camel2DashComponentName': false  // default: true
                            }
                        ]],
                        'transform-runtime', 'transform-decorators-legacy', 'react-hot-loader/babel' // для babel-loader 7.x
                        /*'universal-import', *//*["@babel/plugin-transform-runtime", { // для babel-loader 8.x
                            "helpers": false,
                            "polyfill": false,
                            "regenerator": true,
                            "moduleName": "@babel/runtime"
                        }]*/, 'transform-decorators-legacy', 'react-hot-loader/babel'
                    ]

                }
            },
            {
                test: /\.css$/,
                use: ExtractCssChunks.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                sourceMap: true,
                                minimize: !__DEV__,
                                modules: false,
                                localIdentName: '[name]',//__DEV__ ? '[hash:base64:5][local]' : '[hash:base64:7]',
                                importLoaders: 1

                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixer({ browsers: ['last 3 version', 'ie >= 11'] }),
                                    cssMqpacker({ sort: true })
                                ],
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.less?$/,
                use: ExtractCssChunks.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                sourceMap: true,
                                minimize: !__DEV__,
                                modules: true,
                                localIdentName: __DEV__ ? '[hash:base64:5][local]' : '[hash:base64:7]',
                                importLoaders: 2

                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixer({ browsers: ['last 3 version', 'ie >= 11'] }),
                                    cssMqpacker({ sort: true })
                                ],
                                sourceMap: true
                            }
                        },
                        'less-loader'
                    ]
                })
            },
            {
                test: /\.scss$/,
                use: ExtractCssChunks.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                sourceMap: true,
                                minimize: !__DEV__,
                                modules: true,
                                localIdentName: __DEV__ ? '[hash:base64:5][local]' : '[hash:base64:7]',
                                importLoaders: 2

                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixer({ browsers: ['last 3 version', 'ie >= 11'] }),
                                    cssMqpacker({ sort: true })
                                ],
                                sourceMap: true
                            }
                        },
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.styl$/,
                use: ExtractCssChunks.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                sourceMap: true,
                                minimize: !__DEV__,
                                modules: true,
                                localIdentName: __DEV__ ? '[hash:base64:5][local]' : '[hash:base64:7]',
                                importLoaders: 2

                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixer({ browsers: ['last 3 version', 'ie >= 11'] }),
                                    cssMqpacker({ sort: true })
                                ],
                                sourceMap: true
                            }
                        },
                        'stylus-loader'
                    ]
                })
            },
            {
                test: /\.(png|jpg|jpeg|svg|ttf|eot|woff|woff2)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        query: {
                            name: (__DEV__ ? '[path][name]' : '[path][name].[hash:6]') + '.[ext]',
                            limit: 4096
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        query: {
                            mozjpeg: {
                                progressive: true
                            },
                            gifsicle: {
                                interlaced: false
                            },
                            optipng: {
                                optimizationLevel: 7
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.HotModuleReplacementPlugin(),

        new webpack.ContextReplacementPlugin(
            /^modules/,
            /client[\/\\]/
        ),

        new webpack.ContextReplacementPlugin(
            /([\/\\]node_modules[\/\\]moment[\/\\]locale|[\/\\]bower_components[\/\\]moment[\/\\]locale)/,
            /ru|en-gb/
        ),

        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            children: true,
            // async: true,
            filename: __DEV__ ? '[name].js' : '[id].[hash].js',
            minChunks: Infinity
        }),

        new ExtractCssChunks({
            filename: __DEV__ ? '[name].css' : '[contenthash:8].css'
        }),

        new BundleAnalyzerPlugin({
            analyzerMode: __DEV__ ? 'server' : 'static',
            analyzerHost: require('./libs/getLocalIp')(),
            analyzerPort: 8082,
            openAnalyzer: __DEV__,
            defaultSizes: __DEV__ ? 'parsed' : 'gzip',
            reportFilename: '__bundleAnalyzer.html',
            generateStatsFile: !__DEV__,
            statsFilename: '__webpack.stats.json',
            // Options for `stats.toJson()` method.
            // For example you can exclude sources of your modules from stats file with `source: false` option.
            // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
            statsOptions: null,
            // Log level. Can be 'info', 'warn', 'error' or 'silent'.
            logLevel: __DEV__ ? 'info' : 'warn'
        }),

        new FaviconsWebpackPlugin({
            logo: join(config.projectRoot, './client/assets/img/logo_600x600.jpeg'),
            prefix: '[hash:6]/[hash:6].[ext]',
            emitStats: true,
            statsFilename: 'favicons.json',
            background: '#fff',
            title: pkg.name,
            appName: pkg.name,
            appDescription: pkg.description,
            developerName: pkg.author.name,
            developerURL: pkg.author.url,
            index: pkg.homepage,
            url: pkg.homepage,
            silhouette: false,
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                coast: true,
                favicons: true,
                firefox: true,
                opengraph: true,
                twitter: true,
                yandex: true,
                windows: true
            }
        }),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
            __DEV__: JSON.stringify(__DEV__),
            __DEVTOOLS__: JSON.stringify(__DEV__),
            __SSR__: JSON.stringify(!__DEV__)
        }),

        new AssetsPlugin({
            filename: 'assets.json',
            path: config.publicRoot,
            metadata: { buildDate: new Date() }
        }),

        /*new webpack.DllPlugin({
            path: path.resolve(__dirname, './public/[name]-manifest.json'),
            name: '[name]_lib'
        }),

        new webpack.DllReferencePlugin({
            context: '.',
            manifest: require(path.resolve(__dirname, './public/vendor-manifest.json'))
        })*/

        // new OfflinePlugin()
    ]
};


if (__DEV__) {
    module.exports.plugins.push(new webpack.NamedModulesPlugin());

    module.exports.plugins.push(
        new BrowserSyncPlugin(
            {
                ui: {
                    port: 8090
                },
                host: 'localhost',
                port: 8080,
                // proxy the Webpack Dev Server endpoint
                // (which should be serving on http://localhost:8080/)
                // through BrowserSync
                cors: false,
                proxy: {
                    target: 'http://localhost:' + config.port,
                    ws: true
                }
            },
            {
                // prevent BrowserSync from reloading the page
                // and let Webpack Dev Server take care of this
                reload: false
            }
        )
    );

    module.exports.plugins.push(
        new WriteFilePlugin({
            test: /favicons\.json$/,
            useHashIndex: true
        })
    );
}

if (__PROD__) {
    // to babel-loader
    module.exports.module.rules[0].query.plugins.unshift(['transform-react-remove-prop-types', {
        'mode': 'remove',
        'removeImport': true,
        'ignoreFilenames': ['node_modules']
    }]);

    module.exports.plugins.push(new webpack.HashedModuleIdsPlugin({
        hashFunction: 'sha256',
        hashDigest: 'hex',
        hashDigestLength: 20
    }));

    module.exports.plugins.push( // NO NEED IF -p in CLI
        new webpack.optimize.UglifyJsPlugin({
            test: /\.js$/,
            // exclude: /common\.js/, // ебаный баг заставляет писать костыли https://github.com/webpack/webpack/issues/1079 (TODO: был в v1, скорее всего уже не актуально)
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );

    module.exports.plugins.push(
        new ZopfliPlugin({
            asset: '[path].gz[query]',
            algorithm: 'zopfli',
            test: /\.js$|\.css$/,
            threshold: 10240,
            minRatio: 0.8
        })
    );
}