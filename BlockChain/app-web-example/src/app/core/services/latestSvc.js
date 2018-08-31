import constant from '../../constant';

export default {
    name: 'LatestSvc',
    fn: ['$resource', function ($resource) {
        var svc = $resource(constant.apiBase + '/' + constant.channel + '/block/latest', null, {
            getLatest: {
                method: 'GET',
                params: {
                    // category: 'login'
                }
            }
        });

        return svc;
    }]
};
