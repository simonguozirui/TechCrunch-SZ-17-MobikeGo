import constant from '../../constant';

export default {
    name: 'NodeNumberSvc',
    fn: ['$resource', function ($resource) {
        var svc = $resource(constant.apiBase + '/' + constant.channel + '/node/nodeNumber', null, {
            nodeNumber: {
                method: 'GET',
                params: {
                    // category: 'login'
                }
            }
        });

        return svc;
    }]
};
