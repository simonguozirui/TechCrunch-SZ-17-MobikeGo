import Constant from '../../constant';
import ZhEn from '../i18n/zhEn.js';

export default {
    name: 'searchFactory',
    fn: ['$rootScope', '$http', '$location', 'scrollFactory', function ($rootScope, $http, $location,  scrollFactory) {
        return function () {

            function search(code) {
                $rootScope.isLoadingShow = true;
                $http({
                    method: 'GET',
                    url: Constant.apiBase + '/asset/queryInfo/' + code
                }).then(function (res) {
                    if (res.data.status === 'SUCCESS') {
                        $rootScope.isLoadingShow = false;

                        $rootScope.hashCode = code;
                        $rootScope.queryInfo = res.data.retData;

                        $location.url('/transactionDetail?hashCode=' + code);
                        // 跳转后向下滚
                        scrollFactory.scrollDown();
                    }
                }, function () {
                    $http({
                        method: 'GET',
                        url: Constant.apiBase + '/block/hash/' + code
                    }).then(function (blockRes) {
                        if (blockRes.data.status === 'SUCCESS') {
                            let data = blockRes.data.retData.block;

                            $rootScope.isLoadingShow = false;

                            $rootScope.hashCode = code;
                            $rootScope.transactions = data.transactions;
                            $rootScope.transactionsL = data.transactions.length;
                            $rootScope.height = data.number;
                            $rootScope.time = data.timestamp * 1000;

                            $location.url('/blockDetail?hashCode=' + code);
                            // 跳转后向下滚
                            scrollFactory.scrollDown();
                        } else {
                            $rootScope.isLoadingShow = false;
                            $rootScope.isPopupShow = true;
                            $rootScope.popupContent = ZhEn.popupTips[$rootScope.language];
                        }
                    }, function () {
                        $rootScope.isLoadingShow = false;
                        $rootScope.isPopupShow = true;
                        $rootScope.popupContent = ZhEn.popupTips[$rootScope.language];
                    });
                });
            }

            $rootScope.submit = function (code) {
                search(code);
            };
            $rootScope.entrySearch = function ($event, code) {
                if ($event.keyCode === 13 && code) {
                    search(code);
                }
            };
        };
    }]
};
