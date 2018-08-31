'use strict';
/**
 * 通过通过资产发布生成的transHash值查询资产的交易信息。
 * http://139.224.34.167/api/asset/queryInfo/{transHash}
 */
function subRouter(express) {

    /*eslint-disable*/
    var router = express.Router();

    // 获取需要补件内容接口
    router.get('/asset/queryInfo/:transHash',
        function(req, res) {
            return res.json({
                "retCode": 200,
                "retMsg": "success",
                "retData": {
                    "hash":"0xe63ac2af82d2897737e5990842fdc5482f2320bf74277b2c464e1c964caf94d5",
                    "appCity": "SH",
                    "applyDate": 1487833680007,
                    "category": "I201",
                    "companyName": "test company1",
                    "externalId": "TD000000001",
                    "id": 1,
                    "loanMaturityByDay": 7,
                    "orderDate": 1487833680007,
                    "paymentMethod": "BULLET",
                    "purpose": "SUPPLY_CHAIN_TRADING",
                    "scene": "SUPPLY_CHAIN",
                    "status": "NEW"
                }
            });
        });

    return router;
}

export default {
    root: '/',
    router: subRouter
};
