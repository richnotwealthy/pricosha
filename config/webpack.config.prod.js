/*eslint-disable*/
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var url = require('url');
var paths = require('./paths');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var homepagePath = require(paths.appPackageJson).homepage;
var publicPath = homepagePath ? url.parse(homepagePath).pathname : '/';
if (!publicPath.endsWith('/')) {
    // Prevents incorrect paths in file-loader
    publicPath += '/';
}

module.exports = {
    bail: true,
    devtool: 'cheap-module-source-map',
    entry: [
        require.resolve('./polyfills'),
        path.join(paths.appSrc, 'index')
    ],
    output: {
        path: paths.appBuild,
        filename: 'static/js/[name].[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        publicPath: publicPath
    },
    resolve: {
        extensions: ['*', '.js', '.json'],
        alias: {
            // This `alias` section can be safely removed after ejection.
            // We do this because `babel-runtime` may be inside `react-scripts`,
            // so when `babel-plugin-transform-runtime` imports it, it will not be
            // available to the app directly. This is a temporary solution that lets
            // us ship support for generators. However it is far from ideal, and
            // if we don't have a good solution, we should just make `babel-runtime`
            // a dependency in generated projects.
            // See https://github.com/facebookincubator/create-react-app/issues/255
            'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator')
        }
    },
    // resolveLoader: {
    //   root: paths.ownNodeModules,
    //   moduleTemplates: ['*-loader']
    // },
    module: {
        rules: [{
                test: /\.js$/,

                use: [{
                    loader: 'eslint-loader'
                }],

                include: paths.appSrc,
                enforce: 'pre'
            },
            {
                test: /\.js$/,
                include: paths.appSrc,
                use: [{
                    loader: 'babel-loader',
                    options: require('./babel.prod')
                }],
            },
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader',

                    options: {
                        modules: true
                    }
                }],
                include: /flexboxgrid/,
            },
            {
                test: /\.css$/,
                include: [paths.appSrc, paths.appNodeModules],
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }],
                exclude: /flexboxgrid/
            },
            {
                test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?.*)?$/,
                include: [paths.appSrc, paths.appNodeModules],
                use: [{
                    loader: 'file-loader',
                    options: {
                        //name: 'static/media/[name].[hash:8].[ext]'
                    }
                }]
            },
            {
                test: /\.(mp4|webm)(\?.*)?$/,
                include: [paths.appSrc, paths.appNodeModules],
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        //name: 'static/media/[name].[hash:8].[ext]'
                    }
                }]
            }
        ]
    },
    // eslint: {
    //   // TODO: consider separate config for production,
    //   // e.g. to enable no-console and no-debugger only in prod.
    //   configFile: path.join(__dirname, 'eslint.js'),
    //   useEslintrc: false
    // },
    // postcss: function() {
    //   return [autoprefixer];
    // },
    plugins: [new HtmlWebpackPlugin({
            inject: true,
            template: paths.appProdHtml,
            favicon: paths.appFavicon,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                screw_ie8: true,
                warnings: false
            },

            mangle: {
                screw_ie8: true
            },

            output: {
                comments: false,
                screw_ie8: true
            },

            sourceMap: true
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname,
                eslint: {
                    //configFile: path.join(__dirname, 'eslint.js'),
                    useEslintrc: true
                }
            }
        }),
        // new BundleAnalyzerPlugin()
    ]
};