// import Constant from '../../constant';

export default {
    name: 'httpFactory',
    fn: ['$rootScope', function ($rootScope) {
        return {
            error: function (msg) {
                $rootScope.isPopupShow = true;
                $rootScope.popupContent = msg;
            },
            success: function (res, cb) {
                if (res.status === 'SUCCESS' && cb) {
                    cb();
                } else {
                    this.error(res.message);
                }
            }
        };
    }]
};
