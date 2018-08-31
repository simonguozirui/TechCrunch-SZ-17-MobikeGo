import angular from 'angular';
import uiRouter from 'angular-ui-router';
import angularP5 from '../plug/angular-p5.js';

import AppCtrl from '../../pages/app/AppCtrl';
import appView from '../../pages/app/appView.html';

import AppHomeCtrl from '../../pages/app.home/AppHomeCtrl';
import appHomeView from '../../pages/app.home/appHomeView.html';

export default angular.module('routers', [uiRouter, angularP5])
    .run(['$rootScope', '$interval', function ($rootScope, $interval) {
        // 改变路由，即停止监听
        $rootScope.$on('$stateChangeStart', function () {
            if ($rootScope.interval) {
                $interval.cancel($rootScope.isShowBtnInterval);
            }
        });
    }])
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                abstract: true,
                controller: AppCtrl,
                template: appView
            })
            .state('app.home', {
                url: '/',
                controller: AppHomeCtrl,
                template: appHomeView
            });

        $urlRouterProvider.otherwise('/');
    }])
    .name;
