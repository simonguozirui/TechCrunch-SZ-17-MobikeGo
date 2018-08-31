import webpack from 'webpack';
import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import clean from './common/clean';
import validateEnv from './common/vaildate-env';
import Init from './common/init-webpack-config';
import webpackDevConfig from '../webpack.dev.config';
import config from '../config';
import mockApp from '../mock';

function validateParam() {
    var _argv = process.argv[3];
    return validateEnv(_argv);
}

/**
 * Start development server with build
 *
 * @return {Promise}
 */
function serve(webpackConfig) {
    var compiler = webpack(webpackConfig),
        bs = browserSync.create();

    bs.init({
        open: false,
        port: config.port,
        server: {
            baseDir: `./${config.buildDir}`,
            middleware: [
                mockApp,
                historyApiFallback(),
                webpackDevMiddleware(compiler, {
                    publicPath: webpackConfig.output.publicPath,
                    stats: { chunks: false, colors: true }
                }),
                webpackHotMiddleware(compiler)
            ]
        },
        files: [
            './src/index.ejs'
        ]
    });

    return Promise.resolve({ skip: true });
}

export default function start() {
    return clean().then(validateParam).then(function (env) {
        return Init(webpackDevConfig, env);
    }).then(serve);
}
