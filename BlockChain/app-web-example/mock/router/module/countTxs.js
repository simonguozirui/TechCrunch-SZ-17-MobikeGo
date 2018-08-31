'use strict';
/**
 * 查询交易总数
 * http://139.224.34.167:80/api/asset/countTxs
 */
function subRouter(express) {

    /*eslint-disable*/
    var router = express.Router();

    // 查询最新生成的区块
    router.get('/asset/countTxs',
        function(req, res) {
            return res.json({
                "retCode": 200,
                "retMsg": "success",
                "retData": {
                    "txNum": 210
                }
            });
        });

    return router;
}

export default {
    root: '/',
    router: subRouter
};
