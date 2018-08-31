'use strict';

import notFound from '../middleware/notFound';
import latest from './module/latest';
import initLoadBlocks from './module/initLoadBlocks';
import nodeNumber from './module/nodeNumber';

var routerM, routesModules = [
        latest,
        initLoadBlocks,
        nodeNumber
    ];

function init(express, app, upload) {

    var rootPath = '/api';

    for (let i = 0, len = routesModules.length; i < len; i++) {
        routerM = routesModules[i];
        app.use(
            rootPath + routerM.root,
            routerM.router(express, upload)
        );
    }
    // 404 for api
    app.use(rootPath, notFound);
}
export default { init };
