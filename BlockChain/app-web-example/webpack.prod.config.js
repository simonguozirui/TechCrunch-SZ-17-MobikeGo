import extend from 'extend';
import webpack from 'webpack';
import webpackConfig from './webpack.config.js';

var env = {
    'process.env': {
        NODE_ENV: JSON.stringify('production')
    }
}
var config = extend(true, {}, webpackConfig, {

    devtool: '#source-map',

    plugins: webpackConfig.plugins.concat([
        new webpack.DefinePlugin(env),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
    ])
});

export default config;
