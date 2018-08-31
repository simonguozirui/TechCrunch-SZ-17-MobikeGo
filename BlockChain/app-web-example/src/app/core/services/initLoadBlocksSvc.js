import constant from '../../constant';

export default {
    name: 'InitLoadBlocksSvc',
    fn: ['$resource', function ($resource) {
        var svc = $resource(constant.apiBase + '/' + constant.channel + '/block/initLoadBlocks', null, {
            initLoadBlocks: {
                method: 'GET',
                params: {
                    // category: 'login'
                }
            }
        });

        return svc;
    }]
};
