import angular from 'angular';
import style from './appView.scss';
import ZhEn from '../../core/i18n/zhEn.js';
import Constant from '../../constant';

export default ['$rootScope', '$scope', '$location', '$interval', '$timeout', 'httpFactory', 'LatestSvc', 'NodeNumberSvc', 'InitLoadBlocksSvc', 'RentalQuerySvc', 'RentalInvokeSvc', function ($rootScope, $scope, $location, $interval, $timeout, httpFactory, LatestSvc, NodeNumberSvc, InitLoadBlocksSvc, RentalQuerySvc, RentalInvokeSvc) {
    'ngInject';

    var ACTION = {
        START: 'rentalStart',
        STOP: 'rentalStop'
    };

    var intervalId = null;

    $scope.$on('$destroy', function () {
        if (intervalId) {
            $interval.cancel(intervalId);
            intervalId = null;
        }
    });

    var updateRentalDuration = function () {
        $scope.rental.rentalDuration += 1;
        $scope.rental.stop.args[2] = $scope.rental.rentalDuration.toString();
    };

    $rootScope.zhEn = ZhEn;
    $rootScope.language = localStorage.getItem('language') ? localStorage.getItem('language') : 'zh';
    $rootScope.isLoadingShow = false;
    $scope.style = style;
    $scope.block = {};
    $scope.executing = false;
    $scope.rental = {
        action: ACTION.START,
        user: 'testuser',
        query: {
            channelName: Constant.channel,
            chaincodeName: Constant.chaincodeName,
            chaincodeVersion: Constant.chaincodeVersion,
            chaincodePath: Constant.chaincodePath,
            fnc: 'invoke',
            args: ['query', 'testuser']
        },
        start: {
            channelName: Constant.channel,
            chaincodeName: Constant.chaincodeName,
            chaincodeVersion: Constant.chaincodeVersion,
            chaincodePath: Constant.chaincodePath,
            fnc: 'invoke',
            args: ['start', 'testuser', '0']
        },
        stop: {
            channelName: Constant.channel,
            chaincodeName: Constant.chaincodeName,
            chaincodeVersion: Constant.chaincodeVersion,
            chaincodePath: Constant.chaincodePath,
            fnc: 'invoke',
            args: ['stop', 'testuser', '']
        },
        started: false,
        inited: false,
        rentalDuration: 0,
        rentalCost: 0,
        invoke: function () {
            if ($scope.executing) {
                return;
            }

            $scope.executing = true;

            RentalInvokeSvc.invokeChaincode($scope.rental.started ? $scope.rental.stop : $scope.rental.start, function (res) {
                httpFactory.success(res, function () {
                    $scope.rental.started = !$scope.rental.started;
                    $scope.rental.inited = true;
                    if ($scope.rental.started) {
                        $scope.rental.action = ACTION.STOP;

                        $scope.rental.rentalDuration = 0;

                        intervalId = $interval(updateRentalDuration, 1000);
                    } else {
                        $scope.rental.action = ACTION.START;
                        if (intervalId) {
                            $interval.cancel(intervalId);
                            intervalId = null;
                        }
                    }

                    if ($scope.rental.started === false) {
                        RentalQuerySvc.queryChaincode($scope.rental.query, function (data) {
                            httpFactory.success(data, function () {
                                $scope.rental.rentalCost = $scope.rental.balance - data.data.chaincodeTransaction.chaincodeData;
                                $scope.rental.balance = data.data.chaincodeTransaction.chaincodeData;
                            });
                        }, function (err) {
                            httpFactory.error(err.status + ' : ' + err.data.message);
                        });
                    }
                    $scope.executing = false;
                }, function () {
                    $scope.executing = false;
                });
            }, function (err) {
                httpFactory.error(err.status + ' : ' + err.data.message);
                $scope.executing = false;
            });
        }
    };

    // zh en change
    $scope.changeLanguage = function () {
        $rootScope.language = $rootScope.language === 'zh' ? 'en' : 'zh';
        localStorage.setItem('language', $rootScope.language);
    };

    // Query node number
    NodeNumberSvc.nodeNumber(function (res) {
        httpFactory.success(res, function () {
            $scope.block.nodeNumber = res.data.value;
        });
    }, function (err) {
        httpFactory.error(err.status + ' : ' + err.data.message);
    });

    RentalQuerySvc.queryChaincode($scope.rental.query, function (res) {
        httpFactory.success(res, function () {
            $scope.rental.balance = res.data.chaincodeTransaction.chaincodeData;
        });
    }, function (err) {
        httpFactory.error(err.status + ' : ' + err.data.message);
    });

    // Close popup
    $scope.block.popupFn = function () {
        $rootScope.isPopupShow = false;
    };

    $scope.initLoadLatestTxs = [];
    $scope.initLoadBlocks = [];

    // Load blocks
    InitLoadBlocksSvc.initLoadBlocks(function (res) {
        httpFactory.success(res, function () {
            angular.forEach(res.data.blocks, function (val) {
                val.timestamp = val.timestamp * 1000;
            });
            $scope.initLoadBlocks = res.data.blocks;
            $rootScope.blockHeight = $scope.initLoadBlocks[0].number;
        });
    }, function (err) {
        httpFactory.error(err.status + ' : ' + err.data.message);
    });

    // Query latest blocks
    $interval(function () {
        LatestSvc.getLatest(function (res) {
            httpFactory.success(res, function () {
                let data = res.data.block;

                if ($scope.initLoadBlocks.length === 0 || $scope.initLoadBlocks[0].hash !== data.hash) {
                    let l = data.transactions.length;

                    $rootScope.blockHeight = data.number;
                    $rootScope.countTxs += l;

                    data.addStart = true;
                    data.timestamp = data.timestamp * 1000;
                    $scope.initLoadBlocks.unshift(data);
                    $scope.initLoadBlocks.length = $scope.initLoadBlocks.length > 7 ? 7 : $scope.initLoadBlocks.length;
                    $timeout(function () {
                        data.addEnd = true;
                    }, 200);

                    for (let i = 0; i < l; i++) {
                        let arr = {};

                        arr.addStart = true;
                        arr.transactionHash = data.transactions[i];
                        arr.blockNumber = data.number;
                        arr.txTime = data.timestamp;
                        $scope.initLoadLatestTxs.unshift(arr);
                        $scope.initLoadLatestTxs.length = $scope.initLoadLatestTxs.length > 7 ? 7 : $scope.initLoadLatestTxs.length;
                        $timeout(function () {
                            arr.addEnd = true;
                        }, 200);
                        if (i >= 6) {
                            break;
                        }
                    }
                }
            });
        }, function (err) {
            httpFactory.error(err.status + ' : ' + err.data.message);
        });
    }, 15000);

}];
