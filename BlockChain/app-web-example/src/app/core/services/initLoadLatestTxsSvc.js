import constant from '../../constant';

export default {
    name: 'InitLoadLatestTxsSvc',
    fn: ['$resource', function ($resource) {
        var svc = $resource(constant.apiBase + '/asset/initLoadLatestTxs', null, {
            initLoadLatestTxs: {
                method: 'GET',
                params: {
                    // category: 'login'
                }
            }
        });
        
        return svc;
    }]
};
