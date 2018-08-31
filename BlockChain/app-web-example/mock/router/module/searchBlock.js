'use strict';
/**
 * 查询最新生成的区块
 * http://139.224.34.167/api/block/latest
 */
function subRouter(express) {

    /*eslint-disable*/
    var router = express.Router();

    // 查询最新生成的区块
    router.get('/block/hash/:hash',
        function(req, res) {
            return res.json({
                "retCode": 200,
                "retMsg": "success",
                "retData": {
                    "block": {
                        "difficulty": "10292504",
                        "extraData": "0xd783010405844765746887676f312e352e31856c696e7578",
                        "gasLimit": 4712388,
                        "gasUsed": 0,
                        "hash": "0x32a5e55f068f5b534b477e84adfd07029f26bac6ea139be33ae99f171ce90fb9",
                        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                        "miner": "0x6c47f768cdbe4edec858142267829c9d19edb3f2",
                        "nonce": "0x2ebb063063f32c44",
                        "number": 20000,
                        "parentHash": "0x73f3cb81878aa3220b081396c1ae1c23417ce17abfe134eab279576f07ca68fd",
                        "receiptRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
                        "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
                        "size": 537,
                        "stateRoot": "0x31e79b08d803fc753c2ccde396e8589f91a3b4d0ac3508b88f1206564f94c46a",
                        "timestamp": 1473799564,
                        "totalDifficulty": "117001479956",
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
