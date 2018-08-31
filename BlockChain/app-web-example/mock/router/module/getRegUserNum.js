'use strict';
/**
 * 查询注册用户数
 * http://139.224.34.167:80/api/asset/getRegUserNum
 */
function subRouter(express) {

    /*eslint-disable*/
    var router = express.Router();

    // 查询最新生成的区块
    router.get('/asset/getRegUserNum',
        function(req, res) {
            return res.json({
                "retCode": 200,
                "retMsg": "success",
                "retData": {
                    "regUserNum": 19999
                }
            });
        });

    return router;
}

export default {
    root: '/',
    router: subRouter
};
