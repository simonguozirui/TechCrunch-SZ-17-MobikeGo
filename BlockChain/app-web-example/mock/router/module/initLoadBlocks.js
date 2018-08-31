'use strict';
/**
 * 初始化加载区块信息列表
 * http://139.224.34.167:80/api/block/initLoadBlocks
 */
function subRouter(express) {

    /*eslint-disable*/
    var router = express.Router();

    // 查询最新生成的区块
    router.get('/block/initLoadBlocks',
        function(req, res) {
            return res.json({
                "retCode": 200,
                "retMsg": "success",
                "retData": {
                    "blocks": [{
                            "difficulty": "3378045",
                            "extraData": "0xd783010405844765746887676f312e352e31856c696e7578",
                            "gasLimit": 210000000,
                            "gasUsed": 158011,
                            "hash": "0xeb165268813853f3096b69f9ecbdb4ff1a46789bb2e50ce56d4785e4c237f89f",
                            "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000080000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                            "miner": "0xfbfb40663e94fcaa269b775a22617ff1c2c1d829",
                            "nonce": "0x1b1198caa3264c8b",
                            "number": 759622,
                            "parentHash": "0xe63ac2af82d2897737e5990842fdc5482f2320bf74277b2c464e1c964caf94d5",
                            "receiptRoot": "0x9d27c55050132a9a259cf29202c6e27645e2c44c19db452a32805f08b69daf33",
                            "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
                            "size": 1132,
                            "stateRoot": "0x9b8c779d6e63b102e9cac23b0bfa730771966ede64a72cf69f911a3f952b84d0",
                            "timestamp": 1487764813,
                            "totalDifficulty": "4071622416384",
                            "transactions": [
                                "0xf0cda282a267bf0b64b0895cf1f0ffcbf0a90364efa5698a8bf58c11ac1d70ed"
                            ],
                            "transactionsRoot": "0x1218c8ef204f2c95baef3d5dde6b4c2955f04435b2ec3b40d408f26c7290908d",
                            "uncles": []
                        }, {
                            "difficulty": "3379663",
                            "extraData": "0xd783010405844765746887676f312e352e31856c696e7578",
                            "gasLimit": 210000000,
                            "gasUsed": 0,
                            "hash": "0xe63ac2af82d2897737e5990842fdc5482f2320bf74277b2c464e1c964caf94d5",
                            "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                            "miner": "0xfbfb40663e94fcaa269b775a22617ff1c2c1d829",
                            "nonce": "0x6838577ad3fc4d97",
                            "number": 759621,
                            "parentHash": "0xed9fbf7b91d21b00829e6e3b4419a4a124df99735d09e35032c48afe6320058e",
                            "receiptRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
                            "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
                            "size": 539,
                            "stateRoot": "0x29a7516d2e6f09defff92990193258dd4cf5359dce344ddb5a304f70388f0c9c",
                            "timestamp": 1487764800,
                            "totalDifficulty": "4071619038339",
                            "transactions": [],
                            "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
                            "uncles": []
                        }
                    ]
                }
            });
        });

    return router;
}

export default {
    root: '/',
    router: subRouter
};
