'use strict';
/**
 * 查询交易凭证信息
 * http://139.224.34.167/api/tx/queryTxReceipt/{txHash}
 */
function subRouter(express) {

    /*eslint-disable*/
    var router = express.Router();

    // 获取需要补件内容接口
    router.get('/tx/queryTxReceipt/:txHash',
        function(req, res) {
            return res.json({
                "retCode": 200,
                "retMsg": "success",
                "retData": {
                    "blockHash": "0xc8cda20d546c70b9fff45ef6cd295e3eb53c6b6d4e050c74f9910779d0a209f0",
                    "blockNumber": 457174,
                    "contractAddress": null,
                    "cumulativeGasUsed": 21000,
                    "from": "0x57ca1ed836cf7923489ff3043ade882cc29c5b7f",
                    "gasUsed": 21000,
                    "logs": [],
                    "root": "0159d1f2e6c264f64f7db965dd1fba99323f64b246a93f98ce140b9d75d5dea7",
                    "to": "0xab2d33d49f5a9200ef153468ea04277f0ba2bfd2",
                    "transactionHash": "0xbc913527995831aae1c40251ef58abdc45d86e24fccf62cce314e3d5681ea06a",
                    "transactionIndex": 0
                }
            });
        });

    return router;
}

export default {
    root: '/',
    router: subRouter
};
