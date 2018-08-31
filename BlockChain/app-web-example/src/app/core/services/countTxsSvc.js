import constant from '../../constant';

export default {
    name: 'CountTxsSvc',
    fn: ['$resource', function ($resource) {
        var svc = $resource(constant.apiBase + '/asset/countTxs', null, {
            countTxs: {
                method: 'GET',
                params: {
                    // category: 'login'
                }
            }
        });
        
        return svc;
    }]
};
