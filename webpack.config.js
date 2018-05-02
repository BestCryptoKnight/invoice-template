var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");


var basePath = __dirname;

console.log('process.env.NODE_ENV : ' + process.env.NODE_ENV );
module.exports = {
    cache: true,
    watchOptions: {
        ignored: ['./node_modules/', './bin', './config', './controllers', './data', './doc', './migrations',
            './models', './modules', './pdfAssets', './routes', 'seeders', './services', './temp', './update',
            './uploads', './client/static'],
        aggregateTimeout: 1000
    },
    context: path.join(basePath, 'client'),
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    entry: {
        app: './src/index.tsx',
    },
    output: {
        publicPath : '/',
        path: path.join(basePath, 'client/dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'awesome-typescript-loader',
                options: {
                    useBabel: true,
                },
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                ],
            },
            {
                //IMAGE LOADER
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader:'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'html-loader'
            },
            // Loading glyphicons => https://github.com/gowravshekar/bootstrap-webpack
            // Using here url-loader and file-loader
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
            },
        ],
    },
    // For development https://webpack.js.org/configuration/devtool/#for-development
    devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',
    plugins: [
        new CleanWebpackPlugin(['./client/dist']),
        //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,   // enable source maps to map errors (stack traces) to modules
            output: {
                comments: false, // remove all comments
            },
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        //new CompressionPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.ejs', //Name of file in ./dist/
            template: 'index.ejs', //Name of template in ./src
            hash: true,
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',

        }),
        new CopyWebpackPlugin([
            { from: 'img' ,  to: 'img' },
        ]),
        new CopyWebpackPlugin([
            { from: 'style/*.css' ,  to: '' },
        ]),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'],
        }),
        //new BundleAnalyzerPlugin()
    ],
};
