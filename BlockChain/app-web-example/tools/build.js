import webpack from 'webpack';
import clean from './common/clean';
import Init from './common/init-webpack-config';
import validateEnv from './common/vaildate-env';
import webpackProdConfig from '../webpack.prod.config';
import config from '../config';

function validateParam() {
    var _argv = process.argv[3];
    return validateEnv(_argv);
}
/**
 * Build application
 *
 * @return {Promise}
 */
function bundle(webpackConfig) {
    return new Promise((resolve, reject) => {
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                return reject(err);
            }

            console.log(stats.toString({ chunks: false, colors: true }));

            resolve();
        });
    });
}

export default function build() {
    return clean().then(validateParam).then(function (env) {
        return Init(webpackProdConfig, env);
    }).then(bundle);
}
