'use strict';
/**
 * 查询节点数
 * http://139.224.34.167:80/api/node/nodeNumber
 */
function subRouter(express) {

    /*eslint-disable*/
    var router = express.Router();

    // 查询最新生成的区块
    router.get('/node/nodeNumber',
        function(req, res) {
            return res.json({
                "retCode": 200,
                "retMsg": "success",
                "retData": 8352
            });
        });

    return router;
}

export default {
    root: '/',
    router: subRouter
};
