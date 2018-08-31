import constant from '../../constant';

export default {
    name: 'GetRegUserNumSvc',
    fn: ['$resource', function ($resource) {
        var svc = $resource(constant.apiBase + '/asset/getRegUserNum', null, {
            getRegUserNum: {
                method: 'GET',
                params: {
                    // category: 'login'
                }
            }
        });
        
        return svc;
    }]
};
