import extend from 'extend';
import webpack from 'webpack';
import webpackConfig from './webpack.config.js';

webpackConfig.entry.hot = 'webpack-hot-middleware/client?reload=true&quiet=true';

webpackConfig.output.publicPath='';

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
        // new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
        new webpack.HotModuleReplacementPlugin()
    ])
})

export default config;
