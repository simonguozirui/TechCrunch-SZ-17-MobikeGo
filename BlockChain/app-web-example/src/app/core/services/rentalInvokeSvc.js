import constant from '../../constant';

// Query rental balance
// GET /api/queryChaincode

export default {
    name: 'RentalInvokeSvc',
    fn: ['$resource', function ($resource) {
        var svc = $resource(constant.apiBase + '/invokeChaincode', null, {
            invokeChaincode: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                hasBody: true
            }
        });

        return svc;
    }]
};

