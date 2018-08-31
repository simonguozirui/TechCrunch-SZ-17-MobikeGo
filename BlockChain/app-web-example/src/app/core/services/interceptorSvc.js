export default {
    name: 'InterceptorSvc',
    fn: [function () {

        var responseError = function (rejection) {
            // console.log(rejection);
            return rejection;
        };

        var responseHandler = function (response) {
            // console.log(response);
            return response;
        };

        return {
            responseError: responseError,
            response: responseHandler
        };

    }]
};
