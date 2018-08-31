import config from '../../config';

export default function validateEnv(env) {
    if(!env){
        env = config.defaultEnv;
    }
    return new Promise((resolve, reject) => {
        if (!Object.prototype.hasOwnProperty.call(config.env, env)) {
            return reject('部署环境仅支持：' + Object.keys(config.env).join(', ') + "，如需添加请修改根目录下文件config.js中的env属性！");
        }
        console.log('Using Environment: '+ env);
        resolve(env);
    });
}