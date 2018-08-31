import del from 'del';
import config from '../../config';

/**
 * Clean build folder
 *
 * @return {Promise}
 */
export default function clean() {
    return del([config.buildDir + '/**'], { dot: true });
}
