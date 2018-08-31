'use strict';
/**
 * 初始化加载最近交易列表
 * http://139.224.34.167:80/api/asset/initLoadLatestTxs
 */
function subRouter(express) {

    /*eslint-disable*/
    var router = express.Router();

    // 查询最新生成的区块
    router.get('/asset/initLoadLatestTxs',
        function(req, res) {
            return res.json({
                "retCode": 200,
                "retMsg": "success",
                "retData": {
                    "txs": [{
                        "transactionHash": "0xe27986435de6598c2c97a8849b5440f376270722274866c44609ad602c262ff3",
                        "blockNumber": 759595,
                        "txTime": 1487764328,
                        "hash":"0xeb165268813853f3096b69f9ecbdb4ff1a46789bb2e50ce56d4785e4c237f89f"
                    }, {
                        "transactionHash": "0x772b5bebc1ce2b7d0c815e664a94884020a368e5cf9c91dcb04c8989cf248724",
                        "blockNumber": 759595,
                        "txTime": 1487764328,
                        "hash":"0xeb165268813853f3096b69f9ecbdb4ff1a46789bb2e50ce56d4785e4c237f89f"
                    }, {
                        "transactionHash": "0x78dee662f337224cf3fe7db9beb4e96f00589f4593d91edb2ea854c55d888d06",
                        "blockNumber": 759595,
                        "txTime": 1487764328,
                        "hash":"0xeb165268813853f3096b69f9ecbdb4ff1a46789bb2e50ce56d4785e4c237f89f"
                    }, {
                        "transactionHash": "0x8162b4dbba85a7db81a7d06f0b0ff31e821ed4a45874fb00383e9753956513b1",
                        "blockNumber": 759595,
                        "txTime": 1487764328,
                        "hash":"0xeb165268813853f3096b69f9ecbdb4ff1a46789bb2e50ce56d4785e4c237f89f"
                    }, {
                        "transactionHash": "0xa87ea8ca9e43ca5f9be95c83e3c9d9400ea45383cbbc9dbb8452328c505721a6",
                        "blockNumber": 759595,
                        "txTime": 1487764328,
                        "hash":"0xeb165268813853f3096b69f9ecbdb4ff1a46789bb2e50ce56d4785e4c237f89f"
                    }, {
                        "transactionHash": "0xccd56ca9280b75a33c9be1266199a307e0b9b57546ef369444ebabc85e7e64bd",
                        "blockNumber": 759595,
                        "txTime": 1487764328,
                        "hash":"0xeb165268813853f3096b69f9ecbdb4ff1a46789bb2e50ce56d4785e4c237f89f"
                    }, {
                        "transactionHash": "0x479cb894717736d583b26345fce033aa8863787ce615ae302342833cfbcab234",
                        "blockNumber": 759595,
                        "txTime": 1487764328,
                        "hash":"0xeb165268813853f3096b69f9ecbdb4ff1a46789bb2e50ce56d4785e4c237f89f"
                    }]
                }
            });
        });

    return router;
}

export default {
    root: '/',
    router: subRouter
};
