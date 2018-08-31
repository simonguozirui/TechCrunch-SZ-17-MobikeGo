'use strict';
/**
 * 查询最新生成的区块
 * http://139.224.34.167/api/block/latest
 */
function subRouter(express) {

    /*eslint-disable*/
    var router = express.Router();

    // 查询最新生成的区块
    router.get('/block/latest',
        function(req, res) {
            return res.json({
                "retCode": 200,
                "retMsg": "success",
                "retData": {
                    "block": {
                        "difficulty": "3375383",
                        "extraData": "0xd783010405844765746887676f312e352e31856c696e7578",
                        "gasLimit": 210000000,
                        "gasUsed": 0,
                        "hash": "0x8066cc03e4169bad4d9fddf26eb73e1e01fc8f2515c29e0807c44fe96f281d2c",
                        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                        "miner": "0xfbfb40663e94fcaa269b775a22617ff1c2c1d829",
                        "nonce": "0x62ebdc6e0086d477",
                        "number": 759642,
                        "parentHash": "0x46c83d68c6a630eb2de50aeb8281c2a1a2d0cc8effa19fd29639358793f6b18a",
                        "receiptRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
                        "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
                        "size": 539,
                        "stateRoot": "0xbdcfd9ad8e9dc8b4aeff1b74ee8647baecb289afde8f64ebcd99f5a8d1fa98ce",
                        "timestamp": 1487765196,
                        "totalDifficulty": "4071689931184",
                        "transactions": [
                            "0xf0cda282a267bf0b64b0895cf1f0ffcbf0a90364efa5698a8bf58c11ac1d70ed",
                            "1xf0cda282a267bf0b64b0895cf1f0ffcbf0a90364efa5698a8bf58c11ac1d70ed",
                            "2xf0cda282a267bf0b64b0895cf1f0ffcbf0a90364efa5698a8bf58c11ac1d70ed",
                            "3xf0cda282a267bf0b64b0895cf1f0ffcbf0a90364efa5698a8bf58c11ac1d70ed",
                        ],
                        "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
                        "uncles": []
                    }
                }
            });
        });

    return router;
}

export default {
    root: '/',
    router: subRouter
};
