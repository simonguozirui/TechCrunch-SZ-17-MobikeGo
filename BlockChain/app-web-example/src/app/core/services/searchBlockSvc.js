import constant from '../../constant';

export default {
    name: 'SearchBlockSvc',
    fn: ['$resource', function ($resource) {
        var svc = $resource(constant.apiBase + '/block/hash/:hash', null, {
            getBlock: {
                method: 'GET',
                params: {
                    hash: '@hash'
                }
            }
        });
        
        return svc;
    }]
};
