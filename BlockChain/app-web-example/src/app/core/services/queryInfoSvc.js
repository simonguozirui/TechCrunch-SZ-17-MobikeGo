import constant from '../../constant';

// 查询资产信息
// GET http://139.224.34.167/api/asset/queryInfo/{transHash}

export default {
    name: 'QueryInfoSvc',
    fn: ['$resource', function ($resource) {
        var svc = $resource(constant.apiBase + '/asset/queryInfo/:transHash', null, {
            queryInfo: {
                method: 'GET',
                params: {
                    transHash: '@transHash'
                }
            }
        });
        
        return svc;
    }]
};
