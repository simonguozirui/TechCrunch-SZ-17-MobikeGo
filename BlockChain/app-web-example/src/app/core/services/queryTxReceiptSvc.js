import constant from '../../constant';

export default {
    name: 'QueryTxReceiptSvc',
    fn: ['$resource', function ($resource) {
        var svc = $resource(constant.apiBase + '/tx/queryTxReceipt/:txHash', null, {
            queryTxReceipt: {
                method: 'GET',
                params: {
                    txHash: '@txHash'
                }
            }
        });
        
        return svc;
    }]
};
