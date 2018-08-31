import path from 'path';
import webpack from 'webpack';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import WebpackNotifierPlugin from 'webpack-notifier';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import assets from 'postcss-assets';
import autoprefixer from 'autoprefixer';
import config from './config';

export default {
    eslint: {
        fix: true,
        quiet: true,
        failOnError: false,
        output: ''
    },
    entry: {
        app: './src/main.js',
        'vendors': ['angular', 'angular-animate', 'angular-resource', 'angular-sanitize', 'angular-ui-router', 'angular-touch'],
        'polyfill': ['babel-polyfill']
    },
    output: {
        path: path.resolve(__dirname, config.buildDir),
        publicPath: '/blockchain/explorer/',
        filename: '[name].[hash].js',
        chunkFilename: "[id].[chunkhash].bundle.js",
        sourceMapFilename: 'maps/[file].map'
    },

    plugins: [
        new ProgressBarPlugin(),
        new WebpackNotifierPlugin({ alwaysNotify: true }),
        new HtmlWebpackPlugin({ template: 'src/index.ejs', favicon: 'src/favicon.ico', inject: true }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendors', 'polyfill'],
            // filename: "vendor.js"
            // (Give the chunk a different name)
            minChunks: Infinity,
            // (with more entries, this ensures that no other module
            //  goes into the vendor chunk)
        })
    ],
    resolve: {
        alias: {
            createjs$: 'PreloadJS/lib/preloadjs-0.6.2.combined.js',
            modernizr$: path.resolve(__dirname, '.modernizrrc')
        }
    },
    module: {
        preLoaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'eslint' }
        ],
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.json$/, loader: 'json' },
            { test: /\.html$/, loader: 'html' },
            { test: /\.(eot|woff(2)?|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: 'file?name=fonts/[name]---[hash].[ext]' }, {
                test: /\.(png|jpg|gif)$/,
                loaders: [
                    // 'file',
                    "url-loader?name=images/[name]---[hash].[ext]&limit=8192"
                    // ,
                    // 'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                    // 'image-webpack?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 85}}'
                ]
            },
            { test: /\.(mp3|mp4|webm|ogg)$/, loader: 'file?name=media/[name]---[hash].[ext]' },
            { test: /\.css$/, loader: 'style!css?importLoaders=1!postcss' }, {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                loaders: [
                    'style',
                    'css?importLoaders=1&modules&localIdentName=[local]---[hash:base64:5]',
                    'postcss',
                    'sass',
                    //'sass-resources'
                ]
            },
            { test: /\.modernizrrc$/, loader: 'modernizr' }
        ]
    },

    postcss: function() {
        return [assets, autoprefixer({
            browsers: [
                "last 2 versions"
            ]
        })];
    }
};
