import config from '../../config';

export default function init(webpackConfig, env) {
    return new Promise((resolve, reject) => {
        /**
         * known issue: https://github.com/webpack/imports-loader/issues/33
         * resolve the problem by replace the comma with the URI encoded version %2C
         */
        var loader = {
            test: new RegExp('.*' + config.injectFile + '.*'),
            loader: 'imports-loader?' + config.injectName + '=>' + JSON.stringify(config.env[env]).replace(/,/g, '%2C')
        };
        console.log('\nEnvironment Configurations: \n' + JSON.stringify(config.env[env]));
        console.log('\nAddd Webpack Loader: \n', loader);
        webpackConfig.module.loaders.push(loader);
        resolve(webpackConfig);
    });
}
